from django.urls import path
from .views import (
    PublicationListView,
    PublicationDetailView,
    LikeView,
    MesPublicationsView,
    CategorieListView,
    TagRechercheView,
    CommentaireListView,
    CommentaireDeleteView,
    LikeCommentaireView,
    TelechargerPublicationView,

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

    # ── Commentaires ──────────────────────────────────────────
    path("<uuid:pk>/commentaires/",    CommentaireListView.as_view(),   name="commentaires"),
    path("commentaires/<uuid:pk>/",    CommentaireDeleteView.as_view(), name="supprimer_commentaire"),
    path("commentaires/<uuid:pk>/like/", LikeCommentaireView.as_view(),    name="like_commentaire"),
    path("<uuid:pk>/telecharger/",       TelechargerPublicationView.as_view(), name="telecharger"),
]