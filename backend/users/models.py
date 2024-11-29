from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils.timezone import now
from django.contrib.auth.hashers import check_password

# Manager pour le modèle utilisateur personnalisé
class CustomUserManager(BaseUserManager):
    def create_user(self, username, password=None, role=None, **extra_fields):
        if not username:
            raise ValueError("L'utilisateur doit avoir un nom d'utilisateur")
        user = self.model(username=username, role=role, **extra_fields)
        user.set_password(password)  # Hash le mot de passe
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(username, password, **extra_fields)


# Modèle pour les rôles
class Role(models.Model):
    name = models.CharField(max_length=50, unique=True)  # Nom du rôle (admin, résidentiel, business)

    def __str__(self):
        return self.name


# Modèle utilisateur personnalisé
class User(AbstractBaseUser):
    username = models.CharField(max_length=150, unique=True)
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True)  # Rôle utilisateur
    is_active = models.BooleanField(default=True)  # Utilisateur actif ou non
    is_staff = models.BooleanField(default=False)  # Accès à l'interface admin
    is_superuser = models.BooleanField(default=False)  # Super-utilisateur
    failed_login_attempts = models.IntegerField(default=0)  # Tentatives échouées
    force_password_change = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    def add_to_password_history(self, hashed_password):
        PasswordHistory.objects.create(user=self, password_hash=hashed_password)

    def has_perm(self, perm, obj=None):
        """
        Vérifie si l'utilisateur a une permission spécifique.
        """
        return self.is_superuser or super().has_perm(perm, obj)

    def has_module_perms(self, app_label):
        """
        Vérifie si l'utilisateur a des permissions sur un module.
        """
        return self.is_superuser or True  # Remplacez par une logique personnalisée si nécessaire

    def __str__(self):
        return self.username


# Modèle pour les logs des actions utilisateur
class Log(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # L'utilisateur associé
    action = models.TextField()  # Description de l'action
    timestamp = models.DateTimeField(auto_now_add=True)  # Horodatage automatique

    def __str__(self):
        return f"{self.user.username} - {self.action} - {self.timestamp}"


# Modèle pour les sessions utilisateur
class Session(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # L'utilisateur associé
    token = models.CharField(max_length=255, unique=True)  # Token unique
    expiration_time = models.DateTimeField()  # Date d'expiration

    def is_valid(self):
        return now() < self.expiration_time  # Vérifie si la session est valide

    def __str__(self):
        return f"{self.user.username} - {self.token} - Expires: {self.expiration_time}"

class SecuritySettings(models.Model):
    password_complexity = models.CharField(
        max_length=50, 
        choices=[("low", "Low"), ("medium", "Medium"), ("high", "High")], 
        default="medium"
    )
    session_duration = models.IntegerField(default=60)  # En minutes
    max_login_attempts = models.IntegerField(default=5)
    lockout_duration = models.IntegerField(default=15)  # En minutes
    force_password_change = models.BooleanField(default=False)  # Forcer le changement de mot de passe

    def __str__(self):
        return f"Security Settings (Password Complexity: {self.password_complexity})"

class PasswordHistory(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='password_history')
    password_hash = models.CharField(max_length=128)
    timestamp = models.DateTimeField(auto_now_add=True)

    def is_reused(self, new_password):
        return check_password(new_password, self.password_hash)

class AuditLog(models.Model):
    user = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=255)  # Exemple : "Login", "Change Password"
    timestamp = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)  # Adresse IP
    details = models.TextField(blank=True)  # Informations supplémentaires

    def __str__(self):
        return f"{self.user.username if self.user else 'Unknown User'} - {self.action} at {self.timestamp}"