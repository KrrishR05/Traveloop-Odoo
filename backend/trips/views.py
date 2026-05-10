from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Count, Avg
from .models import Trip, ItineraryDay, ItineraryItem
from .serializers import TripSerializer, TripListSerializer, ItineraryDaySerializer, ItineraryItemSerializer


class TripViewSet(viewsets.ModelViewSet):
    """CRUD API for trips."""
    queryset = Trip.objects.all()

    def get_serializer_class(self):
        if self.action == 'list':
            return TripListSerializer
        return TripSerializer

    @action(detail=False, methods=['get'])
    def analytics(self, request):
        """Aggregate analytics for the analytics dashboard."""
        trips = Trip.objects.all()
        total_trips = trips.count()
        total_budget = trips.aggregate(s=Sum('budget'))['s'] or 0
        avg_budget = trips.aggregate(a=Avg('budget'))['a'] or 0
        total_days = sum(t.duration_days for t in trips)
        completed = trips.filter(status='completed').count()
        upcoming = trips.filter(status='upcoming').count()

        # Budget by trip type
        by_type = list(
            trips.values('trip_type')
            .annotate(total=Sum('budget'), count=Count('id'))
            .order_by('-total')
        )

        # Budget by destination
        by_dest = list(
            trips.values('destination')
            .annotate(total=Sum('budget'), count=Count('id'))
            .order_by('-total')[:8]
        )

        # Monthly spending (group by start_date month)
        monthly = list(
            trips.extra(select={'month': "strftime('%%Y-%%m', start_date)"})
            .values('month')
            .annotate(total=Sum('budget'), count=Count('id'))
            .order_by('month')
        )

        return Response({
            'total_trips': total_trips,
            'total_budget': float(total_budget),
            'avg_budget': round(float(avg_budget), 2),
            'total_days': total_days,
            'completed_trips': completed,
            'upcoming_trips': upcoming,
            'by_type': by_type,
            'by_destination': by_dest,
            'monthly': monthly,
        })


class ItineraryDayViewSet(viewsets.ModelViewSet):
    queryset = ItineraryDay.objects.all()
    serializer_class = ItineraryDaySerializer

    def get_queryset(self):
        trip_id = self.request.query_params.get('trip')
        if trip_id:
            return self.queryset.filter(trip_id=trip_id)
        return self.queryset


class ItineraryItemViewSet(viewsets.ModelViewSet):
    queryset = ItineraryItem.objects.all()
    serializer_class = ItineraryItemSerializer
