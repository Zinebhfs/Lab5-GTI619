from django.contrib import admin

# Register your models here.
from .models import AuditLog

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ("user", "action", "timestamp", "ip_address")
    search_fields = ("user__username", "action")
    list_filter = ("action", "timestamp")
