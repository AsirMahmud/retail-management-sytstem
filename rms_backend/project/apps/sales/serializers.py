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
    product_id = serializers.IntegerField(write_only=True)
    size = serializers.CharField(max_length=50)
    color = serializers.CharField(max_length=50)
    unit_price = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        required=False,
        min_value=Decimal('0.01')
    )
    discount = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00'),
        min_value=Decimal('0.00')
    )

    class Meta:
        model = SaleItem
        fields = [
            'id', 'product', 'product_id', 'size', 'color',
            'quantity', 'unit_price', 'discount', 'total', 'created_at'
        ]
        read_only_fields = ['total']

    def validate(self, data):
        if data['quantity'] <= 0:
            raise serializers.ValidationError("Quantity must be greater than 0")
        if data['unit_price'] < Decimal('0.00'):
            raise serializers.ValidationError("Unit price cannot be negative")
        if data['discount'] < Decimal('0.00'):
            raise serializers.ValidationError("Discount cannot be negative")
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

class SaleSerializer(serializers.ModelSerializer):
    items = SaleItemSerializer(many=True)
    payments = PaymentSerializer(many=True, read_only=True)
    returns = ReturnSerializer(many=True, read_only=True)
    customer = CustomerSerializer(read_only=True)
    customer_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    customer_phone = serializers.CharField(write_only=True, required=False, allow_blank=True)
    customer_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    subtotal = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        min_value=Decimal('0.00')
    )
    tax = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        min_value=Decimal('0.00')
    )
    discount = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00'),
        min_value=Decimal('0.00')
    )
    total = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        min_value=Decimal('0.00')
    )

    class Meta:
        model = Sale
        fields = [
            'id', 'invoice_number', 'customer', 'customer_id', 'customer_phone', 'customer_name',
            'date', 'subtotal', 'tax', 'discount', 'total',
            'payment_method', 'status', 'notes', 'items', 'payments', 'returns'
        ]
        read_only_fields = ['invoice_number', 'total']

    def validate(self, data):
        if 'items' not in data or not data['items']:
            raise serializers.ValidationError("At least one item is required")
        
        # Calculate totals
        subtotal = Decimal('0.00')
        for item in data['items']:
            item_total = (item['quantity'] * item['unit_price']) - item['discount']
            if item_total < Decimal('0.00'):
                raise serializers.ValidationError(f"Item total cannot be negative for product {item['product_id']}")
            subtotal += item_total
        
        data['subtotal'] = subtotal
        data['total'] = subtotal + data['tax'] - data['discount']
        
        if data['total'] < Decimal('0.00'):
            raise serializers.ValidationError("Total amount cannot be negative")
        
        return data

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        customer_phone = validated_data.pop('customer_phone', None)
        customer_name = validated_data.pop('customer_name', None)

        # Find or create customer based on phone number
        if customer_phone:
            customer = Sale.find_or_create_customer(customer_phone, customer_name)
            validated_data['customer'] = customer
            validated_data['customer_phone'] = customer_phone

        # Create the sale first
        sale = Sale.objects.create(**validated_data)
        
        # Create sale items
        for item_data in items_data:
            item_data['sale'] = sale
            SaleItem.objects.create(**item_data)
        
        return sale

    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)
        
        # Update sale fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update items if provided
        if items_data is not None:
            # Delete existing items
            instance.items.all().delete()
            # Create new items
            for item_data in items_data:
                SaleItem.objects.create(sale=instance, **item_data)
        
        return instance 