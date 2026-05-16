from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import AnalyticsViewSet, JobApplicationViewSet, JobPostViewSet, NotificationViewSet, ResumeViewSet, SkillViewSet, resume_match

router = DefaultRouter()
router.register("applications", JobApplicationViewSet, basename="applications")
router.register("resumes", ResumeViewSet, basename="resumes")
router.register("notifications", NotificationViewSet, basename="notifications")
router.register("job-posts", JobPostViewSet, basename="job-posts")
router.register("skills", SkillViewSet, basename="skills")
router.register("analytics", AnalyticsViewSet, basename="analytics")

urlpatterns = [
    path("", include(router.urls)),
    path("resume-match/", resume_match, name="resume-match"),
]
