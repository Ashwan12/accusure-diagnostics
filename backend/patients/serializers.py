from rest_framework import serializers
from .models import PatientProfile
from accounts.serializers import UserSerializer

class PatientProfileSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)

    class Meta:
        model = PatientProfile
        fields = ['id', 'user', 'user_details', 'blood_group', 'emergency_contact_name', 'emergency_contact_phone', 'allergies', 'chronic_conditions']

