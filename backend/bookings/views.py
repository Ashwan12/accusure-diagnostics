from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Booking, BookingItem
from .serializers import BookingSerializer
from accounts.models import User

class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Booking.objects.none()
        if user.role in ['admin', 'staff', 'doctor']:
            queryset = Booking.objects.all().order_by('-created_at')
        else:
            queryset = Booking.objects.filter(patient=user).order_by('-created_at')

        status_param = self.request.query_params.get('status')
        collection_type = self.request.query_params.get('collection_type')
        if status_param:
            queryset = queryset.filter(status=status_param)
        if collection_type:
            queryset = queryset.filter(collection_type=collection_type)
        return queryset

    def perform_create(self, serializer):
        patient_user = None
        if self.request.user.is_authenticated:
            patient_user = self.request.user
        else:
            patient_phone = serializer.validated_data.get('patient_phone', '')
            patient_name = serializer.validated_data.get('patient_name', 'Patient')
            if patient_phone:
                username = f"patient_{patient_phone}"
                patient_user, _ = User.objects.get_or_create(
                    username=username,
                    defaults={
                        'first_name': patient_name.split()[0] if patient_name else 'Patient',
                        'last_name': ' '.join(patient_name.split()[1:]) if ' ' in patient_name else 'Guest',
                        'phone_number': patient_phone,
                        'role': 'patient',
                        'address': serializer.validated_data.get('collection_address', ''),
                    }
                )

        booking = serializer.save(patient=patient_user)

        # Send booking alert email to ashwanarya20042004@gmail.com
        try:
            from django.core.mail import send_mail
            from django.conf import settings
            target_email = getattr(settings, 'ADMIN_NOTIFICATION_EMAIL', 'ashwanarya20042004@gmail.com')
            subject = f"🚨 New Test Booking [{booking.booking_id}] - {booking.patient_name}"
            msg = (
                f"NEW TEST BOOKING RECEIVED AT ACCUSURE DIAGNOSTICS\n"
                f"================================================\n\n"
                f"Booking ID: {booking.booking_id}\n"
                f"Patient Name: {booking.patient_name}\n"
                f"Contact Phone: {booking.patient_phone}\n"
                f"Age & Gender: {booking.patient_age} Yrs / {booking.patient_gender}\n"
                f"Collection Mode: {booking.get_collection_type_display()}\n"
                f"Address: {booking.collection_address}\n"
                f"Landmark: {booking.landmark or 'N/A'}\n"
                f"Preferred Date: {booking.preferred_date}\n"
                f"Preferred Time Slot: {booking.preferred_time_slot}\n"
                f"Total Amount: Rs. {booking.total_amount}\n"
                f"Patient Notes: {booking.notes or 'None'}\n\n"
                f"Please follow up with the patient and dispatch phlebotomist.\n"
                f"Helpline: 7205573352\n"
            )
            send_mail(
                subject,
                msg,
                getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@accusure.com'),
                [target_email],
                fail_silently=True
            )
        except Exception as mail_err:
            print("Django email sending exception:", mail_err)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def update_status(self, request, pk=None):
        booking = self.get_object()
        new_status = request.data.get('status')
        valid_statuses = dict(Booking.STATUS_CHOICES).keys()

        if new_status not in valid_statuses:
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

        booking.status = new_status
        if 'phlebotomist_notes' in request.data:
            booking.phlebotomist_notes = request.data['phlebotomist_notes']
        booking.save()

        # Send notification to patient
        from notifications.models import Notification
        status_labels = dict(Booking.STATUS_CHOICES)
        Notification.objects.create(
            user=booking.patient,
            title=f"Booking Status Updated: {status_labels.get(new_status)}",
            message=f"Your booking {booking.booking_id} status has changed to {status_labels.get(new_status)}.",
            notification_type='GENERAL',
            link="/dashboard/appointments"
        )

        return Response(BookingSerializer(booking).data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def assign_staff(self, request, pk=None):
        booking = self.get_object()
        staff_id = request.data.get('staff_id')
        try:
            staff_user = User.objects.get(id=staff_id)
            booking.assigned_staff = staff_user
            booking.save()
            return Response({'message': f'Assigned to {staff_user.get_full_name() or staff_user.username}'})
        except User.DoesNotExist:
            return Response({'error': 'Staff user not found'}, status=status.HTTP_404_NOT_FOUND)
