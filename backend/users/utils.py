def log_event(user, action, ip_address=None, details=""):
    from .models import AuditLog

    AuditLog.objects.create(
        user=user,
        action=action,
        ip_address=ip_address,
        details=details
    )

def is_password_valid(password, complexity):
    if complexity == "low":
        return True
    elif complexity == "medium":
        return len(password) >= 8
    elif complexity == "high":
        return (
            len(password) >= 12 and
            any(c.isupper() for c in password) and
            any(c.isdigit() for c in password)
        )
    return False
