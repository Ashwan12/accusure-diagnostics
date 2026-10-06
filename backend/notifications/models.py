from django.db import models
from django.conf import settings

class Notification(models.Model):
    TYPE_CHOICES = (
        ('BOOKING_RECEIVED', 'Booking Received'),
        ('BOOKING_CONFIRMED', 'Booking Confirmed'),
        ('SAMPLE_COLLECTED', 'Sample Collected'),
        ('REPORT_READY', 'Medical Report Ready'),
        ('PAYMENT_CONFIRMATION', 'Payment Confirmed'),
        ('GENERAL', 'General Notification'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(max_length=30, choices=TYPE_CHOICES, default='GENERAL')
    link = models.CharField(max_length=255, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.title}"
