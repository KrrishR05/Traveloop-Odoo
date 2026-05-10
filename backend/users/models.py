from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    """Extended user profile for the travel platform."""
    user        = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    avatar_url  = models.URLField(blank=True, default='')
    bio         = models.TextField(blank=True, default='')
    location    = models.CharField(max_length=100, blank=True, default='')
    phone       = models.CharField(max_length=20, blank=True, default='')
    created_at  = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Profile: {self.user.username}"
