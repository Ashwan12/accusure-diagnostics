from rest_framework import serializers
from .models import DoctorProfile, Prescription

class DoctorProfileSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='user.get_full_name', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = DoctorProfile
        fields = ['id', 'user', 'name', 'username', 'email', 'specialization', 'qualification', 'registration_number', 'bio', 'is_available']

class PrescriptionSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='doctor.get_full_name', read_only=True)
    patient_name = serializers.CharField(source='patient.get_full_name', read_only=True)

    class Meta:
        model = Prescription
        fields = ['id', 'doctor', 'doctor_name', 'patient', 'patient_name', 'booking', 'diagnosis', 'medicines', 'notes', 'follow_up_date', 'created_at']
        read_only_fields = ['id', 'created_at']

