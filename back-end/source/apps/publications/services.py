from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import Publication, Reaction, Categorie, Tag
from apps.users.models import Utilisateur


class PublicationService:

    @staticmethod
    def creer_publication(photographe_profil, data) -> Publication:
        """
        data = request.data (QueryDict multipart).
        Avec MultiPartParser, DRF fusionne automatiquement les fichiers dans
        request.data — pas besoin de passer request.FILES séparément.
        """
        from .serializers import PublicationCreateSerializer
        serializer = PublicationCreateSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        return serializer.save(photographe=photographe_profil)

    @staticmethod
    def modifier_publication(publication: Publication, data) -> Publication:
        from .serializers import PublicationCreateSerializer
        serializer = PublicationCreateSerializer(
            publication,
            data=data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        return serializer.save()

    @staticmethod
    def supprimer_publication(publication: Publication) -> None:
        """Suppression réelle + nettoyage de l'image."""
        if publication.image_url:
            publication.image_url.delete(save=False)
        publication.delete()

    @staticmethod
    def archiver_publication(publication: Publication) -> Publication:
        """Désactive une publication sans la supprimer."""
        publication.is_active = False
        publication.save()
        return publication

    @staticmethod
    def lister_publications(filters: dict = None, utilisateur=None):
        qs = Publication.objects.filter(is_active=True).select_related(
            "photographe__utilisateur"
        ).prefetch_related("categories", "tags", "reactions")

        if not filters:
            return qs

        if filters.get("type"):
            qs = qs.filter(type=filters["type"])

        if filters.get("categorie"):
            qs = qs.filter(categories__id=filters["categorie"])

        if filters.get("tag"):
            qs = qs.filter(tags__nom__icontains=filters["tag"])

        if filters.get("photographe"):
            qs = qs.filter(photographe__id=filters["photographe"])

        if filters.get("recherche"):
            terme = filters["recherche"]
            qs = qs.filter(
                Q(titre__icontains=terme) |
                Q(description__icontains=terme) |
                Q(tags__nom__icontains=terme)
            ).distinct()

        return qs

    @staticmethod
    def get_publication_ou_404(publication_id) -> Publication:
        return get_object_or_404(Publication, id=publication_id, is_active=True)

    @staticmethod
    def verifier_proprietaire(publication: Publication, utilisateur: Utilisateur) -> bool:
        return publication.photographe.utilisateur == utilisateur


class ReactionService:

    @staticmethod
    def toggler_like(utilisateur: Utilisateur, publication: Publication) -> dict:
        reaction, cree = Reaction.objects.get_or_create(
            utilisateur=utilisateur,
            publication=publication
        )
        if not cree:
            reaction.delete()
            liked = False
        else:
            liked = True

        return {
            "liked": liked,
            "nombre_likes": publication.reactions.count()
        }


class CategorieService:

    @staticmethod
    def lister_categories():
        return Categorie.objects.all()

    @staticmethod
    def creer_categorie(data: dict) -> Categorie:
        from .serializers import CategorieSerializer
        serializer = CategorieSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        return serializer.save()


class TagService:

    @staticmethod
    def rechercher_tags(terme: str):
        return Tag.objects.filter(nom__icontains=terme)[:10]