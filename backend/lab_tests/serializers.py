from rest_framework import serializers
from .models import TestCategory, LabTest

class TestCategorySerializer(serializers.ModelSerializer):
    tests_count = serializers.IntegerField(source='tests.count', read_only=True)

    class Meta:
        model = TestCategory
        fields = ['id', 'name', 'slug', 'description', 'icon', 'tests_count']

class LabTestSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    final_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    image = serializers.CharField(source='image_url', read_only=True)

    class Meta:
        model = LabTest
        fields = ['id', 'name', 'code', 'category', 'category_name', 'category_slug',
                  'price', 'discount_price', 'final_price', 'sample_type',
                  'fasting_required', 'fasting_hours', 'turnaround_hours',
                  'parameters_included', 'preparation_instructions',
                  'description', 'is_popular', 'is_active', 'image_url', 'image', 'created_at']

