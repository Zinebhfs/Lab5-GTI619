from django.contrib.auth.hashers import check_password
from django.http import JsonResponse
from django.views import View
from django.utils.timezone import now, timedelta
from .models import User, Role, Session
import uuid
from .models import SecuritySettings

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

        if not username or not password:
            return JsonResponse({"error": "Nom d'utilisateur et mot de passe requis."}, status=400)

        try:
            # Vérifie si l'utilisateur existe
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            # Retourne 401 si l'utilisateur n'existe pas
            return JsonResponse({"error": "Nom d'utilisateur ou mot de passe incorrect"}, status=401)

        # Vérifie si l'utilisateur doit changer son mot de passe
        if user.force_password_change:
            return JsonResponse({
                "error": "Vous devez changer votre mot de passe.",
                "force_password_change": True
            }, status=403)

        # Vérifie le mot de passe
        if user.check_password(password):  # Mot de passe correct
            token = str(uuid.uuid4())  # Génère un token
            expiration_time = now() + timedelta(hours=1)  # Durée de session
            Session.objects.create(user=user, token=token, expiration_time=expiration_time)
            return JsonResponse({
                "message": "Connexion réussie",
                "role": user.role.name,
                "token": token,
                "username": user.username
            }, status=200)

        # Si le mot de passe est incorrect
        return JsonResponse({"error": "Nom d'utilisateur ou mot de passe incorrect"}, status=401)

    return JsonResponse({"error": "Méthode non autorisée"}, status=405)

class ChangePasswordView(View):
    def post(self, request):
        username = request.POST.get("username")
        new_password = request.POST.get("new_password")

        if not username or not new_password:
            return JsonResponse({"error": "Tous les champs sont requis."}, status=400)

        try:
            user = User.objects.get(username=username)
            user.set_password(new_password)  # Change et hache le mot de passe
            user.failed_login_attempts = 0  # Réinitialise les tentatives échouées
            user.save()

            return JsonResponse({"message": "Mot de passe mis à jour avec succès."})
        except User.DoesNotExist:
            return JsonResponse({"error": "Utilisateur introuvable."}, status=404)
        except Exception as e:
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