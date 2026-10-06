from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('patient', 'Patient'),
        ('doctor', 'Doctor'),
        ('staff', 'Staff / Phlebotomist'),
        ('admin', 'Admin'),
    )
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='patient')
    phone_number = models.CharField(max_length=15, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=(('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')), default='Male')
    address = models.TextField(blank=True)
    city = models.CharField(max_length=50, default='Jamshedpur')
    pincode = models.CharField(max_length=10, blank=True, default='831019')

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
