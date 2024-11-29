def log_event(user, action, ip_address=None, details=""):
    from .models import AuditLog

    AuditLog.objects.create(
        user=user,
        action=action,
        ip_address=ip_address,
        details=details
    )