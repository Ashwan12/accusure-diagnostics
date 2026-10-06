from rest_framework import viewsets, permissions
from .models import PatientProfile
from .serializers import PatientProfileSerializer

class PatientProfileViewSet(viewsets.ModelViewSet):
    serializer_class = PatientProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['admin', 'staff', 'doctor']:
            return PatientProfile.objects.all()
        return PatientProfile.objects.filter(user=user)
