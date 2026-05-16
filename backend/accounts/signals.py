from django.contrib.auth import get_user_model
from django.contrib.auth.signals import user_logged_in
from django.dispatch import Signal, receiver

from .email import send_app_mail

User = get_user_model()
registration_verified = Signal()


@receiver(registration_verified)
def send_registration_success_email(sender, user, **kwargs):
    if not user.email:
        return

    send_app_mail(
        "Welcome to Smart Job Tracker",
        "Welcome to Smart Job Tracker. Your registration was successful.",
        [user.email],
        fail_silently=True,
    )


@receiver(user_logged_in)
def send_login_success_email(sender, request, user, **kwargs):
    if not user.email:
        return

    send_app_mail(
        "Smart Job Tracker login successful",
        "Congratulations! You logged into Smart Job Tracker successfully.",
        [user.email],
        fail_silently=True,
    )
