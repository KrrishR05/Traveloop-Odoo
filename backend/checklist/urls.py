from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PackingItemViewSet

router = DefaultRouter()
router.register('', PackingItemViewSet, basename='packing-item')

urlpatterns = [
    path('', include(router.urls)),
]
