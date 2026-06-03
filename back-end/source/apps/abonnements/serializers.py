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


class PlanTarifCrudSerializer(serializers.ModelSerializer):
    """Serializer CRUD pour la gestion des plans tarifaires par l'admin."""
    plan_label  = serializers.CharField(source="get_plan_display",  read_only=True)
    duree_label = serializers.CharField(source="get_duree_display", read_only=True)

    class Meta:
        model  = PlanTarif
        fields = [
            "id", "plan", "plan_label", "duree", "duree_label",
            "prix", "est_actif", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "plan_label", "duree_label", "created_at", "updated_at"]

    def validate_prix(self, value):
        if value <= 0:
            raise serializers.ValidationError("Le prix doit être supérieur à 0.")
        return value

    def validate(self, attrs):
        # Vérifier l'unicité plan+durée à la création
        plan  = attrs.get("plan")
        duree = attrs.get("duree")
        if plan and duree:
            qs = PlanTarif.objects.filter(plan=plan, duree=duree)
            # Exclure l'instance courante lors d'une modification
            if self.instance:
                qs = qs.exclude(id=self.instance.id)
            if qs.exists():
                raise serializers.ValidationError(
                    {"non_field_errors": f"Un tarif '{plan} — {duree}' existe déjà."}
                )
        return attrs