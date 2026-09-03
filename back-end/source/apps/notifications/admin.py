from django.contrib import admin
from .models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display  = ["destinataire", "declencheur", "type", "is_read", "is_active", "created_at"]
    list_filter   = ["type", "is_read", "is_active"]
    search_fields = ["destinataire__email", "declencheur__email", "message"]
    readonly_fields = ["created_at"]