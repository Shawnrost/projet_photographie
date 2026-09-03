from .models import Notification, NotificationType
from apps.users.models import Utilisateur


class NotificationService:

    @staticmethod
    def creer(destinataire: Utilisateur, declencheur: Utilisateur,
               type_notif: str, message: str,
               publication_id=None, commentaire_id=None) -> Notification:
        """
        Crée une notification et l'envoie en temps réel via WebSocket.
        Ne notifie pas si destinataire == declencheur.
        """
        if destinataire == declencheur:
            return None

        notif = Notification.objects.create(
            destinataire=destinataire,
            declencheur=declencheur,
            type=type_notif,
            message=message,
            publication_id=publication_id,
            commentaire_id=commentaire_id,
        )

        # Envoi WebSocket temps réel
        NotificationService._envoyer_ws(notif)
        return notif

    @staticmethod
    def _envoyer_ws(notif: Notification) -> None:
        """Envoie la notification via Django Channels."""
        from channels.layers import get_channel_layer
        from asgiref.sync import async_to_sync
        from apps.notifications.serializers import NotificationSerializer

        channel_layer = get_channel_layer()
        if channel_layer is None:
            return

        data = NotificationSerializer(notif).data
        # Convertit les UUIDs en string pour la sérialisation JSON
        data["id"]             = str(data["id"])
        data["publication_id"] = str(data["publication_id"]) if data.get("publication_id") else None
        data["commentaire_id"] = str(data["commentaire_id"]) if data.get("commentaire_id") else None

        try:
            async_to_sync(channel_layer.group_send)(
                f"notifs_{notif.destinataire.id}",
                {
                    "type":         "envoyer_notification",
                    "notification": data,
                }
            )
        except Exception as e:
            print(f"[NOTIF WS] Erreur envoi : {e}")

    # ── Déclencheurs ──────────────────────────────────────────────────────────

    @staticmethod
    def notifier_like_publication(declencheur: Utilisateur, publication) -> None:
        destinataire = publication.photographe.utilisateur
        NotificationService.creer(
            destinataire=destinataire,
            declencheur=declencheur,
            type_notif=NotificationType.LIKE_PUBLICATION,
            message=f"{declencheur.prenom} {declencheur.nom} a aimé votre publication « {publication.titre} ».",
            publication_id=publication.id,
        )

    @staticmethod
    def notifier_like_commentaire(declencheur: Utilisateur, commentaire) -> None:
        destinataire = commentaire.auteur
        NotificationService.creer(
            destinataire=destinataire,
            declencheur=declencheur,
            type_notif=NotificationType.LIKE_COMMENTAIRE,
            message=f"{declencheur.prenom} {declencheur.nom} a aimé votre commentaire.",
            publication_id=commentaire.publication.id,
            commentaire_id=commentaire.id,
        )

    @staticmethod
    def notifier_nouveau_suivi(declencheur: Utilisateur, suivi: Utilisateur) -> None:
        NotificationService.creer(
            destinataire=suivi,
            declencheur=declencheur,
            type_notif=NotificationType.NOUVEAU_SUIVI,
            message=f"{declencheur.prenom} {declencheur.nom} a commencé à vous suivre.",
        )

    @staticmethod
    def notifier_reponse_commentaire(declencheur: Utilisateur, commentaire) -> None:
        destinataire = commentaire.parent.auteur
        NotificationService.creer(
            destinataire=destinataire,
            declencheur=declencheur,
            type_notif=NotificationType.REPONSE_COMMENTAIRE,
            message=f"{declencheur.prenom} {declencheur.nom} a répondu à votre commentaire.",
            publication_id=commentaire.publication.id,
            commentaire_id=commentaire.id,
        )

    # ── Actions utilisateur ───────────────────────────────────────────────────

    @staticmethod
    def lister(utilisateur: Utilisateur):
        """Retourne les notifications actives de l'utilisateur."""
        return Notification.objects.filter(
            destinataire=utilisateur,
            is_active=True
        )

    @staticmethod
    def marquer_toutes_lues(utilisateur: Utilisateur) -> int:
        return Notification.objects.filter(
            destinataire=utilisateur,
            is_active=True,
            is_read=False
        ).update(is_read=True)

    @staticmethod
    def marquer_lue(notif_id: str, utilisateur: Utilisateur) -> Notification:
        from django.shortcuts import get_object_or_404
        notif = get_object_or_404(
            Notification, id=notif_id, destinataire=utilisateur, is_active=True
        )
        notif.is_read = True
        notif.save(update_fields=["is_read"])
        return notif

    @staticmethod
    def supprimer(notif_id: str, utilisateur: Utilisateur) -> None:
        """Désactive la notification — elle n'apparaît plus dans la liste."""
        from django.shortcuts import get_object_or_404
        notif = get_object_or_404(
            Notification, id=notif_id, destinataire=utilisateur
        )
        notif.is_active = False
        notif.save(update_fields=["is_active"])

    @staticmethod
    def nombre_non_lues(utilisateur: Utilisateur) -> int:
        return Notification.objects.filter(
            destinataire=utilisateur,
            is_active=True,
            is_read=False
        ).count()