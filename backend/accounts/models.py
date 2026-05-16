from django.contrib.auth.models import AbstractUser
from django.contrib.auth.hashers import check_password, make_password
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    class Role(models.TextChoices):
        USER = "USER", "User"
        RECRUITER = "RECRUITER", "Recruiter"
        ADMIN = "ADMIN", "Admin"

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.USER)
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)
    bio = models.TextField(blank=True)
    experience = models.TextField(blank=True)
    education = models.TextField(blank=True)
    is_suspended = models.BooleanField(default=False)
    is_email_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    REQUIRED_FIELDS = ["email"]

    @property
    def is_recruiter(self):
        return self.role in {self.Role.RECRUITER, self.Role.ADMIN} or self.is_staff

    @property
    def is_platform_admin(self):
        return self.role == self.Role.ADMIN or self.is_staff


class EmailOTP(models.Model):
    class Purpose(models.TextChoices):
        REGISTER = "REGISTER", "Register"
        LOGIN = "LOGIN", "Login"

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="email_otps")
    purpose = models.CharField(max_length=20, choices=Purpose.choices)
    code_hash = models.CharField(max_length=128)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["user", "purpose", "is_used", "expires_at"]),
        ]

    def set_code(self, code):
        self.code_hash = make_password(code)

    def check_code(self, code):
        return not self.is_used and self.expires_at >= timezone.now() and check_password(code, self.code_hash)
