from django.db import models
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator
from decimal import Decimal
from apps.inventory.models import Product, Category, OnlineCategory
import os


class Discount(models.Model):
    """
    Discount model for managing discount campaigns
    """
    DISCOUNT_TYPE_CHOICES = [
        ('APP_WIDE', 'App-Wide Discount'),
        ('CATEGORY', 'Category Discount'),
        ('PRODUCT', 'Product Discount'),
    ]
    
    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('EXPIRED', 'Expired'),
        ('SCHEDULED', 'Scheduled'),
    ]
    
    name = models.CharField(max_length=200)
    discount_type = models.CharField(max_length=20, choices=DISCOUNT_TYPE_CHOICES, default='APP_WIDE')
    value = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01')), MaxValueValidator(Decimal('100.00'))],
        help_text="Discount percentage (0.01 to 100)"
    )
    description = models.TextField(blank=True, null=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    
    # Specific target for category or product discounts
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='discounts',
        null=True,
        blank=True,
        help_text="Required for CATEGORY discount type"
    )
    
    online_category = models.ForeignKey(
        OnlineCategory,
        on_delete=models.CASCADE,
        related_name='discounts',
        null=True,
        blank=True,
        help_text="Online category for ecommerce discounts"
    )
    
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='discounts',
        null=True,
        blank=True,
        help_text="Required for PRODUCT discount type"
    )
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Discount'
        verbose_name_plural = 'Discounts'
    
    def __str__(self):
        return f"{self.name} - {self.get_discount_type_display()} ({self.value}%)"
    
    def save(self, *args, **kwargs):
        # Update status based on dates
        now = timezone.now()
        if self.start_date > now:
            self.status = 'SCHEDULED'
        elif self.end_date < now:
            self.status = 'EXPIRED'
        elif self.start_date <= now <= self.end_date:
            self.status = 'ACTIVE'
        
        super().save(*args, **kwargs)
    
    def is_currently_active(self):
        """Check if discount is currently active based on dates"""
        now = timezone.now()
        return self.is_active and self.start_date <= now <= self.end_date
    
    def clean(self):
        """Validate discount configuration"""
        from django.core.exceptions import ValidationError
        
        # Validate discount type and related fields
        if self.discount_type == 'CATEGORY' and not self.category and not self.online_category:
            raise ValidationError("Category discount must have a category or online category assigned")
        
        if self.discount_type == 'PRODUCT' and not self.product:
            raise ValidationError("Product discount must have a product assigned")
        
        # Validate dates
        if self.start_date >= self.end_date:
            raise ValidationError("End date must be after start date")


class Brand(models.Model):
    """Brand model for showcasing brands on home page"""
    name = models.CharField(max_length=200, unique=True)
    logo_image = models.ImageField(upload_to='brands/', null=True, blank=True)
    logo_text = models.CharField(max_length=100, null=True, blank=True, help_text="Text logo if no image")
    website_url = models.URLField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['display_order', 'name']
        verbose_name = 'Brand'
        verbose_name_plural = 'Brands'
    
    def __str__(self):
        return self.name


class HomePageSettings(models.Model):
    """Singleton model for home page settings"""
    # Logo Settings
    logo_image = models.ImageField(upload_to='site_logo/', null=True, blank=True)
    logo_text = models.CharField(max_length=100, null=True, blank=True)
    
    # Hero Section Settings
    hero_badge_text = models.CharField(max_length=100, default="New Collection 2024")
    hero_heading_line1 = models.CharField(max_length=100, default="FIND")
    hero_heading_line2 = models.CharField(max_length=100, default="CLOTHES", null=True, blank=True)
    hero_heading_line3 = models.CharField(max_length=100, default="THAT", null=True, blank=True)
    hero_heading_line4 = models.CharField(max_length=100, default="Matches", null=True, blank=True)
    hero_heading_line5 = models.CharField(max_length=100, default="YOUR STYLE", null=True, blank=True)
    
    hero_description = models.TextField(
        default="Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.",
        null=True,
        blank=True
    )
    
    hero_primary_image = models.ImageField(upload_to='hero/', null=True, blank=True)
    hero_secondary_image = models.ImageField(upload_to='hero/', null=True, blank=True)
    
    # Stats Settings
    stat_brands = models.CharField(max_length=50, default="200+")
    stat_products = models.CharField(max_length=50, default="2,000+")
    stat_customers = models.CharField(max_length=50, default="30,000+")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Home Page Settings'
        verbose_name_plural = 'Home Page Settings'
    
    def __str__(self):
        return "Home Page Settings"
    
    def save(self, *args, **kwargs):
        # Ensure only one instance exists
        self.pk = 1
        super().save(*args, **kwargs)
    
    @classmethod
    def load(cls):
        """Get or create the singleton instance"""
        obj, created = cls.objects.get_or_create(pk=1)
        return obj
    
    def delete(self, *args, **kwargs):
        # Prevent deletion of the singleton
        pass

