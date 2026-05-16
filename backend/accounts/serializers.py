from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.signals import user_logged_in
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import EmailOTP

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source="get_full_name", read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "full_name",
            "role",
            "avatar",
            "bio",
            "experience",
            "education",
            "is_suspended",
            "is_email_verified",
            "created_at",
        ]
        read_only_fields = ["id", "is_suspended", "created_at"]

    def validate_email(self, value):
        return validate_user_email(value)


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8, validators=[validate_password])
    role = serializers.ChoiceField(choices=User.Role.choices, default=User.Role.USER)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "first_name", "last_name", "role"]

    def validate_email(self, value):
        return validate_user_email(value)

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.is_active = False
        user.is_email_verified = False
        user.save()
        return user


class AdminUserSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        read_only_fields = ["id", "created_at"]


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=User.Role.choices, required=False)

    def validate(self, attrs):
        requested_role = attrs.get("role")
        user = authenticate(
            request=self.context.get("request"),
            username=attrs["username"],
            password=attrs["password"],
        )

        if not user:
            raise serializers.ValidationError("Invalid username or password.")

        if getattr(user, "is_suspended", False):
            raise serializers.ValidationError("This account is suspended.")

        if user.is_staff and user.role != User.Role.ADMIN:
            user.role = User.Role.ADMIN
            user.is_email_verified = True
            user.save(update_fields=["role", "is_email_verified"])

        if requested_role and user.role != requested_role:
            raise serializers.ValidationError("Selected role does not match this account.")

        attrs["user"] = user
        return attrs


class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(min_length=6, max_length=6)

    def validate(self, attrs):
        purpose = self.context["purpose"]
        user = User.objects.filter(email__iexact=attrs["email"]).first()
        if not user:
            raise serializers.ValidationError("Invalid or expired OTP.")

        otp = (
            EmailOTP.objects.filter(user=user, purpose=purpose, is_used=False)
            .order_by("-created_at")
            .first()
        )
        if not otp or not otp.check_code(attrs["otp"]):
            raise serializers.ValidationError("Invalid or expired OTP.")

        attrs["user"] = user
        attrs["otp_object"] = otp
        return attrs

    def mark_used(self):
        otp = self.validated_data["otp_object"]
        otp.is_used = True
        otp.save(update_fields=["is_used"])


class VerifyLoginOTPSerializer(VerifyOTPSerializer):
    def create_tokens(self, request=None):
        user = self.validated_data["user"]
        self.mark_used()
        refresh = RefreshToken.for_user(user)
        user_logged_in.send(sender=user.__class__, request=request, user=user)
        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": UserSerializer(user, context=self.context).data,
        }


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()


class ResetPasswordSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True, min_length=8, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        if attrs["new_password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})

        try:
            user_id = force_str(urlsafe_base64_decode(attrs["uid"]))
            user = User.objects.get(pk=user_id)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError({"token": "Invalid password reset link."})

        if not default_token_generator.check_token(user, attrs["token"]):
            raise serializers.ValidationError({"token": "Invalid or expired password reset link."})

        attrs["user"] = user
        return attrs

    def save(self, **kwargs):
        user = self.validated_data["user"]
        user.set_password(self.validated_data["new_password"])
        user.save(update_fields=["password"])
        return user


def validate_user_email(value):
    email = value.strip().lower()
    common_typos = {
        "gamil.com": "gmail.com",
        "gmial.com": "gmail.com",
        "gnail.com": "gmail.com",
    }
    domain = email.rsplit("@", 1)[-1]
    if domain in common_typos:
        raise serializers.ValidationError(f"Email domain looks wrong. Did you mean {common_typos[domain]}?")
    return email
