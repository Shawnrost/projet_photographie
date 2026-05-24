from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from .serializers import (
    ConversationSerializer,
    MessageSerializer,
    EnvoyerMessageSerializer,
    CreerConversationSerializer,
)
from .services import ConversationService, MessageService
from apps.core.pagination import PaginationStandard


class ConversationListView(APIView):
    """
    GET  /api/conversations/       → liste toutes les conversations
    POST /api/conversations/       → initier une conversation
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        conversations = ConversationService.lister_conversations(request.user)
        paginator     = PaginationStandard()
        page          = paginator.paginate_queryset(conversations, request)
        serializer    = ConversationSerializer(
            page, many=True, context={"request": request}
        )
        return paginator.get_paginated_response(serializer.data)

    def post(self, request):
        serializer = CreerConversationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"success": False, "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            conversation, cree = ConversationService.get_ou_creer_conversation(
                request.user,
                serializer.validated_data["photographe_id"]
            )
        except ValueError as e:
            return Response(
                {"success": False, "message": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Envoyer le message initial si fourni
        message_initial = serializer.validated_data.get("message_initial")
        if message_initial:
            MessageService.envoyer_message(
                conversation, request.user, contenu=message_initial
            )

        return Response(
            {
                "success": True,
                "message": "Conversation créée." if cree else "Conversation existante.",
                "data": ConversationSerializer(
                    conversation, context={"request": request}
                ).data,
            },
            status=status.HTTP_201_CREATED if cree else status.HTTP_200_OK,
        )


class ConversationDetailView(APIView):
    """
    GET /api/conversations/<uuid>/
    Retourne les détails + messages d'une conversation.
    Marque automatiquement les messages comme lus.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        conversation = ConversationService.get_conversation_ou_404(pk, request.user)

        # Marquer les messages comme lus à l'ouverture
        ConversationService.marquer_messages_lus(conversation, request.user)

        messages   = MessageService.get_historique(conversation)
        paginator  = PaginationStandard()
        page       = paginator.paginate_queryset(messages, request)
        serializer = MessageSerializer(
            page, many=True, context={"request": request}
        )
        return paginator.get_paginated_response(serializer.data)


class EnvoyerMessageView(APIView):
    """
    POST /api/conversations/<uuid>/messages/
    Envoie un message dans une conversation (texte et/ou fichier).
    """
    permission_classes = [IsAuthenticated]
    parser_classes     = [MultiPartParser, FormParser, JSONParser]

    def post(self, request, pk):
        conversation = ConversationService.get_conversation_ou_404(pk, request.user)

        serializer = EnvoyerMessageSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"success": False, "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            message = MessageService.envoyer_message(
                conversation=conversation,
                expediteur=request.user,
                contenu=serializer.validated_data.get("contenu"),
                fichier=serializer.validated_data.get("fichier"),
            )
        except ValueError as e:
            return Response(
                {"success": False, "message": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                "success": True,
                "data": MessageSerializer(message, context={"request": request}).data,
            },
            status=status.HTTP_201_CREATED,
        )


class NonLusTotalView(APIView):
    """
    GET /api/conversations/non-lus/
    Retourne le nombre total de messages non lus.
    Utile pour afficher un badge sur l'icône messagerie.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        total = ConversationService.nombre_non_lus_total(request.user)
        return Response({
            "success": True,
            "data": {"non_lus": total}
        })