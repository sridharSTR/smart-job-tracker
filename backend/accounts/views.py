from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.db import transaction
from django.utils import timezone
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from datetime import timedelta
import secrets

from rest_framework import filters, generics, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .email import send_app_mail
from .models import EmailOTP
from .permissions import IsAdminOrRecruiter
from .serializers import (
    AdminUserSerializer,
    ForgotPasswordSerializer,
    LoginSerializer,
    RegisterSerializer,
    ResetPasswordSerializer,
    UserSerializer,
    VerifyLoginOTPSerializer,
    VerifyOTPSerializer,
)
from .signals import registration_verified

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        with transaction.atomic():
            user = serializer.save()
            send_otp_email(user, EmailOTP.Purpose.REGISTER)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            pending_response = self._resend_pending_registration_otp(request.data)
            if pending_response:
                return pending_response
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        data = serializer.data
        data["detail"] = f"Registration created. OTP sent to {data.get('email')}."
        return Response(data, status=status.HTTP_201_CREATED, headers=headers)

    def _resend_pending_registration_otp(self, data):
        username = (data.get("username") or "").strip()
        email = (data.get("email") or "").strip()
        if not username or not email:
            return None

        user = User.objects.filter(username=username, email__iexact=email).first()
        if not user or user.is_active or user.is_email_verified:
            return None

        send_otp_email(user, EmailOTP.Purpose.REGISTER)
        return Response(
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role,
                "detail": f"Account already pending verification. New OTP sent to {user.email}.",
            },
            status=status.HTTP_200_OK,
        )


class VerifyRegistrationOTPView(generics.GenericAPIView):
    serializer_class = VerifyOTPSerializer
    permission_classes = [permissions.AllowAny]

    def get_serializer_context(self):
        return {**super().get_serializer_context(), "purpose": EmailOTP.Purpose.REGISTER}

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        serializer.mark_used()
        user.is_active = True
        user.is_email_verified = True
        user.save(update_fields=["is_active", "is_email_verified"])
        registration_verified.send(sender=user.__class__, user=user)
        return Response({"detail": "Email verified successfully. You can now log in."})


class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        send_otp_email(user, EmailOTP.Purpose.LOGIN)
        return Response({"otp_required": True, "email": user.email, "detail": f"Login OTP sent to {user.email}."})


class VerifyLoginOTPView(generics.GenericAPIView):
    serializer_class = VerifyLoginOTPSerializer
    permission_classes = [permissions.AllowAny]

    def get_serializer_context(self):
        return {**super().get_serializer_context(), "purpose": EmailOTP.Purpose.LOGIN}

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.create_tokens(request=request))


class ForgotPasswordView(generics.GenericAPIView):
    serializer_class = ForgotPasswordSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        user = User.objects.filter(email__iexact=email).first()

        if user:
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            reset_url = f"{settings.FRONTEND_URL.rstrip('/')}/reset-password/{uid}/{token}"
            send_app_mail(
                "Reset your Smart Job Tracker password",
                f"Use this secure link to reset your password: {reset_url}",
                [user.email],
                fail_silently=True,
            )

        return Response({"detail": "If that email is registered, a password reset link has been sent."})


class ResetPasswordView(generics.GenericAPIView):
    serializer_class = ResetPasswordSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        send_app_mail(
            "Smart Job Tracker password reset successful",
            "Your Smart Job Tracker password was reset successfully.",
            [user.email],
            fail_silently=True,
        )
        return Response({"detail": "Password updated successfully."})


class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class UserAdminViewSet(viewsets.ModelViewSet):
    queryset = User.objects.order_by("-created_at")
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdminOrRecruiter]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["username", "email", "first_name", "last_name"]
    ordering_fields = ["created_at", "username", "email"]

    @action(detail=True, methods=["post"])
    def suspend(self, request, pk=None):
        user = self.get_object()
        user.is_suspended = not user.is_suspended
        user.save(update_fields=["is_suspended"])
        return Response(self.get_serializer(user).data)


def send_otp_email(user, purpose):
    code = f"{secrets.randbelow(1_000_000):06d}"
    EmailOTP.objects.filter(user=user, purpose=purpose, is_used=False).update(is_used=True)
    otp = EmailOTP(user=user, purpose=purpose, expires_at=timezone.now() + timedelta(minutes=10))
    otp.set_code(code)
    otp.save()

    subject = "Smart Job Tracker verification OTP"
    action = "complete your registration" if purpose == EmailOTP.Purpose.REGISTER else "complete your login"
    try:
        send_app_mail(
            subject,
            f"Your Smart Job Tracker OTP is {code}. Use it within 10 minutes to {action}.",
            [user.email],
        )
    except Exception:
        otp.is_used = True
        otp.save(update_fields=["is_used"])
        raise
