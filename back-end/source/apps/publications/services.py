from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import Publication, Reaction, Categorie, Tag, PublicationType
from .watermark import appliquer_filigrane
from apps.users.models import Utilisateur
from apps.abonnements.models import SubscriptionStatus, SubscriptionPlan


class AbonnementValidator:
    """
    Vérifie les droits de publication selon l'abonnement actif du photographe.
    """

    @staticmethod
    def get_abonnement_actif(photographe):
        """Retourne l'abonnement actif ou None."""
        from apps.abonnements.models import Abonnement
        try:
            abonnement = Abonnement.objects.filter(
                photographe=photographe,
                status=SubscriptionStatus.ACTIVE
            ).latest("date_fin")
            # Synchroniser le statut si expiré
            abonnement.synchroniser_statut()
            abonnement.refresh_from_db()
            return abonnement if abonnement.est_actif else None
        except Exception:
            return None

    @staticmethod
    def verifier_droits_publication(photographe, type_publication: str) -> None:
        """
        Vérifie que le photographe a les droits pour ce type de publication.
        Lève ValueError si non autorisé.
        """
        abonnement = AbonnementValidator.get_abonnement_actif(photographe)

        if abonnement is None:
            raise ValueError(
                "Vous devez avoir un abonnement actif pour publier."
            )

        if type_publication == PublicationType.VENTE:
            if abonnement.type != SubscriptionPlan.PREMIUM:
                raise ValueError(
                    "La publication de type 'vente' est réservée aux abonnés Premium."
                )


class PublicationService:

    @staticmethod
    def creer_publication(photographe_profil, data) -> Publication:
        """
        Crée une publication avec filigrane automatique.
        Vérifie les droits selon l'abonnement actif.
        """
        from .serializers import PublicationCreateSerializer

        # Vérifier les droits avant de valider le reste
        type_publication = data.get("type", PublicationType.PUBLICITE)
        if isinstance(type_publication, list):
            type_publication = type_publication[0]

        AbonnementValidator.verifier_droits_publication(
            photographe_profil, type_publication
        )

        serializer = PublicationCreateSerializer(data=data)
        serializer.is_valid(raise_exception=True)

        # Extraire l'image avant la sauvegarde pour générer le filigrane
        image_originale = serializer.validated_data.get("image_originale")

        # print("VALIDATED DATA:", serializer.validated_data)
        publication = serializer.save(photographe=photographe_profil)

        # Générer et sauvegarder le filigrane
        if image_originale:
            try:
                image_originale.seek(0)
                filigrane = appliquer_filigrane(image_originale)
                publication.image_filigrane.save(
                    filigrane.name,
                    filigrane,
                    save=True
                )
            except Exception as e:
                # Si le filigrane échoue, la publication reste créée sans filigrane
                print(f"[WATERMARK] Erreur génération filigrane : {e}")

        return publication

    @staticmethod
    def modifier_publication(publication: Publication, data) -> Publication:
        from .serializers import PublicationCreateSerializer

        # Si le type change, vérifier les nouveaux droits
        nouveau_type = data.get("type")
        if nouveau_type:
            if isinstance(nouveau_type, list):
                nouveau_type = nouveau_type[0]
            AbonnementValidator.verifier_droits_publication(
                publication.photographe, nouveau_type
            )

        serializer = PublicationCreateSerializer(
            publication, data=data, partial=True
        )
        serializer.is_valid(raise_exception=True)

        # Si une nouvelle image est envoyée, régénérer le filigrane
        nouvelle_image = serializer.validated_data.get("image_originale")
        publication = serializer.save()

        if nouvelle_image:
            try:
                # Supprimer l'ancien filigrane
                if publication.image_filigrane:
                    publication.image_filigrane.delete(save=False)

                nouvelle_image.seek(0)
                filigrane = appliquer_filigrane(nouvelle_image)
                publication.image_filigrane.save(
                    filigrane.name, filigrane, save=True
                )
            except Exception as e:
                print(f"[WATERMARK] Erreur régénération filigrane : {e}")

        return publication

    @staticmethod
    def supprimer_publication(publication: Publication) -> None:
        if publication.image_originale:
            publication.image_originale.delete(save=False)
        if publication.image_filigrane:
            publication.image_filigrane.delete(save=False)
        publication.delete()

    @staticmethod
    def marquer_vendue(publication: Publication) -> Publication:
        """
        Appelé après un achat confirmé.
        Passe est_vendue=True — le frontend affiche désormais l'image originale.
        """
        publication.est_vendue = True
        publication.save(update_fields=["est_vendue", "updated_at"])
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