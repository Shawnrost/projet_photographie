from django.db import models
import uuid
from apps.users.models import ProfilPhotographe

# Create your models here.

class SubscriptionPlan(models.TextChoices):
    BASIC = "basic", "Basic"
    PREMIUM = "premium", "Premium"

class SubscriptionStatus(models.TextChoices):
    ACTIVE = "active", "Active"
    EXPIRE = "expiré", "Expiré"
    CANCEL = "annulé", "Annulé"


class Abonnement(models.Model):

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    photographe = models.ForeignKey(
        ProfilPhotographe,
        on_delete=models.CASCADE,
        related_name="abonnements"
    )

    type = models.CharField(
        max_length=20,
        choices=SubscriptionPlan.choices
    )

    status = models.CharField(
        max_length=20,
        choices=SubscriptionStatus.choices,
        default=SubscriptionStatus.ACTIVE
    )

    prix = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    date_deb = models.DateTimeField(auto_now_add=True)

    date_fin = models.DateTimeField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.photographe} - {self.type}"