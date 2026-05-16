from django.shortcuts import get_object_or_404
from .models import Commande, Article, OrderStatus
from apps.users.models import Utilisateur
from apps.publications.models import Publication
from apps.publications.services import PublicationService


class PanierService:
    """
    Gère le panier actif du client.
    Le panier est une Commande avec status='en_attente'.
    Un client n'a qu'un seul panier actif à la fois.
    """

    @staticmethod
    def get_ou_creer_panier(client: Utilisateur) -> Commande:
        """Retourne le panier actif ou en crée un nouveau."""
        panier, _ = Commande.objects.get_or_create(
            client=client,
            status=OrderStatus.EN_ATTENTE
        )
        return panier

    @staticmethod
    def ajouter_article(client: Utilisateur, publication_id: str) -> Commande:
        """
        Ajoute une publication au panier du client.
        - Crée le panier s'il n'existe pas.
        - Vérifie que la publication n'est pas déjà dans le panier.
        - Snapshote le prix au moment de l'ajout.
        """
        publication = get_object_or_404(
            Publication, id=publication_id, is_active=True
        )

        # Vérifications métier
        if publication.type != "vente":
            raise ValueError(
                "Seules les publications de type 'vente' peuvent être achetées."
            )
        if publication.est_vendue:
            raise ValueError("Cette photo a déjà été vendue.")

        # Vérifier que le client n'achète pas sa propre photo
        if publication.photographe.utilisateur == client:
            raise ValueError("Vous ne pouvez pas acheter votre propre photo.")

        panier = PanierService.get_ou_creer_panier(client)

        # Vérifier si déjà dans le panier
        if Article.objects.filter(commande=panier, publication=publication).exists():
            raise ValueError("Cette photo est déjà dans votre panier.")

        # Créer l'article avec snapshot du prix actuel
        Article.objects.create(
            commande=panier,
            publication=publication,
            quantite=1,
            prix_unitaire=publication.prix,
        )

        panier.calculer_total()
        return panier

    @staticmethod
    def retirer_article(client: Utilisateur, publication_id: str) -> Commande:
        """Retire une publication du panier."""
        panier = get_object_or_404(
            Commande, client=client, status=OrderStatus.EN_ATTENTE
        )
        article = get_object_or_404(
            Article, commande=panier, publication_id=publication_id
        )
        article.delete()
        panier.calculer_total()
        return panier

    @staticmethod
    def vider_panier(client: Utilisateur) -> Commande:
        """Supprime tous les articles du panier."""
        panier = get_object_or_404(
            Commande, client=client, status=OrderStatus.EN_ATTENTE
        )
        panier.articles.all().delete()
        panier.calculer_total()
        return panier

    @staticmethod
    def get_panier(client: Utilisateur) -> Commande | None:
        """Retourne le panier actif ou None s'il n'existe pas."""
        try:
            return Commande.objects.prefetch_related(
                "articles__publication"
            ).get(client=client, status=OrderStatus.EN_ATTENTE)
        except Commande.DoesNotExist:
            return None


class CommandeService:

    @staticmethod
    def passer_commande(client: Utilisateur) -> Commande:
        """
        Valide le panier et passe la commande.
        Vérifie que le panier n'est pas vide et que toutes
        les photos sont encore disponibles.
        """
        panier = get_object_or_404(
            Commande, client=client, status=OrderStatus.EN_ATTENTE
        )

        if not panier.articles.exists():
            raise ValueError("Votre panier est vide.")

        # Vérifier que toutes les photos sont encore disponibles
        for article in panier.articles.select_related("publication"):
            if article.publication.est_vendue:
                raise ValueError(
                    f"La photo '{article.publication.titre}' a déjà été vendue."
                    " Veuillez la retirer de votre panier."
                )
            if not article.publication.is_active:
                raise ValueError(
                    f"La photo '{article.publication.titre}' n'est plus disponible."
                )

        # Recalculer le total au moment de la validation (prix peuvent avoir changé)
        panier.calculer_total()
        return panier

    @staticmethod
    def payer(client: Utilisateur, commande_id: str) -> Commande:
        """
        Simule le paiement d'une commande.
        - Passe le statut à 'paye'.
        - Marque chaque publication comme vendue.
        - Retire le filigrane (est_vendue=True).
        """
        commande = get_object_or_404(
            Commande, id=commande_id, client=client
        )

        if commande.status != OrderStatus.EN_ATTENTE:
            raise ValueError(
                "Seule une commande en attente peut être payée."
            )

        # Marquer toutes les publications comme vendues
        for article in commande.articles.select_related("publication"):
            PublicationService.marquer_vendue(article.publication)

        commande.status = OrderStatus.PAYE
        commande.save(update_fields=["status", "updated_at"])
        return commande

    @staticmethod
    def annuler(client: Utilisateur, commande_id: str) -> Commande:
        """Annule une commande en attente."""
        commande = get_object_or_404(
            Commande, id=commande_id, client=client
        )

        if commande.status != OrderStatus.EN_ATTENTE:
            raise ValueError(
                "Seule une commande en attente peut être annulée."
            )

        commande.status = OrderStatus.ANNULE
        commande.save(update_fields=["status", "updated_at"])
        return commande

    @staticmethod
    def historique(client: Utilisateur):
        """Retourne l'historique des commandes payées et annulées."""
        return Commande.objects.filter(
            client=client
        ).exclude(
            status=OrderStatus.EN_ATTENTE
        ).prefetch_related("articles__publication")