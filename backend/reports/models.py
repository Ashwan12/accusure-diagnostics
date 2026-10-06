import uuid
from django.db import models
from django.conf import settings
from bookings.models import Booking

class MedicalReport(models.Model):
    STATUS_CHOICES = (
        ('DRAFT', 'Draft'),
        ('PUBLISHED', 'Published & Verified'),
    )

    report_id = models.CharField(max_length=32, unique=True, editable=False)
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='reports')
    patient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='medical_reports')
    doctor_name = models.CharField(max_length=150, default='Dr. R. K. Mukherjee (MD, Pathologist)')
    verification_code = models.CharField(max_length=64, unique=True, editable=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PUBLISHED')
    overall_summary = models.TextField(blank=True, default='All parameters analyzed using automated chemiluminescence and calibrated analyzers.')
    parameters_data = models.JSONField(default=list, blank=True)
    report_file = models.FileField(upload_to='reports/', null=True, blank=True)
    sample_collected_at = models.DateTimeField(null=True, blank=True)
    reported_at = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.report_id:
            from django.utils import timezone
            date_prefix = timezone.now().strftime('%Y%m')
            self.report_id = f"RPT-{date_prefix}-{uuid.uuid4().hex[:6].upper()}"
        if not self.verification_code:
            self.verification_code = f"ACCUSURE-VER-{uuid.uuid4().hex[:12].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.report_id} - {self.patient.username} ({self.status})"
