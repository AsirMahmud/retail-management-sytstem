from django.db import models
from django.core.validators import MinValueValidator
from django.utils import timezone
from pydantic import ValidationError
from apps.inventory.models import Product, ProductVariation, StockMovement
from apps.customer.models import Customer
import uuid
from decimal import Decimal

def generate_invoice_number():
    return f"INV-{uuid.uuid4().hex[:8].upper()}"

def generate_return_number():
    return f"RET-{uuid.uuid4().hex[:8].upper()}"

class Sale(models.Model):
    PAYMENT_METHOD_CHOICES = [
        ('cash', 'Cash'),
        ('card', 'Card'),
        ('mobile_money', 'Mobile Money'),
        ('credit', 'Credit')
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('refunded', 'Refunded')
    ]
    
    invoice_number = models.CharField(max_length=50, unique=True, default=generate_invoice_number)
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True, blank=True)
    customer_phone = models.CharField(max_length=15, null=True, blank=True)
    date = models.DateTimeField(default=timezone.now)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.00'))])
    tax = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.00'))])
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0, validators=[MinValueValidator(Decimal('0.00'))])
    total = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.00'))])
    total_profit = models.DecimalField(max_digits=10, decimal_places=2, default=0, validators=[MinValueValidator(Decimal('0.00'))])
    total_loss = models.DecimalField(max_digits=10, decimal_places=2, default=0, validators=[MinValueValidator(Decimal('0.00'))])
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
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
            self.invoice_number = generate_invoice_number()
        super().save(*args, **kwargs)
 
    def calculate_totals(self):
        """Calculate sale totals based on items and discounts"""
        items = self.items.all()
        
        # Calculate subtotal from items (before any discounts)
        self.subtotal = sum(item.unit_price * item.quantity for item in items)
        
        # Calculate total item discounts
        total_item_discounts = sum(item.discount for item in items)
        
        # Calculate total after item discounts
        total_after_item_discounts = self.subtotal - total_item_discounts
        
        # Apply global discount if exists
        if self.discount > 0:
            # Calculate the proportion of global discount to apply to each item
            global_discount_ratio = self.discount / total_after_item_discounts if total_after_item_discounts > 0 else 0
            
            # Calculate profit/loss for each item considering both item and global discounts
            total_profit = Decimal('0.00')
            total_loss = Decimal('0.00')
            
            for item in items:
                # Calculate item's share of global discount
                item_global_discount = (item.unit_price * item.quantity - item.discount) * global_discount_ratio
                
                # Calculate total discount for this item (item discount + share of global discount)
                total_item_discount = item.discount + item_global_discount
                
                # Calculate selling price after all discounts
                selling_price = item.unit_price * item.quantity - total_item_discount
                
                # Calculate cost
                cost = item.product.cost_price * item.quantity if item.product.cost_price else Decimal('0.00')
                
                # Calculate profit/loss
                difference = selling_price - cost
                
                if difference >= 0:
                    total_profit += difference
                else:
                    total_loss += abs(difference)
        else:
            # If no global discount, calculate profit/loss normally
            total_profit = sum(item.profit for item in items)
            total_loss = sum(item.loss for item in items)
        
        # Set the final totals
        self.total_profit = total_profit
        self.total_loss = total_loss
        self.total = self.subtotal - total_item_discounts - self.discount
        
        # Save the updated totals
        self.save(update_fields=['subtotal', 'total', 'total_profit', 'total_loss'])

class SaleItem(models.Model):
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    size = models.CharField(max_length=50)
    color = models.CharField(max_length=50)
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.00'))])
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0, validators=[MinValueValidator(Decimal('0.00'))])
    total = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.00'))])
    profit = models.DecimalField(max_digits=10, decimal_places=2, default=0, validators=[MinValueValidator(Decimal('0.00'))])
    loss = models.DecimalField(max_digits=10, decimal_places=2, default=0, validators=[MinValueValidator(Decimal('0.00'))])
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

    def calculate_profit_loss(self):
        """Calculate profit or loss for this sale item"""
        variation = self.get_variation()
        if variation and self.product.cost_price:
            # Calculate cost total
            cost_total = self.product.cost_price * self.quantity
            
            # Calculate selling total with discount
            selling_total = self.total  # This already includes the discount
            
            # Calculate profit/loss
            difference = selling_total - cost_total
            
            if difference >= 0:
                return difference, Decimal('0.00')  # profit, loss
            else:
                return Decimal('0.00'), abs(difference)  # profit, loss
        return Decimal('0.00'), Decimal('0.00')

    def save(self, *args, **kwargs):
        # Calculate total before saving (with discount)
        self.total = (self.quantity * self.unit_price) - self.discount
        
        # Calculate profit and loss
        self.profit, self.loss = self.calculate_profit_loss()
        
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
                
                # Update product stock
                self.product.stock_quantity -= self.quantity
                self.product.save()
        
        super().save(*args, **kwargs)
        
        # Update sale totals after saving the item
        if self.sale:
            self.sale.calculate_totals()

class Payment(models.Model):
    PAYMENT_METHOD_CHOICES = [
        ('cash', 'Cash'),
        ('card', 'Card'),
        ('mobile_money', 'Mobile Money'),
        ('credit', 'Credit')
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded')
    ]
    
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.00'))])
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    transaction_id = models.CharField(max_length=100, blank=True)
    payment_date = models.DateTimeField(default=timezone.now)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment {self.id} for Sale {self.sale.invoice_number}"

class Return(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('completed', 'Completed')
    ]
    
    return_number = models.CharField(max_length=50, unique=True, default=generate_return_number)
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, related_name='returns')
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    refund_amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.00'))])
    processed_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Return {self.return_number} for Sale {self.sale.invoice_number}"

    def save(self, *args, **kwargs):
        if not self.return_number:
            self.return_number = generate_return_number()
        super().save(*args, **kwargs)

class ReturnItem(models.Model):
    return_order = models.ForeignKey(Return, on_delete=models.CASCADE, related_name='items')
    sale_item = models.ForeignKey(SaleItem, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    reason = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Return Item {self.id} for Return {self.return_order.return_number}"

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