from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Booking, BookingItem
from .serializers import BookingSerializer
from accounts.models import User

class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
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
        serializer.save(patient=self.request.user)

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
