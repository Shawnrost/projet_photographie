from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

# Create your models here.

class UserRole(models.TextChoices):
    ADMIN = "admin", "Admin"
    PHOTOGRAPHE = "photographe", "Photographe"
    CLIENT = "client", "Client"


class Utilisateur(AbstractUser):

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    username = None

    email = models.EmailField(unique=True)

    nom = models.CharField(max_length=100)

    prenom = models.CharField(max_length=100)

    role = models.CharField(
        max_length=20,
        choices=UserRole.choices,
        default=UserRole.CLIENT
    )

    photo_profil = models.TextField(
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = "email"

    REQUIRED_FIELDS = []

    def __str__(self):
        return f"{self.prenom} {self.nom}"
    
class ProfilPhotographe(models.Model):

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    utilisateur = models.OneToOneField(
        Utilisateur,
        on_delete=models.CASCADE,
        related_name="profil_photographe"
    )

    bio = models.TextField(
        blank=True,
        null=True
    )

    adresse = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    photo_couverture = models.TextField(
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.utilisateur.email