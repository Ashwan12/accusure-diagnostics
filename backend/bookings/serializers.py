from rest_framework import serializers
from .models import Booking, BookingItem
from lab_tests.models import LabTest
from lab_tests.serializers import LabTestSerializer

class BookingItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingItem
        fields = ['id', 'test', 'test_name', 'price']

class BookingSerializer(serializers.ModelSerializer):
    items = BookingItemSerializer(many=True, read_only=True)
    test_ids = serializers.ListField(child=serializers.IntegerField(), write_only=True, required=False)
    patient_username = serializers.CharField(source='patient.username', read_only=True)
    assigned_staff_name = serializers.CharField(source='assigned_staff.get_full_name', read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id', 'booking_id', 'patient', 'patient_username',
            'patient_name', 'patient_phone', 'patient_age', 'patient_gender',
            'collection_type', 'collection_address', 'landmark', 'pincode',
            'preferred_date', 'preferred_time_slot', 'status',
            'assigned_staff', 'assigned_staff_name', 'phlebotomist_notes',
            'total_amount', 'notes', 'created_at', 'updated_at',
            'items', 'test_ids'
        ]
        read_only_fields = ['id', 'booking_id', 'created_at', 'updated_at']

    def create(self, validated_data):
        test_ids = validated_data.pop('test_ids', [])
        booking = Booking.objects.create(**validated_data)
        
        total = 0
        for test_id in test_ids:
            try:
                test = LabTest.objects.get(id=test_id)
                price = test.final_price
                BookingItem.objects.create(
                    booking=booking,
                    test=test,
                    test_name=test.name,
                    price=price
                )
                total += price
            except LabTest.DoesNotExist:
                pass
        
        booking.total_amount = total
        booking.save()

        # Automatically create pending invoice
        from billing.models import Invoice
        Invoice.objects.create(
            booking=booking,
            patient=booking.patient,
            subtotal=total,
            discount=0,
            home_collection_fee=0,
            total_amount=total,
            payment_status='PENDING',
            payment_method='UNPAID'
        )

        # Create booking notification
        from notifications.models import Notification
        Notification.objects.create(
            user=booking.patient,
            title=f"Booking Confirmed: {booking.booking_id}",
            message=f"Your booking for {len(test_ids)} test(s) on {booking.preferred_date} has been placed successfully.",
            notification_type='BOOKING_RECEIVED',
            link=f"/dashboard/appointments"
        )

        return booking

