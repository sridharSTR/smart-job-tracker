from django.conf import settings
from django.db import models


class Skill(models.Model):
    name = models.CharField(max_length=80, unique=True)

    def __str__(self):
        return self.name


class JobApplication(models.Model):
    class Status(models.TextChoices):
        APPLIED = "Applied", "Applied"
        OA = "OA", "OA"
        SHORTLISTED = "Shortlisted", "Shortlisted"
        INTERVIEW = "Interview", "Interview"
        HR_ROUND = "HR Round", "HR Round"
        REJECTED = "Rejected", "Rejected"
        OFFER = "Offer", "Offer"

    class Workplace(models.TextChoices):
        REMOTE = "Remote", "Remote"
        HYBRID = "Hybrid", "Hybrid"
        ONSITE = "Onsite", "Onsite"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="applications")
    job_post = models.ForeignKey("JobPost", on_delete=models.SET_NULL, related_name="applications", blank=True, null=True)
    company_name = models.CharField(max_length=160)
    role_title = models.CharField(max_length=160)
    salary_offered = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    location = models.CharField(max_length=160, blank=True)
    job_type = models.CharField(max_length=80, blank=True)
    workplace = models.CharField(max_length=20, choices=Workplace.choices, default=Workplace.REMOTE)
    application_date = models.DateField()
    interview_date = models.DateTimeField(blank=True, null=True)
    deadline = models.DateTimeField(blank=True, null=True)
    status = models.CharField(max_length=40, choices=Status.choices, default=Status.APPLIED)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-application_date", "-created_at"]
        indexes = [
            models.Index(fields=["user", "status"]),
            models.Index(fields=["company_name"]),
            models.Index(fields=["application_date"]),
        ]

    def __str__(self):
        return f"{self.company_name} - {self.role_title}"


class Resume(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="resumes")
    title = models.CharField(max_length=120)
    file = models.FileField(upload_to="resumes/")
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-is_primary", "-created_at"]


class Notification(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notifications")
    title = models.CharField(max_length=160)
    message = models.TextField()
    due_at = models.DateTimeField(blank=True, null=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]


class JobPost(models.Model):
    recruiter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="job_posts")
    title = models.CharField(max_length=160)
    company = models.CharField(max_length=160)
    location = models.CharField(max_length=160)
    workplace = models.CharField(max_length=20, choices=JobApplication.Workplace.choices, default=JobApplication.Workplace.HYBRID)
    salary_range = models.CharField(max_length=120, blank=True)
    description = models.TextField()
    skills = models.ManyToManyField(Skill, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
