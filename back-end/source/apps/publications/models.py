from django.db import models
import uuid
from apps.users.models import ProfilPhotographe, Utilisateur


class PublicationType(models.TextChoices):
    PUBLICITE = "publicite", "Publicité"
    VENTE = "vente", "Vente"


class Categorie(models.Model):
    """
    Catégories fixes créées et gérées par l'admin.
    Ex : Portrait, Mariage, Nature, Architecture...
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nom = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["nom"]
        verbose_name = "Catégorie"
        verbose_name_plural = "Catégories"

    def __str__(self):
        return self.nom


class Tag(models.Model):
    """
    Tags libres créés à la volée par les photographes.
    Ex : #golden-hour, #noir-et-blanc, #bretagne...
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nom = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["nom"]

    def __str__(self):
        return self.nom


class Publication(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    photographe = models.ForeignKey(
        ProfilPhotographe,
        on_delete=models.CASCADE,
        related_name="publications"
    )
    titre = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    image_url = models.ImageField(upload_to="publications/")   # ← ImageField (media/)
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
    categories = models.ManyToManyField(
        Categorie,
        blank=True,
        related_name="publications"
    )
    tags = models.ManyToManyField(
        Tag,
        blank=True,
        related_name="publications"
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.titre

    @property
    def nombre_likes(self):
        return self.reactions.count()


class Reaction(models.Model):
    """Like d'un utilisateur sur une publication. Un seul like par utilisateur."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    utilisateur = models.ForeignKey(
        Utilisateur,
        on_delete=models.CASCADE,
        related_name="reactions"
    )
    publication = models.ForeignKey(
        Publication,
        on_delete=models.CASCADE,
        related_name="reactions"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("utilisateur", "publication")

    def __str__(self):
        return f"{self.utilisateur} ❤ {self.publication}"