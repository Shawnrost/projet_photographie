from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .serializers import NotificationSerializer
from .services import NotificationService
from apps.core.pagination import PaginationStandard


class NotificationListView(APIView):
    """
    GET /api/notifications/
    Liste des notifications actives de l'utilisateur connecté.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notifs    = NotificationService.lister(request.user)
        paginator = PaginationStandard()
        page      = paginator.paginate_queryset(notifs, request)
        serializer = NotificationSerializer(
            page, many=True, context={"request": request}
        )
        return paginator.get_paginated_response(serializer.data)


class NotificationNonLuesView(APIView):
    """
    GET /api/notifications/non-lues/
    Retourne uniquement le nombre de notifications non lues.
    Utile pour le badge dans la navbar.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        total = NotificationService.nombre_non_lues(request.user)
        return Response({"success": True, "data": {"non_lues": total}})


class MarquerToutesLuesView(APIView):
    """
    POST /api/notifications/marquer-toutes-lues/
    Marque toutes les notifications comme lues.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        count = NotificationService.marquer_toutes_lues(request.user)
        return Response({
            "success": True,
            "message": f"{count} notification(s) marquée(s) comme lue(s).",
        })


class NotificationDetailView(APIView):
    """
    PATCH  /api/notifications/<uuid>/   → marquer comme lue
    DELETE /api/notifications/<uuid>/   → désactiver (ne plus afficher)
    """
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            notif = NotificationService.marquer_lue(pk, request.user)
        except Exception:
            return Response(
                {"success": False, "message": "Notification introuvable."},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response({
            "success": True,
            "message": "Notification marquée comme lue.",
            "data": NotificationSerializer(notif, context={"request": request}).data,
        })

    def delete(self, request, pk):
        try:
            NotificationService.supprimer(pk, request.user)
        except Exception:
            return Response(
                {"success": False, "message": "Notification introuvable."},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response({
            "success": True,
            "message": "Notification supprimée.",
        })