from django.db import models
from django.utils import timezone

class DashboardMetrics(models.Model):
    date = models.DateField(default=timezone.now)
    total_sales = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_expenses = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_customers = models.IntegerField(default=0)
    total_products = models.IntegerField(default=0)
    total_suppliers = models.IntegerField(default=0)
    profit = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    class Meta:
        ordering = ['-date']
        verbose_name = 'Dashboard Metrics'
        verbose_name_plural = 'Dashboard Metrics'

    def __str__(self):
        return f"Metrics for {self.date}" 