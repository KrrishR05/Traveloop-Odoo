from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BudgetCategoryViewSet, BudgetItemViewSet

router = DefaultRouter()
router.register('categories', BudgetCategoryViewSet, basename='budget-category')
router.register('items', BudgetItemViewSet, basename='budget-item')

urlpatterns = [
    path('', include(router.urls)),
]
