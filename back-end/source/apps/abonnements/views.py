from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from .serializers import (
    AbonnementSerializer,
    SouscrireAbonnementSerializer,
    AnnulerAbonnementSerializer,
    PlanTarifSerializer,
    PlanTarifCrudSerializer,
)
from .services import AbonnementService, SuiviService
from apps.users.permissions import EstPhotographe, EstAdmin
from apps.users.models import Utilisateur
from apps.users.serializers import UtilisateurSerializer
from apps.publications.serializers import PublicationListSerializer
from apps.core.pagination import PaginationStandard


class TarifsView(APIView):
    """
    GET /api/abonnements/tarifs/
    Retourne la grille tarifaire complète. Public.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        tarifs = AbonnementService.get_tarifs()
        return Response({
            "success": True,
            "data": PlanTarifSerializer(tarifs, many=True).data,
        })


class SouscrireView(APIView):
    """
    POST /api/abonnements/souscrire/
    Le photographe souscrit à un plan.
    Annule automatiquement l'abonnement actif existant.
    """
    permission_classes = [IsAuthenticated, EstPhotographe]

    def post(self, request):
        serializer = SouscrireAbonnementSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"success": False, "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            profil = request.user.profil_photographe
        except Exception:
            return Response(
                {"success": False, "message": "Profil photographe introuvable."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        abonnement = AbonnementService.souscrire(
            profil,
            serializer.validated_data["type"],
            serializer.validated_data["duree"],
        )

        return Response(
            {
                "success": True,
                "message": "Abonnement souscrit avec succès.",
                "data": AbonnementSerializer(abonnement).data,
            },
            status=status.HTTP_201_CREATED,
        )


class StatutAbonnementView(APIView):
    """
    GET /api/abonnements/statut/
    Vérifie et retourne l'abonnement actif du photographe connecté.
    Met à jour automatiquement le statut si expiré.
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

        result = AbonnementService.verifier_statut(profil)

        return Response({
            "success": True,
            "data": {
                "a_abonnement_actif": result["a_abonnement_actif"],
                "abonnement": AbonnementSerializer(result["abonnement"]).data
                              if result["abonnement"] else None,
            },
        })


class AnnulerAbonnementView(APIView):
    """
    POST /api/abonnements/<uuid>/annuler/
    Annule un abonnement actif.
    """
    permission_classes = [IsAuthenticated, EstPhotographe]

    def post(self, request, pk):
        serializer = AnnulerAbonnementSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"success": False, "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            profil = request.user.profil_photographe
        except Exception:
            return Response(
                {"success": False, "message": "Profil photographe introuvable."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            abonnement = AbonnementService.annuler(profil, pk)
        except ValueError as e:
            return Response(
                {"success": False, "message": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response({
            "success": True,
            "message": "Abonnement annulé.",
            "data": AbonnementSerializer(abonnement).data,
        })


class HistoriqueAbonnementView(APIView):
    """
    GET /api/abonnements/historique/
    Historique complet des abonnements du photographe connecté.
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

        abonnements = AbonnementService.historique(profil)
        return Response({
            "success": True,
            "data": AbonnementSerializer(abonnements, many=True).data,
        })


class SuiviToggleView(APIView):
    """
    POST /api/abonnements/suivre/<uuid>/
    Follow / Unfollow toggle sur un utilisateur.
    """
    permission_classes = [IsAuthenticated]
 
    def post(self, request, pk):
        try:
            result = SuiviService.toggler_suivi(request.user, pk)
        except ValueError as e:
            return Response(
                {"success": False, "message": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response({"success": True, "data": result})
 
 
class AbonnesListView(APIView):
    """
    GET /api/abonnements/utilisateurs/<uuid>/abonnes/
    Liste des utilisateurs qui suivent cet utilisateur.
    """
    permission_classes = [AllowAny]
 
    def get(self, request, pk):
        utilisateur = get_object_or_404(Utilisateur, id=pk)
        abonnes     = SuiviService.get_abonnes(utilisateur)
        paginator   = PaginationStandard()
        page        = paginator.paginate_queryset(abonnes, request)
        serializer  = UtilisateurSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)
 
 
class SuivisListView(APIView):
    """
    GET /api/abonnements/utilisateurs/<uuid>/suivis/
    Liste des utilisateurs que cet utilisateur suit.
    """
    permission_classes = [AllowAny]
 
    def get(self, request, pk):
        utilisateur = get_object_or_404(Utilisateur, id=pk)
        suivis      = SuiviService.get_suivis(utilisateur)
        paginator   = PaginationStandard()
        page        = paginator.paginate_queryset(suivis, request)
        serializer  = UtilisateurSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)
 
 
class FilActualiteView(APIView):
    """
    GET /api/abonnements/fil-actualite/
    Publications des photographes suivis par l'utilisateur connecté.
    """
    permission_classes = [IsAuthenticated]
 
    def get(self, request):
        publications = SuiviService.fil_actualite(request.user)
        paginator    = PaginationStandard()
        page         = paginator.paginate_queryset(publications, request)
        serializer   = PublicationListSerializer(
            page, many=True, context={"request": request}
        )
        return paginator.get_paginated_response(serializer.data)
 
# ─────────────────────────────────────────────
# CRUD Plans tarifaires — Admin uniquement
# ─────────────────────────────────────────────
 
class PlanTarifListView(APIView):
    """
    GET  /api/abonnements/admin/tarifs/   → liste tous les tarifs (actifs et inactifs)
    POST /api/abonnements/admin/tarifs/   → créer un nouveau tarif
    """
    def get_permissions(self):
        return [IsAuthenticated(), EstAdmin()]
 
    def get(self, request):
        from .models import PlanTarif
        tarifs     = PlanTarif.objects.all().order_by("plan", "duree")
        serializer = PlanTarifCrudSerializer(tarifs, many=True)
        return Response({"success": True, "data": serializer.data})
 
    def post(self, request):
        serializer = PlanTarifCrudSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"success": False, "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
        tarif = serializer.save()
        return Response(
            {
                "success": True,
                "message": "Plan tarifaire créé.",
                "data": PlanTarifCrudSerializer(tarif).data,
            },
            status=status.HTTP_201_CREATED,
        )
 
 
class PlanTarifDetailView(APIView):
    """
    GET    /api/abonnements/admin/tarifs/<uuid>/   → détail d'un tarif
    PATCH  /api/abonnements/admin/tarifs/<uuid>/   → modifier un tarif
    DELETE /api/abonnements/admin/tarifs/<uuid>/   → supprimer un tarif
    """
    def get_permissions(self):
        return [IsAuthenticated(), EstAdmin()]
 
    def _get_tarif(self, pk):
        from django.shortcuts import get_object_or_404
        from .models import PlanTarif
        return get_object_or_404(PlanTarif, id=pk)
 
    def get(self, request, pk):
        tarif      = self._get_tarif(pk)
        serializer = PlanTarifCrudSerializer(tarif)
        return Response({"success": True, "data": serializer.data})
 
    def patch(self, request, pk):
        tarif      = self._get_tarif(pk)
        serializer = PlanTarifCrudSerializer(tarif, data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(
                {"success": False, "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
        tarif = serializer.save()
        return Response({
            "success": True,
            "message": "Plan tarifaire mis à jour.",
            "data": PlanTarifCrudSerializer(tarif).data,
        })
 
    def delete(self, request, pk):
        tarif = self._get_tarif(pk)
        # Vérifier qu'aucun abonnement actif n'utilise ce tarif
        from .models import Abonnement, SubscriptionStatus
        abonnements_actifs = Abonnement.objects.filter(
            plan_tarif=tarif,
            status=SubscriptionStatus.ACTIVE
        ).count()
        if abonnements_actifs > 0:
            return Response(
                {
                    "success": False,
                    "message": f"{abonnements_actifs} abonnement(s) actif(s) utilisent ce tarif. Désactivez-le plutôt que de le supprimer."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        tarif.delete()
        return Response(
            {"success": True, "message": "Plan tarifaire supprimé."},
            status=status.HTTP_200_OK,
        )
 
