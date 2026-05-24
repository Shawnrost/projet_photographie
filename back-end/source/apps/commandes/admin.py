from django.contrib import admin
from .models import Commande, Article


class ArticleInline(admin.TabularInline):
    model       = Article
    extra       = 0
    readonly_fields = ["publication", "quantite", "prix_unitaire"]


@admin.register(Commande)
class CommandeAdmin(admin.ModelAdmin):
    list_display    = ["id", "client", "status", "prix_a_payer", "created_at"]
    list_filter     = ["status"]
    search_fields   = ["client__email"]
    readonly_fields = ["prix_a_payer", "created_at", "updated_at"]
    inlines         = [ArticleInline]