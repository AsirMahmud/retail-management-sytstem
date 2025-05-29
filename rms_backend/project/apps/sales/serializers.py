from rest_framework import serializers
from .models import Sale, SaleItem, Payment, Return, ReturnItem
from apps.inventory.serializers import ProductSerializer
from apps.customer.serializers import CustomerSerializer
from apps.customer.models import Customer
from apps.inventory.models import Product, ProductVariation
from django.core.exceptions import ValidationError
from decimal import Decimal

class SaleItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.filter(is_active=True),
        source='product',
        write_only=True
    )
    size = serializers.CharField(max_length=50)
    color = serializers.CharField(max_length=50)
    unit_price = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        required=False,
        min_value=Decimal('0.01')
    )

    class Meta:
        model = SaleItem
        fields = [
            'id', 'product', 'product_id', 'size', 'color',
            'quantity', 'unit_price', 'discount', 'total', 'created_at'
        ]
        read_only_fields = ['total']

    def validate(self, data):
        product = data.get('product')
        size = data.get('size')
        color = data.get('color')
        quantity = data.get('quantity', 0)
        
        # Validate variation exists
        try:
            variation = ProductVariation.objects.get(
                product=product,
                size=size,
                color=color,
                is_active=True
            )
        except ProductVariation.DoesNotExist:
            raise ValidationError(f"Invalid variation for {product.name} - Size: {size}, Color: {color}")
        
        # Validate stock availability
        if quantity > variation.stock:
            raise ValidationError(f"Not enough stock for {product.name} - Size: {size}, Color: {color}")
        
        # Set default unit price if not provided
        if 'unit_price' not in data:
            data['unit_price'] = product.selling_price
        
        return data

    def create(self, validated_data):
        # Calculate total
        quantity = validated_data.get('quantity', 0)
        unit_price = validated_data.get('unit_price', 0)
        discount = validated_data.get('discount', 0)
        validated_data['total'] = (quantity * unit_price) - discount
        
        return super().create(validated_data)

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            'id', 'sale', 'amount', 'payment_method', 'status',
            'transaction_id', 'payment_date', 'notes', 'created_at'
        ]
        read_only_fields = ['created_at']

class SaleSerializer(serializers.ModelSerializer):
    items = SaleItemSerializer(many=True, read_only=True)
    payments = PaymentSerializer(many=True, read_only=True)
    customer = CustomerSerializer(read_only=True)
    customer_phone = serializers.CharField(write_only=True, required=False, allow_blank=True)
    customer_name = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Sale
        fields = [
            'id', 'invoice_number', 'customer', 'customer_phone', 'customer_name',
            'date', 'subtotal', 'tax', 'discount', 'total',
            'payment_method', 'status', 'notes', 'items', 'payments',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['invoice_number', 'created_at', 'updated_at']

    def create(self, validated_data):
        items_data = self.context.get('items', [])
        customer_phone = validated_data.pop('customer_phone', None)
        customer_name = validated_data.pop('customer_name', None)

        # Find or create customer based on phone number
        if customer_phone:
            customer = Sale.find_or_create_customer(customer_phone, customer_name)
            validated_data['customer'] = customer
            validated_data['customer_phone'] = customer_phone

        sale = Sale.objects.create(**validated_data)
        
        for item_data in items_data:
            item_data['sale'] = sale
            SaleItem.objects.create(**item_data)
        
        return sale

class ReturnItemSerializer(serializers.ModelSerializer):
    sale_item = SaleItemSerializer(read_only=True)
    sale_item_id = serializers.PrimaryKeyRelatedField(
        queryset=SaleItem.objects.all(),
        source='sale_item',
        write_only=True
    )

    class Meta:
        model = ReturnItem
        fields = [
            'id', 'return_order', 'sale_item', 'sale_item_id',
            'quantity', 'reason', 'created_at'
        ]
        read_only_fields = ['created_at']

class ReturnSerializer(serializers.ModelSerializer):
    items = ReturnItemSerializer(many=True, read_only=True)
    sale = SaleSerializer(read_only=True)
    sale_id = serializers.PrimaryKeyRelatedField(
        queryset=Sale.objects.all(),
        source='sale',
        write_only=True
    )

    class Meta:
        model = Return
        fields = [
            'id', 'sale', 'sale_id', 'return_number', 'reason', 'status',
            'refund_amount', 'processed_date', 'items', 'created_at', 'updated_at'
        ]
        read_only_fields = ['return_number', 'created_at', 'updated_at']

    def create(self, validated_data):
        items_data = self.context.get('items', [])
        return_order = Return.objects.create(**validated_data)
        
        for item_data in items_data:
            item_data['return_order'] = return_order
            ReturnItem.objects.create(**item_data)
        
        return return_order 