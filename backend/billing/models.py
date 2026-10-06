import uuid
from django.db import models
from django.conf import settings
from bookings.models import Booking

class Invoice(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('PAID', 'Paid'),
        ('CANCELLED', 'Cancelled'),
        ('REFUNDED', 'Refunded'),
    )

    METHOD_CHOICES = (
        ('UPI', 'UPI / QR Code'),
        ('CASH', 'Cash at Collection / Counter'),
        ('CARD', 'Credit / Debit Card'),
        ('ONLINE', 'Online Payment Gateway'),
        ('UNPAID', 'Not Paid Yet'),
    )

    invoice_number = models.CharField(max_length=32, unique=True, editable=False)
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='invoice')
    patient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='invoices')
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    home_collection_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    payment_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    payment_method = models.CharField(max_length=20, choices=METHOD_CHOICES, default='UNPAID')
    transaction_id = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.invoice_number:
            from django.utils import timezone
            date_prefix = timezone.now().strftime('%Y%m')
            self.invoice_number = f"INV-{date_prefix}-{uuid.uuid4().hex[:6].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.invoice_number} - ₹{self.total_amount} ({self.payment_status})"
