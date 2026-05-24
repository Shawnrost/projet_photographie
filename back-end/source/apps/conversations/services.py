from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import Conversation, Message
from apps.users.models import Utilisateur, ProfilPhotographe


class ConversationService:

    @staticmethod
    def get_ou_creer_conversation(client: Utilisateur, photographe_id: str) -> tuple:
        """
        Retourne (conversation, cree).
        Crée la conversation si elle n'existe pas encore.
        """
        photographe = get_object_or_404(ProfilPhotographe, id=photographe_id)

        if photographe.utilisateur == client:
            raise ValueError("Vous ne pouvez pas initier une conversation avec vous-même.")

        conversation, cree = Conversation.objects.get_or_create(
            client=client,
            photographe=photographe
        )
        return conversation, cree

    @staticmethod
    def lister_conversations(utilisateur: Utilisateur):
        """
        Retourne toutes les conversations de l'utilisateur
        (qu'il soit client ou photographe).
        """
        from django.db.models import Q
        return Conversation.objects.filter(
            Q(client=utilisateur) |
            Q(photographe__utilisateur=utilisateur)
        ).prefetch_related("messages").select_related(
            "client", "photographe__utilisateur"
        ).order_by("-last_message_at")

    @staticmethod
    def get_conversation_ou_404(conversation_id: str, utilisateur: Utilisateur) -> Conversation:
        """
        Retourne la conversation si l'utilisateur en fait partie.
        Lève 404 sinon.
        """
        from django.db.models import Q
        return get_object_or_404(
            Conversation,
            Q(client=utilisateur) | Q(photographe__utilisateur=utilisateur),
            id=conversation_id
        )

    @staticmethod
    def marquer_messages_lus(conversation: Conversation, utilisateur: Utilisateur) -> int:
        """
        Marque comme lus tous les messages non lus
        que l'utilisateur n'a pas envoyés.
        Retourne le nombre de messages mis à jour.
        """
        updated = conversation.messages.filter(
            is_read=False
        ).exclude(
            expediteur=utilisateur
        ).update(is_read=True)
        return updated

    @staticmethod
    def nombre_non_lus_total(utilisateur: Utilisateur) -> int:
        """Retourne le nombre total de messages non lus pour l'utilisateur."""
        from django.db.models import Q
        return Message.objects.filter(
            is_read=False,
            conversation__in=Conversation.objects.filter(
                Q(client=utilisateur) |
                Q(photographe__utilisateur=utilisateur)
            )
        ).exclude(expediteur=utilisateur).count()


class MessageService:

    @staticmethod
    def envoyer_message(
        conversation: Conversation,
        expediteur: Utilisateur,
        contenu: str = None,
        fichier=None
    ) -> Message:
        """
        Crée un message dans la conversation.
        Met à jour last_message_at sur la conversation.
        """
        if not contenu and not fichier:
            raise ValueError("Un message doit contenir du texte ou un fichier.")

        nom_fichier_original = None
        type_fichier         = None

        if fichier:
            nom_fichier_original = fichier.name
            type_fichier         = getattr(fichier, "content_type", None)

        message = Message.objects.create(
            conversation=conversation,
            expediteur=expediteur,
            contenu=contenu,
            fichier=fichier,
            nom_fichier_original=nom_fichier_original,
            type_fichier=type_fichier,
        )

        # Mettre à jour last_message_at
        Conversation.objects.filter(id=conversation.id).update(
            last_message_at=timezone.now()
        )

        return message

    @staticmethod
    def get_historique(conversation: Conversation, page: int = 1, page_size: int = 30):
        """Retourne les messages d'une conversation par ordre chronologique."""
        return conversation.messages.select_related("expediteur").all()