from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum
from .models import BudgetCategory, BudgetItem
from .serializers import BudgetCategorySerializer, BudgetItemSerializer


class BudgetCategoryViewSet(viewsets.ModelViewSet):
    queryset = BudgetCategory.objects.all()
    serializer_class = BudgetCategorySerializer

    def get_queryset(self):
        trip_id = self.request.query_params.get('trip')
        if trip_id:
            return self.queryset.filter(trip_id=trip_id)
        return self.queryset

    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Budget summary for a specific trip."""
        trip_id = request.query_params.get('trip')
        if not trip_id:
            return Response({'error': 'trip query param required'}, status=400)

        categories = BudgetCategory.objects.filter(trip_id=trip_id)
        total_planned = categories.aggregate(s=Sum('planned'))['s'] or 0

        items = BudgetItem.objects.filter(category__trip_id=trip_id)
        total_spent = items.aggregate(s=Sum('amount'))['s'] or 0

        # Daily spending breakdown
        daily = list(
            items.values('date')
            .annotate(total=Sum('amount'))
            .order_by('date')
        )

        # Per-category breakdown
        breakdown = []
        for cat in categories:
            breakdown.append({
                'id': cat.id,
                'category': cat.category,
                'label': cat.get_category_display(),
                'planned': float(cat.planned),
                'spent': float(cat.spent),
                'remaining': float(cat.remaining),
                'color': cat.color,
            })

        from trips.models import Trip
        try:
            trip = Trip.objects.get(id=trip_id)
            trip_days = trip.duration_days
        except Trip.DoesNotExist:
            trip_days = 1

        return Response({
            'total_planned': float(total_planned),
            'total_spent': float(total_spent),
            'remaining': float(total_planned) - float(total_spent),
            'daily_average': round(float(total_spent) / max(trip_days, 1), 2),
            'is_over_budget': float(total_spent) > float(total_planned),
            'over_amount': max(0, float(total_spent) - float(total_planned)),
            'breakdown': breakdown,
            'daily_spending': daily,
            'trip_days': trip_days,
        })


class BudgetItemViewSet(viewsets.ModelViewSet):
    queryset = BudgetItem.objects.all()
    serializer_class = BudgetItemSerializer

    def get_queryset(self):
        category_id = self.request.query_params.get('category')
        trip_id = self.request.query_params.get('trip')
        qs = self.queryset
        if category_id:
            qs = qs.filter(category_id=category_id)
        if trip_id:
            qs = qs.filter(category__trip_id=trip_id)
        return qs
