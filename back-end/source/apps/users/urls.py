from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    # Auth
    InscriptionView,
    ConnexionView,
    DeconnexionView,
    MoiView,
    # Profil
    ModifierProfilView,
    SupprimerPhotoProfilView,
    ModifierProfilPhotographeView,
    SupprimerPhotoCouvertureView,
    ChangerMotDePasseView,
)

app_name = "users"

urlpatterns = [
    # ── Auth ──────────────────────────────────────
    path("inscription/",    InscriptionView.as_view(),  name="inscription"),
    path("connexion/",      ConnexionView.as_view(),    name="connexion"),
    path("deconnexion/",    DeconnexionView.as_view(),  name="deconnexion"),
    path("token/refresh/",  TokenRefreshView.as_view(), name="token_refresh"),
    path("moi/",            MoiView.as_view(),          name="moi"),

    # ── Profil ────────────────────────────────────
    path("profil/",                             ModifierProfilView.as_view(),           name="modifier_profil"),
    path("profil/photo/",                       SupprimerPhotoProfilView.as_view(),     name="supprimer_photo_profil"),
    path("profil/photographe/",                 ModifierProfilPhotographeView.as_view(),name="modifier_profil_photographe"),
    path("profil/photographe/photo-couverture/",SupprimerPhotoCouvertureView.as_view(), name="supprimer_photo_couverture"),
    path("profil/changer-mot-de-passe/",        ChangerMotDePasseView.as_view(),        name="changer_mot_de_passe"),
]