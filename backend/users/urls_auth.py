"""Auth-specific URL routes: /api/auth/..."""

from django.urls import path
from .views import register_view, login_view, logout_view, forgot_password_view, profile_view

urlpatterns = [
    path('register/', register_view, name='auth-register'),
    path('login/', login_view, name='auth-login'),
    path('logout/', logout_view, name='auth-logout'),
    path('forgot-password/', forgot_password_view, name='auth-forgot-password'),
    path('profile/', profile_view, name='auth-profile'),
]
