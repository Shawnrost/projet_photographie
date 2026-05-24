from django.urls import path
from .views import (
    ConversationListView,
    ConversationDetailView,
    EnvoyerMessageView,
    NonLusTotalView,
)

app_name = "conversations"

urlpatterns = [
    path("",                           ConversationListView.as_view(),  name="liste"),
    path("non-lus/",                   NonLusTotalView.as_view(),       name="non_lus"),
    path("<uuid:pk>/",                 ConversationDetailView.as_view(),name="detail"),
    path("<uuid:pk>/messages/",        EnvoyerMessageView.as_view(),    name="envoyer"),
]