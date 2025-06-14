from django.db import models
from django.utils import timezone

class Supplier(models.Model):
    company_name = models.CharField(max_length=200, blank=True, null=True)
    contact_person = models.CharField(max_length=100)
    email = models.EmailField(unique=True, blank=True, null=True)
    phone = models.CharField(max_length=15)
    address = models.TextField(blank=True, null=True)
    tax_number = models.CharField(max_length=50, blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    payment_terms = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.contact_person if not self.company_name else self.company_name

    class Meta:
        ordering = ['-created_at'] 