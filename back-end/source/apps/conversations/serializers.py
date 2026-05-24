from rest_framework import serializers
from .models import Conversation, Message
from apps.users.models import Utilisateur


class ExpediteurSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Utilisateur
        fields = ["id", "nom", "prenom", "photo_profil"]


class MessageSerializer(serializers.ModelSerializer):
    expediteur  = ExpediteurSerializer(read_only=True)
    fichier_url = serializers.SerializerMethodField()

    class Meta:
        model  = Message
        fields = [
            "id", "expediteur", "contenu",
            "fichier_url", "nom_fichier_original", "type_fichier",
            "is_read", "sent_at",
        ]
        read_only_fields = ["id", "expediteur", "is_read", "sent_at"]

    def get_fichier_url(self, obj):
        request = self.context.get("request")
        if obj.fichier and request:
            return request.build_absolute_uri(obj.fichier.url)
        return None


class EnvoyerMessageSerializer(serializers.ModelSerializer):
    """Création d'un message via HTTP (upload de fichier)."""
    class Meta:
        model  = Message
        fields = ["contenu", "fichier"]

    def to_internal_value(self, data):
        """Normalise les données multipart."""
        data_normalisee = data.copy()
        if "contenu" in data_normalisee:
            valeur = data_normalisee["contenu"]
            if isinstance(valeur, list) and len(valeur) == 1:
                data_normalisee["contenu"] = valeur[0]
        return super().to_internal_value(data_normalisee)

    def validate(self, attrs):
        if not attrs.get("contenu") and not attrs.get("fichier"):
            raise serializers.ValidationError(
                "Un message doit contenir du texte ou un fichier."
            )
        return attrs


class ConversationSerializer(serializers.ModelSerializer):
    """Lecture d'une conversation avec le dernier message."""
    client_nom        = serializers.SerializerMethodField()
    client_photo      = serializers.SerializerMethodField()
    photographe_nom   = serializers.SerializerMethodField()
    photographe_photo = serializers.SerializerMethodField()
    dernier_message   = serializers.SerializerMethodField()
    non_lus_count     = serializers.IntegerField(read_only=True)

    class Meta:
        model  = Conversation
        fields = [
            "id",
            "client_nom", "client_photo",
            "photographe_nom", "photographe_photo",
            "non_lus_count", "dernier_message",
            "created_at", "last_message_at",
        ]

    def get_client_nom(self, obj):
        return f"{obj.client.prenom} {obj.client.nom}"

    def get_client_photo(self, obj):
        request = self.context.get("request")
        photo   = obj.client.photo_profil
        if photo and request:
            return request.build_absolute_uri(photo.url)
        return None

    def get_photographe_nom(self, obj):
        u = obj.photographe.utilisateur
        return f"{u.prenom} {u.nom}"

    def get_photographe_photo(self, obj):
        request = self.context.get("request")
        photo   = obj.photographe.utilisateur.photo_profil
        if photo and request:
            return request.build_absolute_uri(photo.url)
        return None

    def get_dernier_message(self, obj):
        dernier = obj.messages.last()
        if dernier:
            return {
                "contenu":  dernier.contenu,
                "sent_at":  dernier.sent_at,
                "is_read":  dernier.is_read,
                "a_fichier": bool(dernier.fichier),
            }
        return None


class CreerConversationSerializer(serializers.Serializer):
    """Initier une conversation avec un photographe."""
    photographe_id = serializers.UUIDField(required=True)
    message_initial = serializers.CharField(required=False, allow_blank=True)