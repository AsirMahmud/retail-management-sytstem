from django.db import models
from django.core.validators import MinValueValidator
from django.utils import timezone
from apps.inventory.models import Product, ProductVariation, StockMovement
from apps.customer.models import Customer
import uuid
from decimal import Decimal

class Sale(models.Model):
    PAYMENT_METHODS = [
        ('cash', 'Cash'),
        ('card', 'Card'),
        ('mobile_money', 'Mobile Money'),
        ('credit', 'Credit'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('refunded', 'Refunded'),
    ]

    invoice_number = models.CharField(max_length=50, unique=True, default=lambda: f"INV-{uuid.uuid4().hex[:8].upper()}")
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True, blank=True)
    customer_phone = models.CharField(max_length=15, blank=True, null=True)
    date = models.DateTimeField(default=timezone.now)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    tax = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    total = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"Sale {self.invoice_number}"

    @classmethod
    def find_or_create_customer(cls, phone, name=None):
        """Find existing customer by phone or create new one"""
        try:
            customer = Customer.objects.get(phone=phone)
        except Customer.DoesNotExist:
            if name:
                customer = Customer.objects.create(
                    first_name=name.split()[0] if name else '',
                    last_name=' '.join(name.split()[1:]) if name and len(name.split()) > 1 else '',
                    phone=phone,
                    email=f"{phone}@temp.com",  # Temporary email
                    address="To be updated",
                    gender='O'  # Default to Other
                )
            else:
                customer = None
        return customer

    def save(self, *args, **kwargs):
        if not self.invoice_number:
            self.invoice_number = f"INV-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

    def calculate_totals(self):
        """Calculate sale totals based on items"""
        items = self.items.all()
        self.subtotal = sum(item.total for item in items)
        self.total = self.subtotal + self.tax - self.discount
        self.save()

class SaleItem(models.Model):
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    size = models.CharField(max_length=50)
    color = models.CharField(max_length=50)
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    total = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product.name} - {self.size} - {self.color} - {self.quantity}"

    def get_variation(self):
        """Get the product variation based on size and color"""
        try:
            return ProductVariation.objects.get(
                product=self.product,
                size=self.size,
                color=self.color,
                is_active=True
            )
        except ProductVariation.DoesNotExist:
            return None

    def clean(self):
        """Validate stock availability"""
        variation = self.get_variation()
        if not variation:
            raise ValidationError(f"Invalid variation for {self.product.name} - Size: {self.size}, Color: {self.color}")
        
        if self.quantity > variation.stock:
            raise ValidationError(f"Not enough stock for {self.product.name} - Size: {self.size}, Color: {self.color}")

    def save(self, *args, **kwargs):
        # Calculate total before saving
        self.total = (self.quantity * self.unit_price) - self.discount
        
        # Create stock movement record and update stock when sale is completed
        if self.sale.status == 'completed':
            variation = self.get_variation()
            if variation:
                # Create stock movement record
                StockMovement.objects.create(
                    product=self.product,
                    variation=variation,
                    movement_type='OUT',
                    quantity=self.quantity,
                    reference_number=self.sale.invoice_number,
                    notes=f"Sale item from {self.sale.invoice_number}"
                )
                
                # Update variation stock
                variation.stock -= self.quantity
                variation.save()
        
        super().save(*args, **kwargs)

class Payment(models.Model):
    PAYMENT_STATUS = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]

    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    payment_method = models.CharField(max_length=20, choices=Sale.PAYMENT_METHODS)
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default='pending')
    transaction_id = models.CharField(max_length=100, blank=True)
    payment_date = models.DateTimeField(default=timezone.now)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment for {self.sale.invoice_number}"

class Return(models.Model):
    RETURN_STATUS = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('completed', 'Completed'),
    ]

    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, related_name='returns')
    return_number = models.CharField(max_length=50, unique=True, default=lambda: f"RET-{uuid.uuid4().hex[:8].upper()}")
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=RETURN_STATUS, default='pending')
    refund_amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    processed_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Return {self.return_number}"

    def save(self, *args, **kwargs):
        if not self.return_number:
            self.return_number = f"RET-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

class ReturnItem(models.Model):
    return_order = models.ForeignKey(Return, on_delete=models.CASCADE, related_name='items')
    sale_item = models.ForeignKey(SaleItem, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    reason = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Return Item for {self.sale_item.product.name}"

    def save(self, *args, **kwargs):
        # Create stock movement record when return is approved
        if self.return_order.status == 'approved':
            StockMovement.objects.create(
                product=self.sale_item.product,
                movement_type='IN',
                quantity=self.quantity,
                reference_number=self.return_order.return_number,
                notes=f"Return item from {self.return_order.return_number}"
            )
            
            # Update product stock
            self.sale_item.product.stock_quantity += self.quantity
            self.sale_item.product.save()
        
        super().save(*args, **kwargs) 