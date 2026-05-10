from rest_framework import serializers
from .models import Trip, ItineraryDay, ItineraryItem


class ItineraryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItineraryItem
        fields = '__all__'


class ItineraryDaySerializer(serializers.ModelSerializer):
    items = ItineraryItemSerializer(many=True, read_only=True)

    class Meta:
        model = ItineraryDay
        fields = '__all__'


class TripSerializer(serializers.ModelSerializer):
    itinerary_days = ItineraryDaySerializer(many=True, read_only=True)
    duration_days = serializers.ReadOnlyField()

    class Meta:
        model = Trip
        fields = '__all__'


class TripListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views."""
    duration_days = serializers.ReadOnlyField()

    class Meta:
        model = Trip
        fields = [
            'id', 'title', 'destination', 'start_date', 'end_date',
            'trip_type', 'budget', 'cover_image', 'status', 'rating',
            'duration_days', 'created_at',
        ]
