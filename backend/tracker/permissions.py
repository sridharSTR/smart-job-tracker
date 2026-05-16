from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsOwnerOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        owner = getattr(obj, "user", None) or getattr(obj, "recruiter", None)
        return owner == request.user or request.user.is_staff or getattr(request.user, "role", None) in {"ADMIN", "RECRUITER"}


class IsRecruiterWriteOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        user = request.user
        return bool(user and user.is_authenticated and (user.is_staff or getattr(user, "role", None) in {"ADMIN", "RECRUITER"}))
