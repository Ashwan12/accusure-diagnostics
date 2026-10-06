from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DoctorProfileViewSet, PrescriptionViewSet

router = DefaultRouter()
router.register('profiles', DoctorProfileViewSet, basename='doctor_profiles')
router.register('prescriptions', PrescriptionViewSet, basename='prescriptions')

urlpatterns = [
    path('', include(router.urls)),
]

