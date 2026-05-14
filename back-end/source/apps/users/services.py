from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from .models import Utilisateur, ProfilPhotographe, UserRole


# ─────────────────────────────────────────────
# Auth (inchangé)
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
    def modifier_profil(utilisateur: Utilisateur, data: dict, files: dict) -> Utilisateur:
        """
        Met à jour les champs de base de l'utilisateur (nom, prenom, photo_profil).
        data  : request.data
        files : request.FILES
        """
        from .serializers import ModifierProfilSerializer
        serializer = ModifierProfilSerializer(
            utilisateur,
            data={**data, **files},
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        return serializer.save()

    @staticmethod
    def modifier_profil_photographe(utilisateur: Utilisateur, data: dict, files: dict) -> ProfilPhotographe:
        """
        Met à jour le profil étendu d'un photographe (bio, adresse, photo_couverture).
        Crée le profil s'il n'existe pas (sécurité).
        """
        from .serializers import ModifierProfilPhotographeSerializer
        profil, _ = ProfilPhotographe.objects.get_or_create(utilisateur=utilisateur)
        serializer = ModifierProfilPhotographeSerializer(
            profil,
            data={**data, **files},
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        return serializer.save()

    @staticmethod
    def changer_mot_de_passe(utilisateur: Utilisateur, data: dict, request) -> None:
        """
        Valide et applique le changement de mot de passe.
        Lève une ValidationError (DRF) en cas d'erreur.
        """
        from .serializers import ChangerMotDePasseSerializer
        serializer = ChangerMotDePasseSerializer(data=data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        utilisateur.set_password(serializer.validated_data["nouveau_mot_de_passe"])
        utilisateur.save()

    @staticmethod
    def supprimer_photo_profil(utilisateur: Utilisateur) -> None:
        """Supprime la photo de profil du disque et de la base."""
        if utilisateur.photo_profil:
            utilisateur.photo_profil.delete(save=False)
            utilisateur.photo_profil = None
            utilisateur.save()

    @staticmethod
    def supprimer_photo_couverture(utilisateur: Utilisateur) -> None:
        """Supprime la photo de couverture du photographe."""
        try:
            profil = utilisateur.profil_photographe
        except ProfilPhotographe.DoesNotExist:
            raise ValueError("Profil photographe introuvable.")
        if profil.photo_couverture:
            profil.photo_couverture.delete(save=False)
            profil.photo_couverture = None
            profil.save()