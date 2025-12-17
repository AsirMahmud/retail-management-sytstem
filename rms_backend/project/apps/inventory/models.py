from random import choices
from django.db import models
from django.core.validators import MinValueValidator
from django.utils.text import slugify
import uuid
import os
from django.utils import timezone
from decimal import Decimal
from django.conf import settings
from apps.supplier.models import Supplier  # Import Supplier from supplier app
from django.db.models import Sum
from django.db.models.signals import post_delete
from django.dispatch import receiver
from apps.utils import optimize_image

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

class OnlineCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    description = models.TextField(blank=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    order = models.PositiveIntegerField(default=0, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'
        ordering = ['order', 'name']

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
    online_category = models.ForeignKey(OnlineCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    cost_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
    selling_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
    description = models.TextField(blank=True,null=True)
    stock_quantity = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    minimum_stock = models.IntegerField(default=10)
    image = models.ImageField(upload_to='products/', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    size_type = models.CharField(max_length=50, null=True, blank=True)
    size_category=models.CharField(max_length=50, null=True, blank=True)
    gender = models.CharField(max_length=6, choices=GENDER_CHOICES, default='UNISEX')
    assign_to_online = models.BooleanField(default=False, null=True)
    # Ecommerce status fields
    is_new_arrival = models.BooleanField(default=False)
    is_trending = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if self.image:
            optimize_image(self.image, max_width=1080, max_height=1080)
            
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
    
    def delete(self, *args, **kwargs):
        """Override delete to also delete the main product image and gallery folder from filesystem"""
        from django.conf import settings
        import shutil
        
        # Delete main product image
        if self.image:
            try:
                if os.path.isfile(self.image.path):
                    os.remove(self.image.path)
            except (ValueError, OSError):
                pass
        
        # Delete entire gallery folder for this product
        if self.id:
            gallery_folder = os.path.join(settings.MEDIA_ROOT, 'gallery', str(self.id))
            if os.path.exists(gallery_folder) and os.path.isdir(gallery_folder):
                try:
                    shutil.rmtree(gallery_folder)
                except OSError as e:
                    # Log error but don't stop deletion
                    print(f"Error deleting gallery folder {gallery_folder}: {e}")
        
        super().delete(*args, **kwargs)

class ProductVariation(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variations')
    size = models.CharField(max_length=50, default='Standard')
    color = models.CharField(max_length=50, default='Default')
    color_hax = models.CharField(max_length=50, default='#FFFFFF')
    waist_size=models.PositiveIntegerField(null=True,default=None)
    chest_size=models.PositiveIntegerField(null=True,default=None)
    height=models.PositiveIntegerField(null=True,default=None)
    stock = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    assign_to_online=models.BooleanField(default=False,null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('product', 'size', 'color')

    def __str__(self):
        return f"{self.product.name} - {self.size} - {self.color}"
class MeterialComposition(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='material_compositions')
    percentige=models.PositiveIntegerField()
    title = models.CharField(max_length=50,null=True,blank=True)

class WhoIsThisFor(models.Model):
      product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='who_is_this_for')
      title=models.TextField(blank=True,null=True)
      description=models.TextField(blank=True,null=True)
class Features(models.Model):
      product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='features')
      title=models.TextField(blank=True,null=True)
      description=models.TextField(blank=True,null=True)
      
      
class Gallery(models.Model):
    product = models.ForeignKey('Product', on_delete=models.CASCADE, related_name='galleries')
    color = models.CharField(max_length=50)
    color_hax=models.CharField(max_length=50,null=True,default='#ffff')  # must match ProductVariation.color
    alt_text = models.CharField(max_length=255, blank=True)

    class Meta:
        unique_together = ['product', 'color']

    def __str__(self):
        return f"{self.product.name} - {self.color}"

def gallery_upload_path(instance, filename):
    """Generate upload path: product_colors/{product_id}/{color_name}/{imageType}.{ext}"""
    return f'gallery/{instance.gallery.product.id}/{instance.gallery.color.lower()}/{instance.imageType.lower()}.{filename.split(".")[-1]}'

class Image(models.Model):
    IMAGE_TYPES = [
        ('PRIMARY', 'Primary'),
        ('SECONDARY', 'Secondary'),
        ('THIRD', 'Third'),
        ('FOURTH', 'Fourth'),
    ]
    gallery = models.ForeignKey(Gallery, on_delete=models.CASCADE, related_name='images')
    imageType = models.CharField(max_length=50, choices=IMAGE_TYPES)
    image = models.ImageField(upload_to=gallery_upload_path)
    alt_text = models.CharField(max_length=255, blank=True)

    class Meta:
        unique_together = ['gallery', 'imageType']

    def __str__(self):
        return f"{self.gallery.product.name} - {self.gallery.color} - {self.get_imageType_display()}"
    
    def save(self, *args, **kwargs):
        if self.image:
            optimize_image(self.image, max_width=1080, max_height=1080)
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        """Override delete to also delete the file from filesystem"""
        if self.image:
            # Delete the file from filesystem
            if os.path.isfile(self.image.path):
                os.remove(self.image.path)
        super().delete(*args, **kwargs)

# class ProductImage(models.Model):
#     product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
#     variation = models.ForeignKey(ProductVariation, on_delete=models.CASCADE, null=True, blank=True, related_name='images')
#     image = models.ImageField(upload_to='products/')
#     is_primary = models.BooleanField(default=False)
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"Image for {self.product.name}"

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


# Signal to handle file deletion when Image is deleted
@receiver(post_delete, sender=Image)
def delete_image_file(sender, instance, **kwargs):
    """Delete the image file from filesystem when Image instance is deleted"""
    if instance.image:
        try:
            if os.path.isfile(instance.image.path):
                os.remove(instance.image.path)
        except (ValueError, OSError):
            # File might have been already deleted or path might be invalid
            pass


# Signal to handle file deletion when Gallery is deleted (cascade delete)
@receiver(post_delete, sender=Gallery)
def delete_gallery_files(sender, instance, **kwargs):
    """Delete all image files when Gallery is deleted"""
    # This is a backup in case the Image post_delete signal doesn't fire
    # The Image post_delete signal should handle individual file deletion
    pass


# Signal to handle file deletion when Product is deleted
@receiver(post_delete, sender=Product)
def delete_product_image(sender, instance, **kwargs):
    """Delete the main product image file from filesystem when Product instance is deleted"""
    if instance.image:
        try:
            if os.path.isfile(instance.image.path):
                os.remove(instance.image.path)
        except (ValueError, OSError):
            # File might have been already deleted or path might be invalid
            pass