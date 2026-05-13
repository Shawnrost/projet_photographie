from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import Utilisateur, ProfilPhotographe, UserRole


class InscriptionSerializer(serializers.ModelSerializer):
    """
    Serializer pour la création d'un compte utilisateur.
    Accepte les rôles : 'client' ou 'photographe'.
    """
    password = serializers.CharField(write_only=True, required=True)
    password_confirm = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Utilisateur
        fields = [
            "email",
            "nom",
            "prenom",
            "role",
            "password",
            "password_confirm",
        ]
        extra_kwargs = {
            "role": {"required": False},
        }

    def validate_role(self, value):
        """Seuls les rôles 'client' et 'photographe' sont autorisés à l'inscription."""
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
        # Création automatique du profil photographe si le rôle est photographe
        if utilisateur.role == UserRole.PHOTOGRAPHE:
            ProfilPhotographe.objects.create(utilisateur=utilisateur)
        return utilisateur


class UtilisateurSerializer(serializers.ModelSerializer):
    """Serializer de lecture des informations d'un utilisateur."""
    profil_photographe = serializers.SerializerMethodField()

    class Meta:
        model = Utilisateur
        fields = [
            "id",
            "email",
            "nom",
            "prenom",
            "role",
            "photo_profil",
            "created_at",
            "updated_at",
            "profil_photographe",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_profil_photographe(self, obj):
        if obj.role == UserRole.PHOTOGRAPHE and hasattr(obj, "profil_photographe"):
            return ProfilPhotographeSerializer(obj.profil_photographe).data
        return None


class ProfilPhotographeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfilPhotographe
        fields = ["id", "bio", "adresse", "photo_couverture", "created_at"]
        read_only_fields = ["id", "created_at"]


class ConnexionSerializer(serializers.Serializer):
    """Serializer pour la connexion (login)."""
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)