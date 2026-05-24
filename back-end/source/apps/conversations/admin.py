from django.contrib import admin
from .models import Conversation, Message


class MessageInline(admin.TabularInline):
    model           = Message
    extra           = 0
    readonly_fields = ["expediteur", "contenu", "fichier", "is_read", "sent_at"]


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display    = ["client", "photographe", "last_message_at"]
    search_fields   = ["client__email", "photographe__utilisateur__email"]
    readonly_fields = ["created_at", "last_message_at"]
    inlines         = [MessageInline]


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display    = ["expediteur", "conversation", "contenu", "is_read", "sent_at"]
    list_filter     = ["is_read"]
    search_fields   = ["expediteur__email", "contenu"]
    readonly_fields = ["sent_at"]