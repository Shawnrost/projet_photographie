from django.contrib import admin
from .models import Publication, Categorie, Tag, Reaction


@admin.register(Categorie)
class CategorieAdmin(admin.ModelAdmin):
    list_display = ["nom", "created_at"]
    search_fields = ["nom"]


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ["nom", "created_at"]
    search_fields = ["nom"]


@admin.register(Publication)
class PublicationAdmin(admin.ModelAdmin):
    list_display = ["titre", "photographe", "type", "is_active", "created_at"]
    list_filter = ["type", "is_active", "categories"]
    search_fields = ["titre", "description"]
    filter_horizontal = ["categories", "tags"]


@admin.register(Reaction)
class ReactionAdmin(admin.ModelAdmin):
    list_display = ["utilisateur", "publication", "created_at"]