from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from .serializers import (
    InscriptionSerializer,
    ConnexionSerializer,
    UtilisateurSerializer,
    ModifierProfilSerializer,
    ModifierProfilPhotographeSerializer,
    ChangerMotDePasseSerializer,
)
from .services import AuthService, ProfilService
from .permissions import EstPhotographe


# ─────────────────────────────────────────────
# Auth (inchangé)
# ─────────────────────────────────────────────

class InscriptionView(APIView):
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
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ConnexionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"success": False, "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            result = AuthService.connecter_utilisateur(
                serializer.validated_data["email"],
                serializer.validated_data["password"],
            )
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
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(
            {"success": True, "data": UtilisateurSerializer(request.user).data},
            status=status.HTTP_200_OK,
        )


# ─────────────────────────────────────────────
# Profil utilisateur
# ─────────────────────────────────────────────

class ModifierProfilView(APIView):
    """
    PATCH /api/auth/profil/
    Modifie nom, prenom et/ou photo_profil de l'utilisateur connecté.
    Accepte multipart/form-data (pour la photo) ou JSON (sans photo).
    """
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def patch(self, request):
        try:
            utilisateur = ProfilService.modifier_profil(
                request.user, request.data, request.FILES
            )
        except Exception as e:
            return Response(
                {"success": False, "errors": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            {
                "success": True,
                "message": "Profil mis à jour.",
                "data": UtilisateurSerializer(utilisateur).data,
            },
            status=status.HTTP_200_OK,
        )


class SupprimerPhotoProfilView(APIView):
    """
    DELETE /api/auth/profil/photo/
    Supprime la photo de profil de l'utilisateur connecté.
    """
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        ProfilService.supprimer_photo_profil(request.user)
        return Response(
            {"success": True, "message": "Photo de profil supprimée."},
            status=status.HTTP_200_OK,
        )


class ModifierProfilPhotographeView(APIView):
    """
    PATCH /api/auth/profil/photographe/
    Modifie bio, adresse et/ou photo_couverture.
    Réservé aux photographes.
    """
    permission_classes = [IsAuthenticated, EstPhotographe]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def patch(self, request):
        try:
            profil = ProfilService.modifier_profil_photographe(
                request.user, request.data, request.FILES
            )
        except Exception as e:
            return Response(
                {"success": False, "errors": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )
        from .serializers import ProfilPhotographeSerializer
        return Response(
            {
                "success": True,
                "message": "Profil photographe mis à jour.",
                "data": ProfilPhotographeSerializer(profil).data,
            },
            status=status.HTTP_200_OK,
        )


class SupprimerPhotoCouvertureView(APIView):
    """
    DELETE /api/auth/profil/photographe/photo-couverture/
    Supprime la photo de couverture du photographe.
    """
    permission_classes = [IsAuthenticated, EstPhotographe]

    def delete(self, request):
        try:
            ProfilService.supprimer_photo_couverture(request.user)
        except ValueError as e:
            return Response(
                {"success": False, "message": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            {"success": True, "message": "Photo de couverture supprimée."},
            status=status.HTTP_200_OK,
        )


class ChangerMotDePasseView(APIView):
    """
    POST /api/auth/profil/changer-mot-de-passe/
    Ancien mot de passe + nouveau + confirmation.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            ProfilService.changer_mot_de_passe(request.user, request.data, request)
        except Exception as e:
            return Response(
                {"success": False, "errors": e.detail if hasattr(e, "detail") else str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            {"success": True, "message": "Mot de passe modifié avec succès."},
            status=status.HTTP_200_OK,
        )