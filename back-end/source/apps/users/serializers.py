from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import Utilisateur, ProfilPhotographe, UserRole


# ─────────────────────────────────────────────
# Serializers auth
# ─────────────────────────────────────────────

class InscriptionSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    password_confirm = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Utilisateur
        fields = ["email", "nom", "prenom", "role", "password", "password_confirm"]
        extra_kwargs = {"role": {"required": False}}

    def validate_role(self, value):
        if value == UserRole.ADMIN:
            raise serializers.ValidationError(
                "Vous ne pouvez pas créer un compte avec le rôle admin."
            )
        return value

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError(
                {"password_confirm": "Les mots de passe ne correspondent pas."}
            )
        try:
            validate_password(attrs["password"])
        except ValidationError as e:
            raise serializers.ValidationError({"password": list(e.messages)})
        return attrs

    def create(self, validated_data):
        validated_data.pop("password_confirm")
        password = validated_data.pop("password")
        utilisateur = Utilisateur(**validated_data)
        utilisateur.set_password(password)
        utilisateur.save()
        if utilisateur.role == UserRole.PHOTOGRAPHE:
            profil = ProfilPhotographe.objects.create(utilisateur=utilisateur)
            # Essai gratuit Premium 1 mois automatique à l'inscription
            try:
                from apps.abonnements.services import AbonnementService
                AbonnementService.creer_essai_gratuit(profil)
            except Exception as e:
                print(f"[ESSAI] Erreur création essai gratuit : {e}")
        return utilisateur


class ConnexionSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)


# ─────────────────────────────────────────────
# Serializers profil
# ─────────────────────────────────────────────

class ProfilPhotographeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfilPhotographe
        fields = ["id", "bio", "adresse", "photo_couverture", "essai_utilise", "created_at"]
        read_only_fields = ["id", "essai_utilise", "created_at"]


class UtilisateurSerializer(serializers.ModelSerializer):
    """Lecture complète de l'utilisateur connecté."""
    profil_photographe = serializers.SerializerMethodField()

    class Meta:
        model = Utilisateur
        fields = [
            "id", "email", "nom", "prenom", "role",
            "photo_profil", "created_at", "updated_at",
            "profil_photographe",
        ]
        read_only_fields = ["id", "email", "role", "created_at", "updated_at"]

    def get_profil_photographe(self, obj):
        if obj.role == UserRole.PHOTOGRAPHE and hasattr(obj, "profil_photographe"):
            return ProfilPhotographeSerializer(obj.profil_photographe).data
        return None


class ModifierProfilSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilisateur
        fields = ["nom", "prenom", "photo_profil"]

    def update(self, instance, validated_data):
        nouvelle_photo = validated_data.get("photo_profil")
        if nouvelle_photo and instance.photo_profil:
            instance.photo_profil.delete(save=False)
        return super().update(instance, validated_data)


class ModifierProfilPhotographeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfilPhotographe
        fields = ["bio", "adresse", "photo_couverture"]

    def update(self, instance, validated_data):
        nouvelle_photo = validated_data.get("photo_couverture")
        if nouvelle_photo and instance.photo_couverture:
            instance.photo_couverture.delete(save=False)
        return super().update(instance, validated_data)


class ChangerMotDePasseSerializer(serializers.Serializer):
    ancien_mot_de_passe  = serializers.CharField(required=True, write_only=True)
    nouveau_mot_de_passe = serializers.CharField(required=True, write_only=True)
    confirmation         = serializers.CharField(required=True, write_only=True)

    def validate_ancien_mot_de_passe(self, value):
        utilisateur = self.context["request"].user
        if not utilisateur.check_password(value):
            raise serializers.ValidationError("L'ancien mot de passe est incorrect.")
        return value

    def validate(self, attrs):
        if attrs["nouveau_mot_de_passe"] != attrs["confirmation"]:
            raise serializers.ValidationError(
                {"confirmation": "Les mots de passe ne correspondent pas."}
            )
        try:
            validate_password(
                attrs["nouveau_mot_de_passe"],
                user=self.context["request"].user
            )
        except ValidationError as e:
            raise serializers.ValidationError(
                {"nouveau_mot_de_passe": list(e.messages)}
            )
        return attrs