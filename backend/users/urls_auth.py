"""Auth-specific URL routes: /api/auth/..."""

from django.urls import path
from .views import (
    register_view, login_view, logout_view, forgot_password_view,
    profile_view, google_login_view, phone_login_view, verify_otp_view,
)

urlpatterns = [
    path('register/', register_view, name='auth-register'),
    path('login/', login_view, name='auth-login'),
    path('logout/', logout_view, name='auth-logout'),
    path('forgot-password/', forgot_password_view, name='auth-forgot-password'),
    path('profile/', profile_view, name='auth-profile'),
    path('google-login/', google_login_view, name='auth-google-login'),
    path('phone-login/', phone_login_view, name='auth-phone-login'),
    path('verify-otp/', verify_otp_view, name='auth-verify-otp'),
]
