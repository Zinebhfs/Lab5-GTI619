from django.contrib.auth.hashers import check_password
from django.http import JsonResponse
from django.views import View
from django.utils.timezone import now, timedelta
from .models import User, Role, Session
import uuid

class RegisterView(View):
    def post(self, request):
        try:
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

            # Crée l'utilisateur et hache le mot de passe
            user = User(username=username, role=role)
            user.set_password(password)  # Hache et stocke le mot de passe
            user.save()

            return JsonResponse({"message": "Utilisateur créé avec succès.", "username": user.username}, status=201)

        except Exception as e:
            return JsonResponse({"error": f"Une erreur est survenue : {str(e)}"}, status=500)


def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        try:
            # Récupère l'utilisateur
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return JsonResponse({"error": "Nom d'utilisateur ou mot de passe incorrect"}, status=401)

        # Vérifie le mot de passe
        if user.check_password(password):  # Utilise le champ `password` géré par Django
            # Génère un token de session
            token = str(uuid.uuid4())
            expiration_time = now() + timedelta(hours=1)
            Session.objects.create(user=user, token=token, expiration_time=expiration_time)

            return JsonResponse({
                "message": "Connexion réussie",
                "role": user.role.name,
                "token": token
            })
        else:
            return JsonResponse({"error": "Nom d'utilisateur ou mot de passe incorrect"}, status=401)

    return JsonResponse({"error": "Méthode non autorisée"}, status=405)
