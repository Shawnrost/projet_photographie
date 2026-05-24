from django.urls import path
from .views import (
    PanierView,
    AjouterArticleView,
    RetirerArticleView,
    ViderPanierView,
    PayerCommandeView,
    AnnulerCommandeView,
    HistoriqueCommandesView,
)

app_name = "commandes"

urlpatterns = [
    # ── Panier ────────────────────────────────────────────────
    path("panier/",           PanierView.as_view(),         name="panier"),
    path("panier/ajouter/",   AjouterArticleView.as_view(), name="ajouter"),
    path("panier/retirer/",   RetirerArticleView.as_view(), name="retirer"),
    path("panier/vider/",     ViderPanierView.as_view(),    name="vider"),

    # ── Commandes ─────────────────────────────────────────────
    path("<uuid:pk>/payer/",  PayerCommandeView.as_view(),  name="payer"),
    path("<uuid:pk>/annuler/",AnnulerCommandeView.as_view(),name="annuler"),
    path("historique/",       HistoriqueCommandesView.as_view(), name="historique"),
]