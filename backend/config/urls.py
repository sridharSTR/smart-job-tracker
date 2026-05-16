from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path
from rest_framework_simplejwt.views import TokenRefreshView

from accounts.views import LoginView


def home(request):
    return JsonResponse(
        {
            "name": "Smart Job Tracker API",
            "status": "running",
            "frontend": "http://127.0.0.1:5173/",
            "admin": "http://127.0.0.1:8000/admin/",
            "api": {
                "login": "/api/auth/login/",
                "register": "/api/auth/register/",
                "applications": "/api/applications/",
                "analytics": "/api/analytics/",
            },
        }
    )


urlpatterns = [
    path("", home, name="home"),
    path("admin/", admin.site.urls),
    path("api/auth/login/", LoginView.as_view(), name="token_obtain_pair"),
    path("api/auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/auth/", include("accounts.urls")),
    path("api/", include("tracker.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
