from django.contrib.auth.hashers import check_password, make_password
from django.http import JsonResponse
from django.views import View
from django.utils.timezone import now, timedelta
from .models import User, Role, Session, PasswordHistory
import uuid
from .models import SecuritySettings
from .utils import log_event, is_password_valid

class SecuritySettingsView(View):
    def get(self, request):
        try:
            settings = SecuritySettings.objects.first()  # Récupère les paramètres existants
            if not settings:
                return JsonResponse({"error": "Paramètres non configurés."}, status=404)
            return JsonResponse({
                "password_complexity": settings.password_complexity,
                "session_duration": settings.session_duration,
                "max_login_attempts": settings.max_login_attempts,
                "lockout_duration": settings.lockout_duration,
                "force_password_change": settings.force_password_change,
            })
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    def post(self, request):
        try:
            settings, _ = SecuritySettings.objects.get_or_create(id=1)
            settings.password_complexity = request.POST.get("password_complexity", settings.password_complexity)
            settings.session_duration = int(request.POST.get("session_duration", settings.session_duration))
            settings.max_login_attempts = int(request.POST.get("max_login_attempts", settings.max_login_attempts))
            settings.lockout_duration = int(request.POST.get("lockout_duration", settings.lockout_duration))
            settings.force_password_change = request.POST.get("force_password_change", "false").lower() == "true"
            settings.save()
            return JsonResponse({"message": "Paramètres mis à jour avec succès."})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)


class RegisterView(View):
    def post(self, request):
        try:
            # Récupère les données du formulaire
            username = request.POST.get('username')
            password = request.POST.get('password')
            role_name = request.POST.get('role')

            if not username or not password or not role_name:
                return JsonResponse({"error": "Tous les champs sont requis."}, status=400)

            # Vérifie si le rôle existe
            try:
                role = Role.objects.get(name=role_name)
            except Role.DoesNotExist:
                return JsonResponse({"error": "Rôle invalide."}, status=400)

            # Vérifie si le nom d'utilisateur est déjà utilisé
            if User.objects.filter(username=username).exists():
                return JsonResponse({"error": "Nom d'utilisateur déjà pris."}, status=400)

            # Récupère les paramètres de sécurité
            settings = SecuritySettings.objects.first()
            if not settings:
                return JsonResponse({"error": "Paramètres de sécurité non configurés."}, status=500)

            # Vérifie la complexité du mot de passe
            if settings.password_complexity == "low":
                pass  # Aucune contrainte
            elif settings.password_complexity == "medium":
                if len(password) < 8:
                    return JsonResponse({"error": "Le mot de passe doit contenir au moins 8 caractères."}, status=400)
            elif settings.password_complexity == "high":
                if len(password) < 12 or not any(c.isupper() for c in password) or not any(c.isdigit() for c in password):
                    return JsonResponse({
                        "error": "Le mot de passe doit contenir au moins 12 caractères, une majuscule et un chiffre."
                    }, status=400)

            # Crée l'utilisateur avec un mot de passe haché
            user = User(username=username, role=role)
            user.set_password(password)  # Hache et stocke le mot de passe
            user.save()

            return JsonResponse({"message": "Utilisateur créé avec succès.", "username": user.username}, status=201)

        except Exception as e:
            return JsonResponse({"error": f"Une erreur est survenue : {str(e)}"}, status=500)


from django.utils.timezone import now, timedelta

def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        ip_address = get_client_ip(request)  # Fonction pour obtenir l'adresse IP

        if not username or not password:
            return JsonResponse({"error": "Nom d'utilisateur et mot de passe requis."}, status=400)

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            log_event(None, "Failed Login", ip_address, f"Invalid username: {username}")
            return JsonResponse({"error": "Nom d'utilisateur ou mot de passe incorrect"}, status=401)

        # Récupère les paramètres de sécurité
        settings = SecuritySettings.objects.first()
        if not settings:
            return JsonResponse({"error": "Paramètres de sécurité non configurés."}, status=500)

        max_login_attempts = settings.max_login_attempts
        lockout_duration = settings.lockout_duration
        session_duration = settings.session_duration

        # Vérifie si l'utilisateur est verrouillé
        if user.failed_login_attempts >= max_login_attempts:
            lockout_time = user.lock_until  # Champ personnalisé pour gérer le verrouillage
            if lockout_time and now() < lockout_time:
                return JsonResponse({"error": "Compte verrouillé. Réessayez après quelques minutes."}, status=403)

        # Vérifie le mot de passe
        if user.check_password(password):
            # Vérifie si un changement de mot de passe est requis
            if user.force_password_change:
                return JsonResponse({
                    "error": "Vous devez changer votre mot de passe avant de continuer.",
                    "force_password_change": True
                }, status=403)

            # Réinitialise les tentatives échouées et supprime le verrouillage
            user.failed_login_attempts = 0
            user.lock_until = None
            user.last_login = now()
            user.save()

            token = str(uuid.uuid4())  # Génère un token unique
            expiration_time = now() + timedelta(minutes=session_duration)
            Session.objects.create(user=user, token=token, expiration_time=expiration_time)

            log_event(user, "Login", ip_address, "Connexion réussie")
            return JsonResponse({
                "message": "Connexion réussie",
                "role": user.role.name,
                "token": token,
                "username": user.username
            }, status=200)

        # Incrémente les tentatives échouées
        user.failed_login_attempts += 1
        if user.failed_login_attempts >= max_login_attempts:
            user.lock_until = now() + timedelta(minutes=lockout_duration)
            log_event(user, "Account Locked", ip_address, "Compte verrouillé après trop de tentatives")
        user.save()

        log_event(user, "Failed Login", ip_address, "Mot de passe incorrect")
        return JsonResponse({"error": "Nom d'utilisateur ou mot de passe incorrect"}, status=401)

    return JsonResponse({"error": "Méthode non autorisée"}, status=405)

# Fonction pour obtenir l'adresse IP du client
def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


class ChangePasswordView(View):
    def post(self, request):
        username = request.POST.get("username")
        current_password = request.POST.get("current_password")
        new_password = request.POST.get("new_password")
        ip_address = get_client_ip(request)  # Récupère l'adresse IP du client

        if not username or not current_password or not new_password:
            return JsonResponse({"error": "Tous les champs sont requis."}, status=400)

        if check_password(new_password, current_password):
            log_event(None, "Failed Password Change", ip_address, "Tentative de réutilisation du mot de passe actuel")
            return JsonResponse({"error": "Vous ne pouvez pas réutiliser un mot de passe précédent."}, status=400)
            
        try:
            user = User.objects.get(username=username)

            # Vérifie le mot de passe actuel
            if not user.check_password(current_password):
                log_event(user, "Failed Password Change", ip_address, "Mot de passe actuel incorrect")
                return JsonResponse({"error": "Mot de passe actuel incorrect."}, status=400)

            # Vérifie l'historique des mots de passe
            if PasswordHistory.objects.filter(user=user).exists():
                for old_password in PasswordHistory.objects.filter(user=user):
                    if old_password.is_reused(new_password):
                        log_event(user, "Failed Password Change", ip_address, "Ancien mot de passe réutilisé")
                        return JsonResponse(
                            {"error": "Vous ne pouvez pas utiliser un ancien mot de passe."},
                            status=400
                        )

            # Hache le nouveau mot de passe
            hashed_new_password = make_password(new_password)

            # Met à jour le mot de passe
            user.set_password(new_password)
            user.add_to_password_history(hashed_new_password)
            user.failed_login_attempts = 0
            user.save()

            log_event(user, "Password Change", ip_address, "Mot de passe modifié avec succès")
            return JsonResponse({"message": "Mot de passe mis à jour avec succès."})
        except User.DoesNotExist:
            log_event(None, "Failed Password Change", ip_address, "Utilisateur introuvable")
            return JsonResponse({"error": "Utilisateur introuvable."}, status=404)
        except Exception as e:
            log_event(None, "Failed Password Change", ip_address, f"Erreur: {str(e)}")
            return JsonResponse({"error": f"Une erreur est survenue : {str(e)}"}, status=500)

class UsersByRoleView(View):
    def get(self, request, role_name):
        try:
            # Filtre les utilisateurs par rôle
            users = User.objects.filter(role__name=role_name).values('username')
            return JsonResponse({"users": list(users)}, status=200)
        except Exception as e:
            return JsonResponse({"error": f"Une erreur est survenue : {str(e)}"}, status=500)

class VerifyTokenView(View):
    def post(self, request):
        token = request.POST.get("token")

        if not token:
            return JsonResponse({"error": "Token requis."}, status=400)

        try:
            # Vérifie si le token est valide et non expiré
            session = Session.objects.get(token=token, expiration_time__gte=now())
            user = session.user
            return JsonResponse({
                "valid": True,
                "username": user.username,
                "role": user.role.name,
            })
        except Session.DoesNotExist:
            return JsonResponse({"valid": False, "error": "Token invalide ou expiré."}, status=401)