from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import PackingItem
from .serializers import PackingItemSerializer


class PackingItemViewSet(viewsets.ModelViewSet):
    queryset = PackingItem.objects.all()
    serializer_class = PackingItemSerializer

    def get_queryset(self):
        qs = self.queryset
        trip_id = self.request.query_params.get('trip')
        category = self.request.query_params.get('category')
        if trip_id:
            qs = qs.filter(trip_id=trip_id)
        if category:
            qs = qs.filter(category=category)
        return qs

    @action(detail=True, methods=['patch'])
    def toggle(self, request, pk=None):
        """Toggle the packed status of an item."""
        item = self.get_object()
        item.is_packed = not item.is_packed
        item.save()
        return Response(PackingItemSerializer(item).data)

    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Packing progress summary for a trip."""
        trip_id = request.query_params.get('trip')
        if not trip_id:
            return Response({'error': 'trip query param required'}, status=400)

        items = PackingItem.objects.filter(trip_id=trip_id)
        total = items.count()
        packed = items.filter(is_packed=True).count()

        # Per-category counts
        categories = {}
        for item in items:
            cat = item.category
            if cat not in categories:
                categories[cat] = {'total': 0, 'packed': 0, 'label': item.get_category_display()}
            categories[cat]['total'] += 1
            if item.is_packed:
                categories[cat]['packed'] += 1

        return Response({
            'total': total,
            'packed': packed,
            'progress': round(packed / max(total, 1) * 100, 1),
            'categories': categories,
        })
