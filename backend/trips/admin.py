from django.contrib import admin
from .models import Trip, ItineraryDay, ItineraryItem

@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = ('title', 'destination', 'start_date', 'end_date', 'status', 'budget')
    list_filter = ('status', 'trip_type')

@admin.register(ItineraryDay)
class ItineraryDayAdmin(admin.ModelAdmin):
    list_display = ('trip', 'day', 'title')

@admin.register(ItineraryItem)
class ItineraryItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'itinerary_day', 'time', 'cost')
