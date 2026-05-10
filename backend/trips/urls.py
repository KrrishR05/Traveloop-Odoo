from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TripViewSet, ItineraryDayViewSet, ItineraryItemViewSet

router = DefaultRouter()
router.register('', TripViewSet, basename='trip')
router.register('itinerary-days', ItineraryDayViewSet, basename='itinerary-day')
router.register('itinerary-items', ItineraryItemViewSet, basename='itinerary-item')

urlpatterns = [
    path('', include(router.urls)),
]
