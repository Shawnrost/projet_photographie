from django.urls import path
from .views import (
    TarifsView,
    SouscrireView,
    StatutAbonnementView,
    AnnulerAbonnementView,
    HistoriqueAbonnementView,
)

app_name = "abonnements"

urlpatterns = [
    path("tarifs/",              TarifsView.as_view(),             name="tarifs"),
    path("souscrire/",           SouscrireView.as_view(),          name="souscrire"),
    path("statut/",              StatutAbonnementView.as_view(),   name="statut"),
    path("<uuid:pk>/annuler/",   AnnulerAbonnementView.as_view(),  name="annuler"),
    path("historique/",          HistoriqueAbonnementView.as_view(), name="historique"),
]