from django.db import models
from django.utils import timezone
from django.core.validators import RegexValidator

class Customer(models.Model):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other')
    ]
    
    first_name = models.CharField(max_length=100, blank=True, default='')
    last_name = models.CharField(max_length=100, blank=True, default='')
    email = models.EmailField(blank=True, default='')
    phone = models.CharField(
        max_length=15,
        unique=True,
        validators=[
            RegexValidator(
                regex=r'^\+?1?\d{9,15}$',
                message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
            )
        ]
    )
    address = models.TextField(blank=True, default='')
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, blank=True, default='')
    date_of_birth = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        name = f"{self.first_name} {self.last_name}" if self.first_name and self.last_name else "Unknown"
        return f"{name} ({self.phone})"

    class Meta:
        ordering = ['-created_at'] 