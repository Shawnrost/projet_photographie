from django.db import models
import uuid
from apps.users.models import Utilisateur
from apps.publications.models import Publication


class OrderStatus(models.TextChoices):
    EN_ATTENTE = "en_attente", "En attente"
    PAYE       = "paye",       "Payé"
    ANNULE     = "annule",     "Annulé"


class Commande(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    client = models.ForeignKey(
        Utilisateur,
        on_delete=models.RESTRICT,
        related_name="commandes"
    )
    prix_a_payer = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )
    status = models.CharField(
        max_length=20,
        choices=OrderStatus.choices,
        default=OrderStatus.EN_ATTENTE
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return str(self.id)

    def calculer_total(self) -> None:
        """Recalcule et sauvegarde prix_a_payer depuis les articles."""
        total = sum(
            article.prix_unitaire * article.quantite
            for article in self.articles.all()
        )
        self.prix_a_payer = total
        self.save(update_fields=["prix_a_payer"])


class Article(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    commande = models.ForeignKey(
        Commande,
        on_delete=models.CASCADE,
        related_name="articles"
    )
    publication = models.ForeignKey(
        Publication,
        on_delete=models.RESTRICT,
        related_name="articles"
    )
    quantite = models.PositiveIntegerField(default=1)
    prix_unitaire = models.DecimalField(max_digits=12, decimal_places=2)

    class Meta:
        unique_together = ("commande", "publication")

    def __str__(self):
        return f"{self.publication.titre} x{self.quantite}"