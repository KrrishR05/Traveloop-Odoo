from django.contrib import admin
from .models import PackingItem

@admin.register(PackingItem)
class PackingItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'trip', 'category', 'is_packed', 'quantity')
    list_filter = ('category', 'is_packed')
