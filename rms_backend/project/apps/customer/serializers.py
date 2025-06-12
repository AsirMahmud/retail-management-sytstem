from rest_framework import serializers
from .models import Customer
from apps.sales.models import Sale, SaleItem
from django.db.models import Sum, Count, Max

class PurchaseHistorySerializer(serializers.Serializer):
    id = serializers.IntegerField()
    date = serializers.DateTimeField()
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    status = serializers.CharField()
    payment_method = serializers.CharField()
    items = serializers.ListField(
        child=serializers.DictField(
            child=serializers.CharField()
        )
    )

class CustomerSerializer(serializers.ModelSerializer):
    total_sales = serializers.SerializerMethodField()
    sales_count = serializers.SerializerMethodField()
    last_sale_date = serializers.SerializerMethodField()
    purchase_history = serializers.SerializerMethodField()

    class Meta:
        model = Customer
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at', 'total_sales', 'sales_count', 'last_sale_date', 'purchase_history')
        extra_kwargs = {
            'phone': {'required': True},
            'first_name': {'required': False},
            'last_name': {'required': False},
            'email': {'required': False},
            'address': {'required': False},
            'gender': {'required': False},
            'date_of_birth': {'required': False}
        }

    def get_total_sales(self, obj):
        total = Sale.objects.filter(
            customer=obj,
            status='completed'
        ).aggregate(total=Sum('total'))['total']
        return total or 0.00

    def get_sales_count(self, obj):
        return Sale.objects.filter(
            customer=obj,
            status='completed'
        ).count()

    def get_last_sale_date(self, obj):
        last_sale = Sale.objects.filter(
            customer=obj,
            status='completed'
        ).order_by('-date').first()
        return last_sale.date if last_sale else None

    def get_purchase_history(self, obj):
        sales = Sale.objects.filter(
            customer=obj,
            status='completed'
        ).order_by('-date')
        
        history = []
        for sale in sales:
            items = []
            for item in sale.items.all():
                items.append({
                    'product_name': item.product.name,
                    'size': item.size,
                    'color': item.color,
                    'quantity': item.quantity,
                    'unit_price': str(item.unit_price),
                    'total': str(item.total)
                })
            
            history.append({
                'id': sale.id,
                'date': sale.date,
                'total_amount': str(sale.total),
                'status': sale.status,
                'payment_method': sale.payment_method,
                'items': items
            })
        
        return history 