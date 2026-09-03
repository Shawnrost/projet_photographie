from django.urls import path
from .views import (
    NotificationListView,
    NotificationNonLuesView,
    MarquerToutesLuesView,
    NotificationDetailView,
)

app_name = "notifications"

urlpatterns = [
    path("",                      NotificationListView.as_view(),     name="liste"),
    path("non-lues/",             NotificationNonLuesView.as_view(),  name="non_lues"),
    path("marquer-toutes-lues/",  MarquerToutesLuesView.as_view(),    name="marquer_toutes_lues"),
    path("<uuid:pk>/",            NotificationDetailView.as_view(),   name="detail"),
]