from rest_framework import serializers
from .models import Commande, Article, OrderStatus
from apps.publications.models import Publication


class ArticleSerializer(serializers.ModelSerializer):
    """Lecture d'un article dans une commande."""
    publication_titre = serializers.CharField(source="publication.titre", read_only=True)
    publication_image = serializers.SerializerMethodField()

    class Meta:
        model  = Article
        fields = [
            "id", "publication", "publication_titre",
            "publication_image", "quantite", "prix_unitaire",
        ]
        read_only_fields = ["id", "prix_unitaire"]

    def get_publication_image(self, obj):
        request = self.context.get("request")
        image   = obj.publication.image_publique
        if image and request:
            return request.build_absolute_uri(image.url)
        return None


class CommandeSerializer(serializers.ModelSerializer):
    """Lecture complète d'une commande avec ses articles."""
    articles       = ArticleSerializer(many=True, read_only=True)
    status_label   = serializers.CharField(source="get_status_display", read_only=True)
    nombre_articles = serializers.SerializerMethodField()

    class Meta:
        model  = Commande
        fields = [
            "id", "status", "status_label", "prix_a_payer",
            "nombre_articles", "articles", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "status", "prix_a_payer", "created_at", "updated_at"]

    def get_nombre_articles(self, obj):
        return obj.articles.count()


class AjouterArticleSerializer(serializers.Serializer):
    """Ajout d'une publication au panier."""
    publication_id = serializers.UUIDField(required=True)

    def validate_publication_id(self, value):
        try:
            publication = Publication.objects.get(id=value, is_active=True)
        except Publication.DoesNotExist:
            raise serializers.ValidationError("Publication introuvable ou inactive.")

        if publication.type != "vente":
            raise serializers.ValidationError(
                "Seules les publications de type 'vente' peuvent être achetées."
            )
        if publication.est_vendue:
            raise serializers.ValidationError(
                "Cette photo a déjà été vendue."
            )
        if publication.prix is None:
            raise serializers.ValidationError(
                "Cette publication n'a pas de prix défini."
            )
        return value


class RetirerArticleSerializer(serializers.Serializer):
    """Retrait d'une publication du panier."""
    publication_id = serializers.UUIDField(required=True)


class PayerCommandeSerializer(serializers.Serializer):
    """Confirmation de paiement simulé."""
    confirmation = serializers.BooleanField()

    def validate_confirmation(self, value):
        if not value:
            raise serializers.ValidationError(
                "Vous devez confirmer le paiement."
            )
        return value


class AnnulerCommandeSerializer(serializers.Serializer):
    """Confirmation d'annulation."""
    confirmation = serializers.BooleanField()

    def validate_confirmation(self, value):
        if not value:
            raise serializers.ValidationError(
                "Vous devez confirmer l'annulation."
            )
        return value