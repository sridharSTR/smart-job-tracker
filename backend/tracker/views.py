from collections import Counter

from django.contrib.auth import get_user_model
from django.db import transaction
from django.db.models import Count, Q
from django.db.models.functions import TruncMonth
from django.http import FileResponse, HttpResponse
from rest_framework import decorators, filters, status, viewsets
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response

from accounts.email import send_app_mail
from accounts.permissions import IsAdminOrRecruiter
from .models import JobApplication, JobPost, Notification, Resume, Skill
from .permissions import IsOwnerOrAdmin, IsRecruiterWriteOrReadOnly
from .serializers import JobApplicationSerializer, JobPostSerializer, NotificationSerializer, ResumeMatchSerializer, ResumeSerializer, SkillSerializer

User = get_user_model()


class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.order_by("name")
    serializer_class = SkillSerializer


class JobApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = JobApplicationSerializer
    permission_classes = [IsOwnerOrAdmin]
    search_fields = ["company_name", "role_title", "location", "notes"]
    filterset_fields = ["status", "company_name", "application_date", "workplace"]
    ordering_fields = ["application_date", "company_name", "status", "salary_offered"]

    def get_queryset(self):
        qs = JobApplication.objects.select_related("user", "job_post", "job_post__recruiter")
        if self.request.user.is_staff or getattr(self.request.user, "role", None) == "ADMIN":
            return qs
        if getattr(self.request.user, "role", None) == "RECRUITER":
            return qs.filter(job_post__recruiter=self.request.user)
        return qs.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        previous = self.get_object()
        old_interview_date = previous.interview_date
        old_status = previous.status
        application = serializer.save()
        became_interview = application.status in {
            JobApplication.Status.INTERVIEW,
            JobApplication.Status.HR_ROUND,
        }
        interview_changed = application.interview_date and application.interview_date != old_interview_date
        status_changed_to_interview = application.status != old_status and became_interview
        if became_interview and (interview_changed or status_changed_to_interview):
            meeting_link = _extract_meeting_link(application.notes)
            when = application.interview_date.strftime("%b %d, %Y %I:%M %p %Z") if application.interview_date else "the scheduled time"
            message = (
                f"Your interview for {application.role_title} at {application.company_name} is scheduled for {when}."
            )
            if meeting_link:
                message += f"\nMeeting link: {meeting_link}"
            if application.notes:
                message += f"\n\nNotes:\n{application.notes}"
            Notification.objects.create(
                user=application.user,
                title="Interview scheduled",
                message=message,
                due_at=application.interview_date,
            )
            send_app_mail(
                "Smart Job Tracker interview scheduled",
                message,
                [application.user.email],
                fail_silently=True,
            )

    @decorators.action(detail=False, methods=["get"])
    def export_csv(self, request):
        rows = self.get_queryset()
        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = 'attachment; filename="applications.csv"'
        response.write("Company,Role,Status,Location,Application Date,Interview Date\n")
        for app in rows:
            response.write(f"{app.company_name},{app.role_title},{app.status},{app.location},{app.application_date},{app.interview_date or ''}\n")
        return response


class ResumeViewSet(viewsets.ModelViewSet):
    serializer_class = ResumeSerializer
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsOwnerOrAdmin]

    def get_queryset(self):
        if self.request.user.is_staff or getattr(self.request.user, "role", None) in {"ADMIN", "RECRUITER"}:
            return Resume.objects.select_related("user")
        return Resume.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        if serializer.validated_data.get("is_primary"):
            Resume.objects.filter(user=self.request.user).update(is_primary=False)
        serializer.save(user=self.request.user)

    @decorators.action(detail=True, methods=["get"])
    def download(self, request, pk=None):
        resume = self.get_object()
        response = FileResponse(resume.file.open("rb"), content_type="application/pdf")
        response["Content-Disposition"] = f'attachment; filename="{resume.title}"'
        return response


class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsOwnerOrAdmin]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        recipient = serializer.validated_data.pop("recipient_user", self.request.user)
        with transaction.atomic():
            notification = serializer.save(user=recipient)
            send_app_mail(
                notification.title,
                notification.message,
                [recipient.email],
            )

    @decorators.action(detail=True, methods=["post"])
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save(update_fields=["is_read"])
        return Response(self.get_serializer(notification).data)


class JobPostViewSet(viewsets.ModelViewSet):
    queryset = JobPost.objects.prefetch_related("skills").select_related("recruiter")
    serializer_class = JobPostSerializer
    permission_classes = [IsRecruiterWriteOrReadOnly]
    search_fields = ["title", "company", "location", "description"]
    filterset_fields = ["workplace", "is_active"]
    ordering_fields = ["created_at", "company", "title"]

    def get_queryset(self):
        qs = JobPost.objects.prefetch_related("skills").select_related("recruiter")
        user = self.request.user
        if user.is_staff or getattr(user, "role", None) == "ADMIN":
            return qs
        if getattr(user, "role", None) == "RECRUITER":
            return qs.filter(recruiter=user)
        return qs.filter(is_active=True)

    def perform_create(self, serializer):
        serializer.save(recruiter=self.request.user)


class AnalyticsViewSet(viewsets.ViewSet):
    def list(self, request):
        apps = JobApplication.objects.all() if request.user.role in {"ADMIN", "RECRUITER"} or request.user.is_staff else request.user.applications.all()
        status_counts = Counter(apps.values_list("status", flat=True))
        monthly = (
            apps.annotate(month=TruncMonth("application_date"))
            .values("month")
            .annotate(total=Count("id"))
            .order_by("month")
        )
        return Response(
            {
                "totals": {
                    "applications": apps.count(),
                    "interviews": apps.filter(status__in=["Interview", "HR Round"]).count(),
                    "offers": apps.filter(status="Offer").count(),
                    "rejections": apps.filter(status="Rejected").count(),
                    "unread_notifications": request.user.notifications.filter(is_read=False).count(),
                },
                "status_counts": [{"name": key, "value": value} for key, value in status_counts.items()],
                "monthly": [{"month": row["month"].strftime("%b %Y"), "applications": row["total"]} for row in monthly],
                "recent_activity": list(apps.values("id", "company_name", "role_title", "status", "updated_at")[:8]),
            }
        )

    @decorators.action(detail=False, methods=["get"], permission_classes=[IsAdminOrRecruiter])
    def platform(self, request):
        applications_by_month = (
            JobApplication.objects.annotate(month=TruncMonth("application_date"))
            .values("month")
            .annotate(total=Count("id"))
            .order_by("month")
        )
        users_by_month = (
            User.objects.annotate(month=TruncMonth("created_at"))
            .values("month")
            .annotate(total=Count("id"))
            .order_by("month")
        )
        status_counts = JobApplication.objects.values("status").annotate(total=Count("id")).order_by("status")
        recent_applications = JobApplication.objects.select_related("user").order_by("-updated_at")[:8]
        recent_jobs = JobPost.objects.select_related("recruiter").order_by("-created_at")[:8]
        return Response(
            {
                "total_users": User.objects.count(),
                "total_recruiters": User.objects.filter(role="RECRUITER").count(),
                "total_admins": User.objects.filter(Q(role="ADMIN") | Q(is_staff=True)).distinct().count(),
                "total_applications": JobApplication.objects.count(),
                "total_job_posts": JobPost.objects.count(),
                "active_job_posts": JobPost.objects.filter(is_active=True).count(),
                "monthly_applications": [
                    {"month": row["month"].strftime("%b %Y"), "applications": row["total"]}
                    for row in applications_by_month
                    if row["month"]
                ],
                "user_growth": [
                    {"month": row["month"].strftime("%b %Y"), "users": row["total"]}
                    for row in users_by_month
                    if row["month"]
                ],
                "application_status": [{"name": row["status"], "value": row["total"]} for row in status_counts],
                "recent_activity": [
                    {
                        "id": app.id,
                        "type": "Application",
                        "title": f"{app.user.username} applied for {app.role_title}",
                        "detail": app.company_name,
                        "created_at": app.updated_at,
                    }
                    for app in recent_applications
                ]
                + [
                    {
                        "id": job.id,
                        "type": "Job",
                        "title": f"{job.title} posted",
                        "detail": f"{job.company} by {job.recruiter.username}",
                        "created_at": job.created_at,
                    }
                    for job in recent_jobs
                ],
            }
        )


@decorators.api_view(["POST"])
def resume_match(request):
    serializer = ResumeMatchSerializer(data=request.data, context={"request": request})
    serializer.is_valid(raise_exception=True)
    return Response(serializer.score(), status=status.HTTP_200_OK)


def _extract_meeting_link(notes):
    for line in (notes or "").splitlines():
        if line.lower().startswith("meeting link:"):
            return line.split(":", 1)[1].strip()
    return ""
