from django.db import models
from django.utils import timezone
from apps.sales.models import Sale
from apps.expenses.models import Expense
from apps.inventory.models import Product, Category
from apps.customer.models import Customer

class Report(models.Model):
    REPORT_TYPES = [
        ('sales', 'Sales Report'),
        ('expenses', 'Expenses Report'),
        ('inventory', 'Inventory Report'),
        ('customers', 'Customers Report'),
        ('categories', 'Categories Report'),
        ('profit_loss', 'Profit & Loss Report'),
        ('product_performance', 'Product Performance Report'),
    ]

    name = models.CharField(max_length=100)
    report_type = models.CharField(max_length=50, choices=REPORT_TYPES)
    date_from = models.DateField()
    date_to = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_saved = models.BooleanField(default=False)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['report_type']),
            models.Index(fields=['date_from', 'date_to']),
        ]

    def __str__(self):
        return f"{self.get_report_type_display()} - {self.date_from} to {self.date_to}"

class ReportMetric(models.Model):
    report = models.ForeignKey(Report, on_delete=models.CASCADE, related_name='metrics')
    metric_name = models.CharField(max_length=100)
    metric_value = models.DecimalField(max_digits=15, decimal_places=2)
    metric_type = models.CharField(max_length=50)  # e.g., 'currency', 'number', 'percentage'
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['metric_name']
        indexes = [
            models.Index(fields=['metric_name']),
            models.Index(fields=['metric_type']),
        ]

    def __str__(self):
        return f"{self.metric_name}: {self.metric_value}"

class ReportDataPoint(models.Model):
    report = models.ForeignKey(Report, on_delete=models.CASCADE, related_name='data_points')
    date = models.DateField()
    value = models.DecimalField(max_digits=15, decimal_places=2)
    label = models.CharField(max_length=100)
    category = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['date']
        indexes = [
            models.Index(fields=['date']),
            models.Index(fields=['category']),
        ]

    def __str__(self):
        return f"{self.label} - {self.date}: {self.value}"

class SavedReport(models.Model):
    report = models.ForeignKey(Report, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_favorite = models.BooleanField(default=False)

    class Meta:
        ordering = ['-updated_at']
        indexes = [
            models.Index(fields=['is_favorite']),
        ]

    def __str__(self):
        return self.name 