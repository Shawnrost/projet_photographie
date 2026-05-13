from rest_framework.permissions import BasePermission
from .models import UserRole


class EstAdmin(BasePermission):
    """Autorise uniquement les utilisateurs avec le rôle 'admin'."""
    message = "Accès réservé aux administrateurs."

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == UserRole.ADMIN
        )


class EstPhotographe(BasePermission):
    """Autorise uniquement les utilisateurs avec le rôle 'photographe'."""
    message = "Accès réservé aux photographes."

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == UserRole.PHOTOGRAPHE
        )


class EstClient(BasePermission):
    """Autorise uniquement les utilisateurs avec le rôle 'client'."""
    message = "Accès réservé aux clients."

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == UserRole.CLIENT
        )


class EstProprietaire(BasePermission):
    """
    Autorise uniquement si l'utilisateur connecté est le propriétaire de l'objet.
    L'objet doit avoir un champ 'utilisateur' ou être l'utilisateur lui-même.
    """
    message = "Vous n'êtes pas autorisé à accéder à cette ressource."

    def has_object_permission(self, request, view, obj):
        if hasattr(obj, "utilisateur"):
            return obj.utilisateur == request.user
        return obj == request.user