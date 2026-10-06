from rest_framework import viewsets, permissions, filters
from .models import TestCategory, LabTest
from .serializers import TestCategorySerializer, LabTestSerializer

class TestCategoryViewSet(viewsets.ModelViewSet):
    queryset = TestCategory.objects.all()
    serializer_class = TestCategorySerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

class LabTestViewSet(viewsets.ModelViewSet):
    queryset = LabTest.objects.all().order_by('-is_popular', 'name')
    serializer_class = LabTestSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'code', 'category__name', 'description', 'parameters_included']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get('category')
        popular = self.request.query_params.get('popular')
        if category:
            queryset = queryset.filter(category__slug=category)
        if popular == 'true':
            queryset = queryset.filter(is_popular=True)
        return queryset
