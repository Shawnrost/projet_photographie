from django.contrib import admin
from .models import Abonnement, PlanTarif


@admin.register(PlanTarif)
class PlanTarifAdmin(admin.ModelAdmin):
    list_display  = ["plan", "duree", "prix", "est_actif", "updated_at"]
    list_filter   = ["plan", "duree", "est_actif"]
    list_editable = ["prix", "est_actif"]   # ← modifier le prix directement depuis la liste
    ordering      = ["plan", "duree"]


@admin.register(Abonnement)
class AbonnementAdmin(admin.ModelAdmin):
    list_display    = ["photographe", "type", "duree", "status", "prix", "date_fin", "est_actif"]
    list_filter     = ["type", "duree", "status"]
    search_fields   = ["photographe__utilisateur__email"]
    readonly_fields = ["date_deb", "created_at", "prix", "plan_tarif"]