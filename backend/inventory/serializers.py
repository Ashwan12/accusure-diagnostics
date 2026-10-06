from rest_framework import serializers
from .models import InventoryItem

class InventoryItemSerializer(serializers.ModelSerializer):
    is_low_stock = serializers.BooleanField(read_only=True)

    class Meta:
        model = InventoryItem
        fields = [
            'id', 'name', 'category', 'sku', 'quantity', 'unit',
            'reorder_level', 'cost_per_unit', 'supplier', 'is_low_stock',
            'last_restocked'
        ]

