from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    declencheur_nom   = serializers.SerializerMethodField()
    declencheur_photo = serializers.SerializerMethodField()
    type_label        = serializers.CharField(source="get_type_display", read_only=True)

    class Meta:
        model  = Notification
        fields = [
            "id", "type", "type_label", "message",
            "declencheur_nom", "declencheur_photo",
            "publication_id", "commentaire_id",
            "is_read", "created_at",
        ]

    def get_declencheur_nom(self, obj):
        if obj.declencheur:
            return f"{obj.declencheur.prenom} {obj.declencheur.nom}"
        return None

    def get_declencheur_photo(self, obj):
        request = self.context.get("request")
        if obj.declencheur and obj.declencheur.photo_profil and request:
            return request.build_absolute_uri(obj.declencheur.photo_profil.url)
        return None