from rest_framework import serializers
from .models import PreorderProduct, PreorderVariation, Preorder
from apps.inventory.serializers import CategorySerializer
from apps.supplier.serializers import SupplierSerializer


class PreorderVariationSerializer(serializers.ModelSerializer):
    available_quantity = serializers.ReadOnlyField()
    
    class Meta:
        model = PreorderVariation
        fields = '__all__'


class PreorderProductSerializer(serializers.ModelSerializer):
    variations = PreorderVariationSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)
    supplier = SupplierSerializer(read_only=True)
    available_quantity = serializers.ReadOnlyField()
    is_available = serializers.ReadOnlyField()
    
    class Meta:
        model = PreorderProduct
        fields = '__all__'


class PreorderProductCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PreorderProduct
        fields = '__all__'


class PreorderSerializer(serializers.ModelSerializer):
    product_details = serializers.SerializerMethodField()
    items = serializers.JSONField()
    quantity = serializers.IntegerField(read_only=True)
    profit = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    unit_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    cost_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = Preorder
        fields = '__all__'

    def get_product_details(self, obj):
        """Get product details from the first item in the preorder"""
        if obj.items and len(obj.items) > 0:
            try:
                from apps.inventory.models import Product
                product = Product.objects.get(id=obj.items[0].get('product_id'))
                return {
                    'id': product.id,
                    'name': product.name,
                    'sku': product.sku,
                    'image': product.image.url if product.image else None,
                }
            except Product.DoesNotExist:
                return None
        return None

    def validate_items(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError('Items must be a list.')
        for item in value:
            for field in ['product_id', 'size', 'color', 'quantity', 'unit_price', 'discount']:
                if field not in item:
                    raise serializers.ValidationError(f"Each item must include '{field}' field.")
        return value


class PreorderCreateSerializer(serializers.ModelSerializer):
    items = serializers.JSONField()
    quantity = serializers.IntegerField(read_only=True)
    profit = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    unit_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    cost_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    class Meta:
        model = Preorder
        fields = '__all__'

    def validate_items(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError('Items must be a list.')
        for item in value:
            for field in ['product_id', 'size', 'color', 'quantity', 'unit_price', 'discount']:
                if field not in item:
                    raise serializers.ValidationError(f"Each item must include '{field}' field.")
        return value


class PreorderDashboardSerializer(serializers.ModelSerializer):
    total_orders = serializers.SerializerMethodField()
    total_revenue = serializers.SerializerMethodField()
    pending_orders = serializers.SerializerMethodField()
    completed_orders = serializers.SerializerMethodField()
    
    class Meta:
        model = PreorderProduct
        fields = ['id', 'name', 'total_orders', 'total_revenue', 'pending_orders', 'completed_orders']
    
    def get_total_orders(self, obj):
        return obj.orders.count()
    
    def get_total_revenue(self, obj):
        return sum(order.total_amount for order in obj.orders.all())
    
    def get_pending_orders(self, obj):
        return obj.orders.filter(status__in=['PENDING', 'CONFIRMED', 'DEPOSIT_PAID']).count()
    
    def get_completed_orders(self, obj):
        return obj.orders.filter(status='COMPLETED').count() 