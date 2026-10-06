from django.utils import timezone
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Invoice
from .serializers import InvoiceSerializer
from notifications.models import Notification

class InvoiceViewSet(viewsets.ModelViewSet):
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['admin', 'staff', 'doctor']:
            return Invoice.objects.all().order_by('-created_at')
        return Invoice.objects.filter(patient=user).order_by('-created_at')

    @action(detail=True, methods=['post'])
    def mark_paid(self, request, pk=None):
        invoice = self.get_object()
        method = request.data.get('payment_method', 'UPI')
        transaction_id = request.data.get('transaction_id', '')

        invoice.payment_status = 'PAID'
        invoice.payment_method = method
        invoice.transaction_id = transaction_id
        invoice.paid_at = timezone.now()
        invoice.save()

        Notification.objects.create(
            user=invoice.patient,
            title=f"Payment Received: ₹{invoice.total_amount}",
            message=f"Thank you! Payment for invoice {invoice.invoice_number} has been recorded via {method}.",
            notification_type='PAYMENT_CONFIRMATION',
            link="/dashboard/billing"
        )

        return Response(InvoiceSerializer(invoice).data)
