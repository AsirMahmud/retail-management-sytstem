from rest_framework import serializers
from .models import Customer

class PurchaseHistorySerializer(serializers.Serializer):
    id = serializers.IntegerField()
    date = serializers.DateTimeField()
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    status = serializers.CharField()
    payment_method = serializers.CharField()
    sales_person = serializers.CharField()
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
        # This will be implemented when we have the sales model
        return 0.00

    def get_sales_count(self, obj):
        # This will be implemented when we have the sales model
        return 0

    def get_last_sale_date(self, obj):
        # This will be implemented when we have the sales model
        return None

    def get_purchase_history(self, obj):
        # This will be implemented when we have the sales model
        return [] 