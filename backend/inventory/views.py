from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import InventoryItem
from .serializers import InventoryItemSerializer

class InventoryViewSet(viewsets.ModelViewSet):
    queryset = InventoryItem.objects.all().order_by('name')
    serializer_class = InventoryItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get('category')
        low_stock = self.request.query_params.get('low_stock')
        if category:
            queryset = queryset.filter(category=category)
        if low_stock == 'true':
            # item.quantity <= item.reorder_level
            from django.db.models import F
            queryset = queryset.filter(quantity__lte=F('reorder_level'))
        return queryset

    @action(detail=True, methods=['post'])
    def adjust_stock(self, request, pk=None):
        item = self.get_object()
        delta = int(request.data.get('delta', 0))
        new_quantity = item.quantity + delta
        if new_quantity < 0:
            return Response({'error': 'Stock quantity cannot be negative.'}, status=status.HTTP_400_BAD_REQUEST)
        item.quantity = new_quantity
        item.save()
        return Response(InventoryItemSerializer(item).data)
