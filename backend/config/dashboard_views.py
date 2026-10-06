from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models import Sum, Count, F
from accounts.models import User
from bookings.models import Booking
from reports.models import MedicalReport
from billing.models import Invoice
from inventory.models import InventoryItem

class AdminDashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role not in ['admin', 'staff', 'doctor']:
            return Response({'error': 'Unauthorized'}, status=403)

        total_patients = User.objects.filter(role='patient').count()
        total_bookings = Booking.objects.count()
        pending_collections = Booking.objects.filter(collection_type='HOME_COLLECTION', status__in=['PENDING', 'CONFIRMED']).count()
        pending_reports = Booking.objects.filter(status__in=['SAMPLE_COLLECTED', 'TESTING']).count()
        completed_bookings = Booking.objects.filter(status='COMPLETED').count()

        total_revenue = Invoice.objects.filter(payment_status='PAID').aggregate(total=Sum('total_amount'))['total'] or 0
        pending_revenue = Invoice.objects.filter(payment_status='PENDING').aggregate(total=Sum('total_amount'))['total'] or 0

        low_stock_items = InventoryItem.objects.filter(quantity__lte=F('reorder_level')).count()

        # Status distribution
        status_counts = list(Booking.objects.values('status').annotate(count=Count('id')))

        # Recent bookings
        recent_bookings = []
        for b in Booking.objects.order_by('-created_at')[:8]:
            recent_bookings.append({
                'id': b.id,
                'booking_id': b.booking_id,
                'patient_name': b.patient_name,
                'phone': b.patient_phone,
                'collection_type': b.collection_type,
                'preferred_date': str(b.preferred_date),
                'status': b.status,
                'total_amount': str(b.total_amount),
                'created_at': b.created_at.strftime('%d %b, %H:%M')
            })

        return Response({
            'total_patients': total_patients,
            'total_bookings': total_bookings,
            'pending_collections': pending_collections,
            'pending_reports': pending_reports,
            'completed_bookings': completed_bookings,
            'total_revenue': float(total_revenue),
            'pending_revenue': float(pending_revenue),
            'low_stock_items': low_stock_items,
            'status_counts': status_counts,
            'recent_bookings': recent_bookings
        })

