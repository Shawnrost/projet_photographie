from django.urls import path
from .views import (
    PublicationListView,
    PublicationDetailView,
    LikeView,
    MesPublicationsView,
    CategorieListView,
    TagRechercheView,
)

app_name = "publications"

urlpatterns = [
    # ── Publications ──────────────────────────────────────────
    path("",                        PublicationListView.as_view(),   name="liste"),
    path("<uuid:pk>/",              PublicationDetailView.as_view(), name="detail"),
    path("<uuid:pk>/like/",         LikeView.as_view(),              name="like"),
    path("mes-publications/",       MesPublicationsView.as_view(),   name="mes_publications"),

    # ── Catégories ────────────────────────────────────────────
    path("categories/",             CategorieListView.as_view(),     name="categories"),

    # ── Tags ──────────────────────────────────────────────────
    path("tags/",                   TagRechercheView.as_view(),      name="tags"),
]