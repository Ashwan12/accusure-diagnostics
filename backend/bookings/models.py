import uuid
from django.db import models
from django.conf import settings
from lab_tests.models import LabTest

class Booking(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('CONFIRMED', 'Confirmed'),
        ('SAMPLE_COLLECTED', 'Sample Collected'),
        ('TESTING', 'Testing / In Lab'),
        ('REPORT_READY', 'Report Ready'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    )

    COLLECTION_CHOICES = (
        ('HOME_COLLECTION', 'Free Home Sample Collection'),
        ('CENTER_VISIT', 'Diagnostic Center / Shop Visit'),
    )

    booking_id = models.CharField(max_length=32, unique=True, editable=False)
    patient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='bookings')
    patient_name = models.CharField(max_length=150)
    patient_phone = models.CharField(max_length=20)
    patient_age = models.IntegerField(default=30)
    patient_gender = models.CharField(max_length=10, default='Male')
    collection_type = models.CharField(max_length=20, choices=COLLECTION_CHOICES, default='HOME_COLLECTION')
    collection_address = models.TextField(blank=True)
    landmark = models.CharField(max_length=150, blank=True)
    pincode = models.CharField(max_length=10, default='831019')
    preferred_date = models.DateField()
    preferred_time_slot = models.CharField(max_length=50, default='07:00 AM - 09:00 AM')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    assigned_staff = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='assigned_collections'
    )
    phlebotomist_notes = models.TextField(blank=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.booking_id:
            from django.utils import timezone
            date_prefix = timezone.now().strftime('%Y%m%d')
            unique_part = uuid.uuid4().hex[:6].upper()
            self.booking_id = f"ACC-{date_prefix}-{unique_part}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.booking_id} - {self.patient_name} ({self.status})"

class BookingItem(models.Model):
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='items')
    test = models.ForeignKey(LabTest, on_delete=models.SET_NULL, null=True)
    test_name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.test_name} - ₹{self.price}"
