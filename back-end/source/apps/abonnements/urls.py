from django.urls import path
from .views import (
    TarifsView,
    SouscrireView,
    StatutAbonnementView,
    AnnulerAbonnementView,
    HistoriqueAbonnementView,
    # Suivi
    SuiviToggleView,
    AbonnesListView,
    SuivisListView,
    FilActualiteView,
    PlanTarifListView,
    PlanTarifDetailView,

)

app_name = "abonnements"

urlpatterns = [
    # ── Abonnements plateforme ────────────────────────────────
    path("tarifs/",                              TarifsView.as_view(),              name="tarifs"),
    path("souscrire/",                           SouscrireView.as_view(),           name="souscrire"),
    path("statut/",                              StatutAbonnementView.as_view(),    name="statut"),
    path("<uuid:pk>/annuler/",                   AnnulerAbonnementView.as_view(),   name="annuler"),
    path("historique/",                          HistoriqueAbonnementView.as_view(),name="historique"),

    # ── Suivi ─────────────────────────────────────────────────
    path("suivre/<uuid:pk>/",                    SuiviToggleView.as_view(),         name="suivre"),
    path("utilisateurs/<uuid:pk>/abonnes/",      AbonnesListView.as_view(),         name="abonnes"),
    path("utilisateurs/<uuid:pk>/suivis/",       SuivisListView.as_view(),          name="suivis"),
    path("fil-actualite/",                       FilActualiteView.as_view(),        name="fil_actualite"),

    # ── Admin CRUD tarifs ─────────────────────────────────────
    path("admin/tarifs/",            PlanTarifListView.as_view(),   name="admin_tarifs_liste"),
    path("admin/tarifs/<uuid:pk>/",  PlanTarifDetailView.as_view(), name="admin_tarifs_detail"),

]