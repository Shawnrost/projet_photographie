from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .serializers import (
    CommandeSerializer,
    AjouterArticleSerializer,
    RetirerArticleSerializer,
    PayerCommandeSerializer,
    AnnulerCommandeSerializer,
)
from .services import PanierService, CommandeService
from apps.users.permissions import EstClient
from apps.core.pagination import PaginationStandard


class PanierView(APIView):
    """
    GET  /api/commandes/panier/   → voir le panier actif
    POST /api/commandes/panier/   → valider le panier (passer commande)
    """
    permission_classes = [IsAuthenticated, EstClient]

    def get(self, request):
        panier = PanierService.get_panier(request.user)
        if panier is None:
            return Response({
                "success": True,
                "data": None,
                "message": "Votre panier est vide."
            })
        return Response({
            "success": True,
            "data": CommandeSerializer(panier, context={"request": request}).data
        })

    def post(self, request):
        try:
            commande = CommandeService.passer_commande(request.user)
        except ValueError as e:
            return Response(
                {"success": False, "message": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            {
                "success": True,
                "message": "Commande passée avec succès. Procédez au paiement.",
                "data": CommandeSerializer(commande, context={"request": request}).data,
            },
            status=status.HTTP_201_CREATED,
        )


class AjouterArticleView(APIView):
    """
    POST /api/commandes/panier/ajouter/
    Ajoute une publication au panier.
    """
    permission_classes = [IsAuthenticated, EstClient]

    def post(self, request):
        serializer = AjouterArticleSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"success": False, "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            panier = PanierService.ajouter_article(
                request.user,
                serializer.validated_data["publication_id"]
            )
        except ValueError as e:
            return Response(
                {"success": False, "message": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response({
            "success": True,
            "message": "Photo ajoutée au panier.",
            "data": CommandeSerializer(panier, context={"request": request}).data,
        })


class RetirerArticleView(APIView):
    """
    POST /api/commandes/panier/retirer/
    Retire une publication du panier.
    """
    permission_classes = [IsAuthenticated, EstClient]

    def post(self, request):
        serializer = RetirerArticleSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"success": False, "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            panier = PanierService.retirer_article(
                request.user,
                serializer.validated_data["publication_id"]
            )
        except Exception:
            return Response(
                {"success": False, "message": "Article introuvable dans le panier."},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response({
            "success": True,
            "message": "Photo retirée du panier.",
            "data": CommandeSerializer(panier, context={"request": request}).data,
        })


class ViderPanierView(APIView):
    """
    DELETE /api/commandes/panier/vider/
    Vide tout le panier.
    """
    permission_classes = [IsAuthenticated, EstClient]

    def delete(self, request):
        try:
            panier = PanierService.vider_panier(request.user)
        except Exception:
            return Response(
                {"success": False, "message": "Aucun panier actif trouvé."},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response({
            "success": True,
            "message": "Panier vidé.",
            "data": CommandeSerializer(panier, context={"request": request}).data,
        })


class PayerCommandeView(APIView):
    """
    POST /api/commandes/<uuid>/payer/
    Simule le paiement — passe le statut à 'paye' et retire les filigranes.
    """
    permission_classes = [IsAuthenticated, EstClient]

    def post(self, request, pk):
        serializer = PayerCommandeSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"success": False, "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            commande = CommandeService.payer(request.user, pk)
        except ValueError as e:
            return Response(
                {"success": False, "message": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response({
            "success": True,
            "message": "Paiement effectué. Les photos sont maintenant disponibles sans filigrane.",
            "data": CommandeSerializer(commande, context={"request": request}).data,
        })


class AnnulerCommandeView(APIView):
    """
    POST /api/commandes/<uuid>/annuler/
    Annule une commande en attente.
    """
    permission_classes = [IsAuthenticated, EstClient]

    def post(self, request, pk):
        serializer = AnnulerCommandeSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"success": False, "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            commande = CommandeService.annuler(request.user, pk)
        except ValueError as e:
            return Response(
                {"success": False, "message": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response({
            "success": True,
            "message": "Commande annulée.",
            "data": CommandeSerializer(commande, context={"request": request}).data,
        })


class HistoriqueCommandesView(APIView):
    """
    GET /api/commandes/historique/
    Historique des commandes payées et annulées du client.
    """
    permission_classes = [IsAuthenticated, EstClient]

    def get(self, request):
        commandes = CommandeService.historique(request.user)
        paginator = PaginationStandard()
        page = paginator.paginate_queryset(commandes, request)
        serializer = CommandeSerializer(
            page, many=True, context={"request": request}
        )
        return paginator.get_paginated_response(serializer.data)
    