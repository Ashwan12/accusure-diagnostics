from rest_framework import serializers
from .models import MedicalReport
from bookings.serializers import BookingSerializer

class MedicalReportSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.get_full_name', read_only=True)
    patient_username = serializers.CharField(source='patient.username', read_only=True)
    booking_id_str = serializers.CharField(source='booking.booking_id', read_only=True)
    booking_details = BookingSerializer(source='booking', read_only=True)

    class Meta:
        model = MedicalReport
        fields = [
            'id', 'report_id', 'booking', 'booking_id_str', 'booking_details',
            'patient', 'patient_name', 'patient_username', 'doctor_name',
            'verification_code', 'status', 'overall_summary', 'parameters_data',
            'report_file', 'sample_collected_at', 'reported_at', 'created_at'
        ]
        read_only_fields = ['id', 'report_id', 'verification_code', 'reported_at', 'created_at']

