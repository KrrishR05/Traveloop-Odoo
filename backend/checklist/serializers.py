from rest_framework import serializers
from .models import PackingItem


class PackingItemSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = PackingItem
        fields = '__all__'
