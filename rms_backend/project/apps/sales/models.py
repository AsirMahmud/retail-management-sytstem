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
        # Set flag to prevent recursion
        self._calculating_totals = True
        
        items = self.items.all()
        
        # Calculate subtotal from items (before any discounts)
        self.subtotal = sum(item.unit_price * item.quantity for item in items)
        
        # Calculate total item discounts
        total_item_discounts = sum(item.discount for item in items)
        
        # Calculate total after item discounts
        total_after_item_discounts = self.subtotal - total_item_discounts
        
        # Apply global discount if exists
        if self.discount > 0:
            # Validate global discount doesn't exceed total after item discounts
            if self.discount > total_after_item_discounts:
                self.discount = total_after_item_discounts
        
        # Calculate final total
        self.total = total_after_item_discounts - self.discount
        
        # Calculate profit/loss for each item based on final selling price
        total_profit = Decimal('0.00')
        total_loss = Decimal('0.00')

        # Recalculate profit for all items and save them directly
        for item in items:
            item.calculate_profit_loss(total_after_item_discounts=total_after_item_discounts)
            # Save item directly without triggering its save method
            SaleItem.objects.filter(id=item.id).update(
                total=item.total,
                profit=item.profit,
                loss=item.loss
            )
            total_profit += item.profit
            total_loss += item.loss

        # Set the final totals
        self.total_profit = total_profit
        self.total_loss = total_loss
        
        # Save the updated totals
        self.save(update_fields=['subtotal', 'total', 'total_profit', 'total_loss', 'discount'])
        
        # Remove the flag
        delattr(self, '_calculating_totals')

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

    def calculate_profit_loss(self, total_after_item_discounts):
        """Calculate profit or loss for this sale item"""
        if not self.product.cost_price:
            self.profit = Decimal('0.00')
            self.loss = Decimal('0.00')
            return
        
        # Calculate cost total
        cost_total = self.product.cost_price * self.quantity
        
        # Calculate item's final selling price after all discounts
        item_total_before_discounts = self.unit_price * self.quantity
        item_discounted_total = item_total_before_discounts - self.discount
        
        # Calculate item's share of global discount (proportional to discounted total)
        if self.discount > 0 and total_after_item_discounts > 0:
            global_discount_ratio = self.discount / total_after_item_discounts
            item_global_discount_share = item_discounted_total * global_discount_ratio
            final_selling_price = item_discounted_total - item_global_discount_share
        else:
            final_selling_price = item_discounted_total
        
        # Calculate profit/loss
        difference = final_selling_price - cost_total
        
        if difference >= 0:
            self.profit = difference
            self.loss = Decimal('0.00')
        else:
            self.profit = Decimal('0.00')
            self.loss = abs(difference)
        
        # Update item's total to reflect final selling price
        self.total = final_selling_price

    def save(self, *args, **kwargs):
        # Calculate total before saving (with discount)
        self.total = (self.quantity * self.unit_price) - self.discount
        
        # Calculate profit and loss without triggering save
        self.calculate_profit_loss(total_after_item_discounts=self.sale.subtotal - sum(item.discount for item in self.sale.items.all()))
        
        # Save the item first
        super().save(*args, **kwargs)
        
        # Handle stock movement and updates after saving
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
                
                # Update product stock without triggering recursion
                self.product.stock_quantity -= self.quantity
                Product.objects.filter(id=self.product.id).update(stock_quantity=self.product.stock_quantity)
        
        # Update sale totals after saving the item (but only if not already being calculated)
        if self.sale and not hasattr(self.sale, '_calculating_totals'):
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
            
            # Update product stock without triggering recursion
            self.sale_item.product.stock_quantity += self.quantity
            Product.objects.filter(id=self.sale_item.product.id).update(stock_quantity=self.sale_item.product.stock_quantity)
        
        super().save(*args, **kwargs) 