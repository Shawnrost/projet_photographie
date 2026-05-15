from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from .models import Utilisateur, ProfilPhotographe, UserRole


# ─────────────────────────────────────────────
# Auth
# ─────────────────────────────────────────────

class AuthService:
    @staticmethod
    def connecter_utilisateur(email: str, password: str) -> dict:
        utilisateur = authenticate(username=email, password=password)
        if utilisateur is None:
            raise ValueError("Email ou mot de passe incorrect.")
        if not utilisateur.is_active:
            raise ValueError("Ce compte est désactivé. Veuillez contacter le support.")
        tokens = AuthService._generer_tokens(utilisateur)
        return {
            "utilisateur": utilisateur,
            "access": tokens["access"],
            "refresh": tokens["refresh"],
        }

    @staticmethod
    def deconnecter_utilisateur(refresh_token: str) -> None:
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except TokenError:
            raise ValueError("Token invalide ou déjà révoqué.")

    @staticmethod
    def _generer_tokens(utilisateur: Utilisateur) -> dict:
        refresh = RefreshToken.for_user(utilisateur)
        return {"access": str(refresh.access_token), "refresh": str(refresh)}


# ─────────────────────────────────────────────
# Profil utilisateur
# ─────────────────────────────────────────────

class ProfilService:

    @staticmethod
    def modifier_profil(utilisateur: Utilisateur, data) -> Utilisateur:
        """
        data = request.data (QueryDict multipart).
        MultiPartParser peuple request.data avec les fichiers automatiquement.
        """
        from .serializers import ModifierProfilSerializer
        serializer = ModifierProfilSerializer(
            utilisateur,
            data=data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        return serializer.save()

    @staticmethod
    def modifier_profil_photographe(utilisateur: Utilisateur, data) -> ProfilPhotographe:
        """
        data = request.data (QueryDict multipart).
        Crée le profil s'il n'existe pas (sécurité).
        """
        from .serializers import ModifierProfilPhotographeSerializer
        profil, _ = ProfilPhotographe.objects.get_or_create(utilisateur=utilisateur)
        serializer = ModifierProfilPhotographeSerializer(
            profil,
            data=data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        return serializer.save()

    @staticmethod
    def changer_mot_de_passe(utilisateur: Utilisateur, data: dict, request) -> None:
        from .serializers import ChangerMotDePasseSerializer
        serializer = ChangerMotDePasseSerializer(data=data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        utilisateur.set_password(serializer.validated_data["nouveau_mot_de_passe"])
        utilisateur.save()

    @staticmethod
    def supprimer_photo_profil(utilisateur: Utilisateur) -> None:
        if utilisateur.photo_profil:
            utilisateur.photo_profil.delete(save=False)
            utilisateur.photo_profil = None
            utilisateur.save()

    @staticmethod
    def supprimer_photo_couverture(utilisateur: Utilisateur) -> None:
        try:
            profil = utilisateur.profil_photographe
        except ProfilPhotographe.DoesNotExist:
            raise ValueError("Profil photographe introuvable.")
        if profil.photo_couverture:
            profil.photo_couverture.delete(save=False)
            profil.photo_couverture = None
            profil.save()