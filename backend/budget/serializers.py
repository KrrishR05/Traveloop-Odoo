from rest_framework import serializers
from .models import BudgetCategory, BudgetItem


class BudgetItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = BudgetItem
        fields = '__all__'


class BudgetCategorySerializer(serializers.ModelSerializer):
    items = BudgetItemSerializer(many=True, read_only=True)
    spent = serializers.ReadOnlyField()
    remaining = serializers.ReadOnlyField()
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = BudgetCategory
        fields = '__all__'
