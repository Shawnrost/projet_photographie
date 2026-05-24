from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError
import uuid
from apps.users.models import ProfilPhotographe, Utilisateur


class SubscriptionPlan(models.TextChoices):
    BASIC   = "basic",   "Basic"
    PREMIUM = "premium", "Premium"


class SubscriptionDuree(models.TextChoices):
    UN_MOIS    = "1_mois", "1 mois"
    TROIS_MOIS = "3_mois", "3 mois"
    SIX_MOIS   = "6_mois", "6 mois"


class SubscriptionStatus(models.TextChoices):
    ACTIVE = "active", "Active"
    EXPIRE = "expire", "Expiré"
    ANNULE = "annule", "Annulé"


class PlanTarif(models.Model):
    """
    Grille tarifaire gérée depuis l'interface admin Django.
    Chaque combinaison (plan + durée) a un prix unique.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    plan = models.CharField(
        max_length=20,
        choices=SubscriptionPlan.choices
    )
    duree = models.CharField(
        max_length=10,
        choices=SubscriptionDuree.choices
    )
    prix = models.DecimalField(max_digits=12, decimal_places=2)
    est_actif = models.BooleanField(
        default=True,
        help_text="Décocher pour masquer ce tarif sans le supprimer."
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("plan", "duree")
        ordering = ["plan", "duree"]
        verbose_name = "Plan tarifaire"
        verbose_name_plural = "Plans tarifaires"

    def __str__(self):
        return f"{self.get_plan_display()} — {self.get_duree_display()} : {self.prix} €"

    def clean(self):
        if self.prix <= 0:
            raise ValidationError({"prix": "Le prix doit être supérieur à 0."})


class Abonnement(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    photographe = models.ForeignKey(
        ProfilPhotographe,
        on_delete=models.CASCADE,
        related_name="abonnements"
    )
    # Snapshot du tarif au moment de la souscription
    plan_tarif = models.ForeignKey(
        PlanTarif,
        on_delete=models.SET_NULL,
        null=True,
        related_name="abonnements",
        help_text="Tarif appliqué au moment de la souscription."
    )
    type = models.CharField(max_length=20, choices=SubscriptionPlan.choices)
    duree = models.CharField(
        max_length=10,
        choices=SubscriptionDuree.choices,
        default=SubscriptionDuree.UN_MOIS
    )
    status = models.CharField(
        max_length=20,
        choices=SubscriptionStatus.choices,
        default=SubscriptionStatus.ACTIVE
    )
    # Prix conservé tel qu'il était au moment de la souscription
    prix = models.DecimalField(max_digits=12, decimal_places=2)
    date_deb = models.DateTimeField(auto_now_add=True)
    date_fin = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.photographe} — {self.type} ({self.duree})"

    @property
    def est_actif(self) -> bool:
        return (
            self.status == SubscriptionStatus.ACTIVE
            and self.date_fin > timezone.now()
        )

    def synchroniser_statut(self) -> bool:
        if self.status == SubscriptionStatus.ACTIVE and self.date_fin <= timezone.now():
            self.status = SubscriptionStatus.EXPIRE
            self.save(update_fields=["status"])
            return True
        return False
    
class Suivi(models.Model):
    """
    Système de suivi entre utilisateurs.
    N'importe qui peut suivre n'importe qui.
    Un utilisateur ne peut pas se suivre lui-même.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    suiveur = models.ForeignKey(
        Utilisateur,
        on_delete=models.CASCADE,
        related_name="suivis",           # les gens que je suis
    )
    suivi = models.ForeignKey(
        Utilisateur,
        on_delete=models.CASCADE,
        related_name="abonnes",          # les gens qui me suivent
    )
    created_at = models.DateTimeField(auto_now_add=True)
 
    class Meta:
        unique_together = ("suiveur", "suivi")
        ordering        = ["-created_at"]
 
    def __str__(self):
        return f"{self.suiveur} suit {self.suivi}"
 
