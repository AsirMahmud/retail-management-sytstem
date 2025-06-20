from rest_framework import serializers
from .models import Supplier
from apps.inventory.models import Product
from django.db.models import F, Sum

class SupplierSerializer(serializers.ModelSerializer):
    products_count = serializers.SerializerMethodField()
    total_value = serializers.SerializerMethodField()

    class Meta:
        model = Supplier
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')
        extra_kwargs = {
            'contact_person': {'required': True},
            'phone': {'required': True},
            'company_name': {'required': False},
            'email': {'required': False},
            'address': {'required': False},
            'tax_number': {'required': False},
            'website': {'required': False},
            'payment_terms': {'required': False}
        }

    def get_products_count(self, obj):
        return Product.objects.filter(supplier=obj).count()

    def get_total_value(self, obj):
        result = Product.objects.filter(supplier=obj).aggregate(
            total=Sum(F('cost_price') * F('stock_quantity'))
        )
        return result['total'] or 0 