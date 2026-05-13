from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from .models import Utilisateur


class AuthService:
    """
    Service d'authentification.
    Centralise la logique métier liée à la connexion, déconnexion et tokens JWT.
    """

    @staticmethod
    def connecter_utilisateur(email: str, password: str) -> dict:
        """
        Authentifie un utilisateur et retourne les tokens JWT + ses données.
        Lève une ValueError si les credentials sont invalides ou le compte inactif.
        """
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
        """
        Invalide le refresh token (blacklist).
        Lève une ValueError si le token est invalide ou déjà révoqué.
        """
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except TokenError:
            raise ValueError("Token invalide ou déjà révoqué.")

    @staticmethod
    def _generer_tokens(utilisateur: Utilisateur) -> dict:
        """Génère une paire access/refresh token pour un utilisateur."""
        refresh = RefreshToken.for_user(utilisateur)
        return {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }


class UtilisateurService:
    """
    Service pour la gestion des utilisateurs.
    """

    @staticmethod
    def creer_utilisateur(data: dict) -> Utilisateur:
        """
        Crée un utilisateur via le serializer.
        data doit déjà être validé (serializer.validated_data).
        """
        from .serializers import InscriptionSerializer
        serializer = InscriptionSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        return serializer.save()