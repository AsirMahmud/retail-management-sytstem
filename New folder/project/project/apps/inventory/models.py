from django.db import models
from django.core.validators import MinValueValidator
from django.utils.text import slugify
import uuid
from django.utils import timezone
from decimal import Decimal
from django.conf import settings
from apps.supplier.models import Supplier  # Import Supplier from supplier app
from django.db.models import Sum

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    description = models.TextField(blank=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Product(models.Model):
    GENDER_CHOICES = [
        ('MALE', 'Male'),
        ('FEMALE', 'Female'),
        ('UNISEX', 'Unisex'),
    ]

    name = models.CharField(max_length=200)
    sku = models.CharField(max_length=50, unique=True, blank=True)
    barcode = models.CharField(max_length=50, unique=True, blank=True, null=True)
    description = models.TextField(blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    cost_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
    selling_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
    stock_quantity = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    minimum_stock = models.IntegerField(default=10)
    image = models.ImageField(upload_to='products/', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    size_type = models.CharField(max_length=50, null=True, blank=True)
    size_category=models.CharField(max_length=50, null=True, blank=True)
    gender = models.CharField(max_length=6, choices=GENDER_CHOICES, default='UNISEX')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.sku and self.category:
            # Generate SKU by combining category name, timestamp, and a random component
            category_prefix = self.category.name[:3].upper()  # First 3 letters of category name
            timestamp = timezone.now().strftime('%y%m%d')  # YYMMDD format
            random_component = str(uuid.uuid4())[:4]  # First 4 characters of UUID
            self.sku = f"{category_prefix}-{timestamp}-{random_component}"
        
        # Calculate total stock from variants
        if self.id:  # Only calculate if the product already exists
            total_variant_stock = self.variations.aggregate(
                total=Sum('stock')
            )['total'] or 0
            self.stock_quantity = total_variant_stock
        
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.sku})"

class ProductVariation(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variations')
    size = models.CharField(max_length=50, default='Standard')
    color = models.CharField(max_length=50, default='Default')
    color_hax = models.CharField(max_length=50, default='#FFFFFF')
    stock = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('product', 'size', 'color')

    def __str__(self):
        return f"{self.product.name} - {self.size} - {self.color}"

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    variation = models.ForeignKey(ProductVariation, on_delete=models.CASCADE, null=True, blank=True, related_name='images')
    image = models.ImageField(upload_to='products/')
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.product.name}"

class StockMovement(models.Model):
    MOVEMENT_TYPES = [
        ('IN', 'Stock In'),
        ('OUT', 'Stock Out'),
        ('GIFT', 'Gift Transaction'),
        ('ADJ', 'Adjustment'),
    ]

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='stock_movements')
    variation = models.ForeignKey(ProductVariation, on_delete=models.CASCADE, null=True, blank=True, related_name='stock_movements')
    movement_type = models.CharField(max_length=4, choices=MOVEMENT_TYPES)
    quantity = models.IntegerField()
    reference_number = models.CharField(max_length=50, blank=True)  # For linking to purchase orders, sales, etc.
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
  

    def __str__(self):
        return f"{self.get_movement_type_display()} - {self.product.name} ({self.quantity})"

class InventoryAlert(models.Model):
    ALERT_TYPES = [
        ('LOW', 'Low Stock'),
        ('OUT', 'Out of Stock'),
        ('EXP', 'Expiring Soon'),
    ]

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='alerts')
    variation = models.ForeignKey(ProductVariation, on_delete=models.CASCADE, null=True, blank=True, related_name='alerts')
    alert_type = models.CharField(max_length=3, choices=ALERT_TYPES)
    message = models.TextField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.get_alert_type_display()} - {self.product.name}"

    def resolve(self):
        self.is_active = False
        self.resolved_at = timezone.now()
        self.save()