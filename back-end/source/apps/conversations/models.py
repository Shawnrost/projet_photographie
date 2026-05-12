from django.db import models
import uuid
from apps.users.models import ProfilPhotographe, Utilisateur
 

# Create your models here.

class Conversation(models.Model):

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

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

    created_at = models.DateTimeField(auto_now_add=True)

    last_message_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("client", "photographe")

class Message(models.Model):

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name="messages"
    )

    expediteur = models.ForeignKey(
        Utilisateur,
        on_delete=models.CASCADE
    )

    contenu = models.TextField()

    is_read = models.BooleanField(default=False)

    sent_at = models.DateTimeField(auto_now_add=True)