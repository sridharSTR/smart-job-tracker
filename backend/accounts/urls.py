from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    ForgotPasswordView,
    MeView,
    RegisterView,
    ResetPasswordView,
    UserAdminViewSet,
    VerifyLoginOTPView,
    VerifyRegistrationOTPView,
)

router = DefaultRouter()
router.register("users", UserAdminViewSet, basename="admin-users")

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("verify-registration-otp/", VerifyRegistrationOTPView.as_view(), name="verify-registration-otp"),
    path("verify-login-otp/", VerifyLoginOTPView.as_view(), name="verify-login-otp"),
    path("forgot-password/", ForgotPasswordView.as_view(), name="forgot-password"),
    path("reset-password/", ResetPasswordView.as_view(), name="reset-password"),
    path("me/", MeView.as_view(), name="me"),
    path("", include(router.urls)),
]
