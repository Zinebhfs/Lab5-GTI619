from django.urls import path
from .views import RegisterView, login_view, UsersByRoleView, SecuritySettingsView, ChangePasswordView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),  # Route pour s'inscrire
    path('login/', login_view, name='login'),# Route pour se connecter
    path('role/<str:role_name>/', UsersByRoleView.as_view(), name='users_by_role'),
    path('security-settings/', SecuritySettingsView.as_view(), name='security_settings'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),                 
]