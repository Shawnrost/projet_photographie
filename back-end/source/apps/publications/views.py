from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from .models import Publication
from .serializers import (
    PublicationListSerializer,
    PublicationDetailSerializer,
    PublicationCreateSerializer,
    CategorieSerializer,
    TagSerializer,
)
from .services import PublicationService, ReactionService, CategorieService, TagService
from apps.users.permissions import EstPhotographe, EstAdmin
from apps.core.pagination import PaginationStandard


class PublicationListView(APIView):
    """
    GET  /api/publications/          → liste paginée des publications actives
    POST /api/publications/          → créer une publication (photographes uniquement)
    """
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated(), EstPhotographe()]
        return [AllowAny()]

    def get(self, request):
        filters = {
            "type":        request.query_params.get("type"),
            "categorie":   request.query_params.get("categorie"),
            "tag":         request.query_params.get("tag"),
            "photographe": request.query_params.get("photographe"),
            "recherche":   request.query_params.get("q"),
        }
        qs = PublicationService.lister_publications(filters, request.user)

        paginator = PaginationStandard()
        page = paginator.paginate_queryset(qs, request)
        serializer = PublicationListSerializer(
            page, many=True, context={"request": request}
        )
        return paginator.get_paginated_response(serializer.data)

    def post(self, request):
        try:
            profil = request.user.profil_photographe
        except Exception:
            return Response(
                {"success": False, "message": "Profil photographe introuvable."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            publication = PublicationService.creer_publication(
                profil, request.data
            )
        except Exception as e:
            detail = e.detail if hasattr(e, "detail") else str(e)
            return Response(
                {"success": False, "errors": detail},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                "success": True,
                "message": "Publication créée.",
                "data": PublicationDetailSerializer(
                    publication, context={"request": request}
                ).data,
            },
            status=status.HTTP_201_CREATED,
        )


class PublicationDetailView(APIView):
    """
    GET    /api/publications/<id>/   → détail d'une publication
    PATCH  /api/publications/<id>/   → modifier (propriétaire uniquement)
    DELETE /api/publications/<id>/   → supprimer (propriétaire uniquement)
    """
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsAuthenticated(), EstPhotographe()]

    def get(self, request, pk):
        publication = PublicationService.get_publication_ou_404(pk)
        serializer = PublicationDetailSerializer(
            publication, context={"request": request}
        )
        return Response({"success": True, "data": serializer.data})

    def patch(self, request, pk):
        publication = PublicationService.get_publication_ou_404(pk)

        if not PublicationService.verifier_proprietaire(publication, request.user):
            return Response(
                {"success": False, "message": "Vous n'êtes pas le propriétaire de cette publication."},
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            publication = PublicationService.modifier_publication(
                publication, request.data
            )
        except Exception as e:
            detail = e.detail if hasattr(e, "detail") else str(e)
            return Response(
                {"success": False, "errors": detail},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                "success": True,
                "message": "Publication mise à jour.",
                "data": PublicationDetailSerializer(
                    publication, context={"request": request}
                ).data,
            }
        )

    def delete(self, request, pk):
        publication = PublicationService.get_publication_ou_404(pk)

        if not PublicationService.verifier_proprietaire(publication, request.user):
            return Response(
                {"success": False, "message": "Vous n'êtes pas le propriétaire de cette publication."},
                status=status.HTTP_403_FORBIDDEN,
            )

        PublicationService.supprimer_publication(publication)
        return Response(
            {"success": True, "message": "Publication supprimée."},
            status=status.HTTP_200_OK,
        )


class LikeView(APIView):
    """
    POST /api/publications/<id>/like/
    Toggle like/unlike. Retourne le nouvel état.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        publication = PublicationService.get_publication_ou_404(pk)
        result = ReactionService.toggler_like(request.user, publication)
        return Response({"success": True, "data": result}, status=status.HTTP_200_OK)


class MesPublicationsView(APIView):
    """
    GET /api/publications/mes-publications/
    Liste des publications du photographe connecté (actives et inactives).
    """
    permission_classes = [IsAuthenticated, EstPhotographe]

    def get(self, request):
        try:
            profil = request.user.profil_photographe
        except Exception:
            return Response(
                {"success": False, "message": "Profil photographe introuvable."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        qs = Publication.objects.filter(photographe=profil).prefetch_related(
            "categories", "tags", "reactions"
        ).order_by("-created_at")

        paginator = PaginationStandard()
        page = paginator.paginate_queryset(qs, request)
        serializer = PublicationListSerializer(
            page, many=True, context={"request": request}
        )
        return paginator.get_paginated_response(serializer.data)


# ─────────────────────────────────────────────
# Catégories
# ─────────────────────────────────────────────

class CategorieListView(APIView):
    """
    GET  /api/publications/categories/   → liste de toutes les catégories
    POST /api/publications/categories/   → créer une catégorie (admin uniquement)
    """
    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated(), EstAdmin()]
        return [AllowAny()]

    def get(self, request):
        categories = CategorieService.lister_categories()
        return Response(
            {"success": True, "data": CategorieSerializer(categories, many=True).data}
        )

    def post(self, request):
        try:
            categorie = CategorieService.creer_categorie(request.data)
        except Exception as e:
            detail = e.detail if hasattr(e, "detail") else str(e)
            return Response(
                {"success": False, "errors": detail},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            {
                "success": True,
                "message": "Catégorie créée.",
                "data": CategorieSerializer(categorie).data,
            },
            status=status.HTTP_201_CREATED,
        )


# ─────────────────────────────────────────────
# Tags
# ─────────────────────────────────────────────

class TagRechercheView(APIView):
    """
    GET /api/publications/tags/?q=<terme>
    Autocomplétion des tags (max 10 résultats).
    """
    permission_classes = [AllowAny]

    def get(self, request):
        terme = request.query_params.get("q", "")
        tags = TagService.rechercher_tags(terme)
        return Response(
            {"success": True, "data": TagSerializer(tags, many=True).data}
        )