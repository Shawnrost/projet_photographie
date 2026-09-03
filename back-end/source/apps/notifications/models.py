from django.db import models
import uuid
from apps.users.models import Utilisateur


class NotificationType(models.TextChoices):
    LIKE_PUBLICATION  = "like_publication",  "Like sur une publication"
    LIKE_COMMENTAIRE  = "like_commentaire",  "Like sur un commentaire"
    NOUVEAU_SUIVI     = "nouveau_suivi",     "Nouveau abonné"
    REPONSE_COMMENTAIRE = "reponse_commentaire", "Réponse à un commentaire"


class Notification(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Destinataire de la notification
    destinataire = models.ForeignKey(
        Utilisateur,
        on_delete=models.CASCADE,
        related_name="notifications"
    )
    # Celui qui a déclenché la notification
    declencheur = models.ForeignKey(
        Utilisateur,
        on_delete=models.CASCADE,
        related_name="notifications_declenchees",
        null=True,
        blank=True
    )
    type = models.CharField(
        max_length=30,
        choices=NotificationType.choices
    )
    # Message lisible par l'utilisateur
    message = models.CharField(max_length=255)

    # Référence optionnelle vers l'objet concerné
    publication_id  = models.UUIDField(null=True, blank=True)
    commentaire_id  = models.UUIDField(null=True, blank=True)

    is_read   = models.BooleanField(default=False)
    is_active = models.BooleanField(
        default=True,
        help_text="False quand l'utilisateur supprime la notification."
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"[{self.type}] → {self.destinataire} : {self.message}"