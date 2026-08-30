from django.contrib import admin
from .models import Publication, Categorie, Tag, Reaction, Commentaire, ReactionCommentaire


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

 
@admin.register(Commentaire)
class CommentaireAdmin(admin.ModelAdmin):
    list_display    = ["auteur", "publication", "parent", "contenu", "created_at"]
    list_filter     = ["created_at"]
    search_fields   = ["auteur__email", "contenu"]
    readonly_fields = ["created_at", "updated_at"]

@admin.register(ReactionCommentaire)
class ReactionCommentaireAdmin(admin.ModelAdmin):
    list_display = ["utilisateur", "commentaire", "created_at"]
