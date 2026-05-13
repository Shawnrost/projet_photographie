from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny

from .serializers import (
    InscriptionSerializer,
    ConnexionSerializer,
    UtilisateurSerializer,
)
from .services import AuthService


class InscriptionView(APIView):
    """
    POST /api/auth/inscription/
    Crée un nouveau compte utilisateur (client ou photographe).
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = InscriptionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"success": False, "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
        utilisateur = serializer.save()
        return Response(
            {
                "success": True,
                "message": "Compte créé avec succès.",
                "data": UtilisateurSerializer(utilisateur).data,
            },
            status=status.HTTP_201_CREATED,
        )


class ConnexionView(APIView):
    """
    POST /api/auth/connexion/
    Authentifie un utilisateur et retourne les tokens JWT.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ConnexionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"success": False, "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]

        try:
            result = AuthService.connecter_utilisateur(email, password)
        except ValueError as e:
            return Response(
                {"success": False, "message": str(e)},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        return Response(
            {
                "success": True,
                "message": "Connexion réussie.",
                "data": {
                    "access": result["access"],
                    "refresh": result["refresh"],
                    "utilisateur": UtilisateurSerializer(result["utilisateur"]).data,
                },
            },
            status=status.HTTP_200_OK,
        )


class DeconnexionView(APIView):
    """
    POST /api/auth/deconnexion/
    Invalide le refresh token (blacklist).
    Nécessite d'être authentifié (access token dans le header Authorization).
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response(
                {"success": False, "message": "Le refresh token est requis."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            AuthService.deconnecter_utilisateur(refresh_token)
        except ValueError as e:
            return Response(
                {"success": False, "message": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {"success": True, "message": "Déconnexion réussie."},
            status=status.HTTP_200_OK,
        )


class MoiView(APIView):
    """
    GET /api/auth/moi/
    Retourne les informations de l'utilisateur connecté.
    Nécessite d'être authentifié.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(
            {
                "success": True,
                "data": UtilisateurSerializer(request.user).data,
            },
            status=status.HTTP_200_OK,
        )