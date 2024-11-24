from django.urls import path
from .views import RegisterView, login_view

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),  # Route pour s'inscrire
    path('login/', login_view, name='login'),                   # Route pour se connecter
]
