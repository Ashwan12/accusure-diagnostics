from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TestCategoryViewSet, LabTestViewSet

router = DefaultRouter()
router.register('categories', TestCategoryViewSet, basename='categories')
router.register('', LabTestViewSet, basename='tests')

urlpatterns = [
    path('', include(router.urls)),
]

