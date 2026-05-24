from django.db import models
import uuid
from apps.users.models import ProfilPhotographe, Utilisateur


class Conversation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    client = models.ForeignKey(
        Utilisateur,
        on_delete=models.CASCADE,
        related_name="conversations_client"
    )
    photographe = models.ForeignKey(
        ProfilPhotographe,
        on_delete=models.CASCADE,
        related_name="conversations"
    )
    created_at      = models.DateTimeField(auto_now_add=True)
    last_message_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("client", "photographe")
        ordering        = ["-last_message_at"]

    def __str__(self):
        return f"{self.client} ↔ {self.photographe}"

    @property
    def non_lus_count(self):
        """Nombre de messages non lus dans cette conversation."""
        return self.messages.filter(is_read=False).count()


class Message(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name="messages"
    )
    expediteur = models.ForeignKey(
        Utilisateur,
        on_delete=models.CASCADE,
        related_name="messages_envoyes"
    )
    contenu = models.TextField(blank=True, null=True)

    # Pièce jointe — image ou fichier (un seul par message)
    fichier = models.FileField(
        upload_to="conversations/fichiers/",
        blank=True,
        null=True
    )
    nom_fichier_original = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text="Nom du fichier tel qu'envoyé par l'utilisateur."
    )
    type_fichier = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        help_text="MIME type du fichier (ex: image/jpeg, application/pdf)."
    )

    is_read  = models.BooleanField(default=False)
    sent_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["sent_at"]

    def __str__(self):
        return f"{self.expediteur} → {self.conversation} ({self.sent_at})"

    def clean(self):
        from django.core.exceptions import ValidationError
        if not self.contenu and not self.fichier:
            raise ValidationError(
                "Un message doit contenir du texte ou un fichier."
            )