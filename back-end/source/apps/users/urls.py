from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import InscriptionView, ConnexionView, DeconnexionView, MoiView

app_name = "users"

urlpatterns = [
    path("inscription/", InscriptionView.as_view(), name="inscription"),
    path("connexion/", ConnexionView.as_view(), name="connexion"),
    path("deconnexion/", DeconnexionView.as_view(), name="deconnexion"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("moi/", MoiView.as_view(), name="moi"),
]