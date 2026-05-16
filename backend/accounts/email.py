import logging
from smtplib import SMTPException

from django.conf import settings
from django.core.mail import send_mail
from rest_framework.exceptions import APIException

logger = logging.getLogger(__name__)


class EmailDeliveryError(APIException):
    status_code = 503
    default_detail = "Could not send email right now. Please check the email settings and try again."
    default_code = "email_delivery_failed"


def send_app_mail(subject, message, recipients, *, fail_silently=False):
    try:
        return send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            recipients,
            fail_silently=False,
        )
    except Exception as exc:
        logger.exception("Email delivery failed for subject %r to %s", subject, recipients)
        if fail_silently:
            return 0
        raise EmailDeliveryError() from exc
