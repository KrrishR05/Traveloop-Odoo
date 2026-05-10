from django.contrib import admin
from .models import BudgetCategory, BudgetItem

@admin.register(BudgetCategory)
class BudgetCategoryAdmin(admin.ModelAdmin):
    list_display = ('trip', 'category', 'planned')

@admin.register(BudgetItem)
class BudgetItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'amount', 'date')
