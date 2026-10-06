from rest_framework import viewsets, permissions
from .models import DoctorProfile, Prescription
from .serializers import DoctorProfileSerializer, PrescriptionSerializer

class DoctorProfileViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DoctorProfile.objects.all()
    serializer_class = DoctorProfileSerializer
    permission_classes = [permissions.AllowAny]

class PrescriptionViewSet(viewsets.ModelViewSet):
    serializer_class = PrescriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['admin', 'staff']:
            return Prescription.objects.all().order_by('-created_at')
        if user.role == 'doctor':
            return Prescription.objects.filter(doctor=user).order_by('-created_at')
        return Prescription.objects.filter(patient=user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(doctor=self.request.user)
