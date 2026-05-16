from rest_framework import serializers
from django.utils import timezone
from .models import Abonnement, PlanTarif, SubscriptionPlan, SubscriptionDuree, SubscriptionStatus


class PlanTarifSerializer(serializers.ModelSerializer):
    plan_label  = serializers.CharField(source="get_plan_display",  read_only=True)
    duree_label = serializers.CharField(source="get_duree_display", read_only=True)

    class Meta:
        model  = PlanTarif
        fields = ["id", "plan", "plan_label", "duree", "duree_label", "prix"]


class AbonnementSerializer(serializers.ModelSerializer):
    est_actif      = serializers.BooleanField(read_only=True)
    jours_restants = serializers.SerializerMethodField()
    plan_tarif     = PlanTarifSerializer(read_only=True)

    class Meta:
        model  = Abonnement
        fields = [
            "id", "type", "duree", "status", "prix",
            "plan_tarif", "date_deb", "date_fin",
            "est_actif", "jours_restants", "created_at",
        ]
        read_only_fields = ["id", "status", "prix", "date_deb", "date_fin", "created_at"]

    def get_jours_restants(self, obj):
        if obj.date_fin > timezone.now():
            return (obj.date_fin - timezone.now()).days
        return 0


class SouscrireAbonnementSerializer(serializers.Serializer):
    type  = serializers.ChoiceField(choices=SubscriptionPlan.choices)
    duree = serializers.ChoiceField(choices=SubscriptionDuree.choices)


class AnnulerAbonnementSerializer(serializers.Serializer):
    confirmation = serializers.BooleanField()

    def validate_confirmation(self, value):
        if not value:
            raise serializers.ValidationError("Vous devez confirmer l'annulation.")
        return value