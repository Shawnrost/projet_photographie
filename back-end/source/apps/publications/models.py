from django.db import models
import uuid
from apps.users.models import ProfilPhotographe, Utilisateur


# Create your models here.

class PublicationType(models.TextChoices):
    PUBLICITE = "publicité", "Publicité"
    VENTE = "vente", "Vente"

class Publication(models.Model):

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    photographe = models.ForeignKey(
        ProfilPhotographe,
        on_delete=models.CASCADE,
        related_name="publications"
    )

    titre = models.CharField(max_length=255)

    description = models.TextField(
        blank=True,
        null=True
    )

    image_url = models.TextField()

    type = models.CharField(
        max_length=20,
        choices=PublicationType.choices,
        default=PublicationType.PUBLICITE
    )

    prix = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        blank=True,
        null=True
    )

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.titre
    
class Reaction(models.Model):

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    utilisateur = models.ForeignKey(
        Utilisateur,
        on_delete=models.CASCADE
    )

    publication = models.ForeignKey(
        Publication,
        on_delete=models.CASCADE,
        related_name="reactions"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("utilisateur", "publication")