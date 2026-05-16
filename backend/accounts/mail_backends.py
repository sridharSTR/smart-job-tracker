import ssl

import certifi
from django.conf import settings
from django.core.mail.backends.smtp import EmailBackend
from django.utils.functional import cached_property


class CertifiSMTPEmailBackend(EmailBackend):
    @cached_property
    def ssl_context(self):
        if not getattr(settings, "EMAIL_SSL_VERIFY", True):
            return ssl._create_unverified_context()
        return ssl.create_default_context(cafile=certifi.where())
