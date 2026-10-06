from rest_framework import serializers
from .models import Invoice
from bookings.serializers import BookingSerializer

class InvoiceSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.get_full_name', read_only=True)
    patient_username = serializers.CharField(source='patient.username', read_only=True)
    booking_id_str = serializers.CharField(source='booking.booking_id', read_only=True)
    booking_items = serializers.SerializerMethodField()

    class Meta:
        model = Invoice
        fields = [
            'id', 'invoice_number', 'booking', 'booking_id_str', 'booking_items',
            'patient', 'patient_name', 'patient_username', 'subtotal', 'discount',
            'home_collection_fee', 'total_amount', 'payment_status',
            'payment_method', 'transaction_id', 'notes', 'paid_at', 'created_at'
        ]
        read_only_fields = ['id', 'invoice_number', 'created_at']

    def get_booking_items(self, obj):
        return [
            {'name': item.test_name, 'price': str(item.price)}
            for item in obj.booking.items.all()
        ]

