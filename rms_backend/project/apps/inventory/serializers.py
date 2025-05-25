from rest_framework import serializers
from .models import Category, Product, ProductImage, ProductVariation, StockMovement, InventoryAlert
from apps.supplier.models import Supplier
from apps.supplier.serializers import SupplierSerializer

class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()
    children = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'parent', 'created_at', 'updated_at', 'product_count', 'children']
        extra_kwargs = {
            'slug': {'read_only': True},
            'parent': {'required': False, 'allow_null': True},
            'description': {'required': False, 'allow_null': True, 'allow_blank': True}
        }

    def get_product_count(self, obj):
        return obj.products.count()

    def get_children(self, obj):
        try:
            children = Category.objects.filter(parent=obj)
            if not children.exists():
                return []
            return CategorySerializer(children, many=True).data
        except Exception:
            return []

    def validate(self, data):
        # Handle empty strings for optional fields
        if 'description' in data and (data['description'] == '' or data['description'] is None):
            data['description'] = None
        if 'parent' in data and data['parent'] == '':
            data['parent'] = None
        return data

    def create(self, validated_data):
        # Generate slug from name
        name = validated_data.get('name', '')
        slug = name.lower().replace(' ', '-')
        
        # Ensure slug uniqueness
        base_slug = slug
        counter = 1
        while Category.objects.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
            
        validated_data['slug'] = slug
        return super().create(validated_data)

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = '__all__'

class ProductVariationSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = ProductVariation
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    variations = ProductVariationSerializer(many=True, read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    category = serializers.SerializerMethodField()
    category_name = serializers.CharField(source='category.name', read_only=True, allow_null=True)
    supplier = serializers.SerializerMethodField()
    supplier_name = serializers.CharField(source='supplier.company_name', read_only=True, allow_null=True)
    total_stock = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'sku', 'barcode', 'description', 'category', 'category_name',
            'supplier', 'supplier_name', 'cost_price', 'selling_price', 'stock_quantity',
            'minimum_stock', 'image', 'is_active', 'variations', 'images', 'total_stock',
            'created_at', 'updated_at'
        ]
        extra_kwargs = {
            'category': {'required': False, 'allow_null': True},
            'supplier': {'required': False, 'allow_null': True},
            'description': {'required': False, 'allow_blank': True},
            'barcode': {'required': False, 'allow_null': True, 'allow_blank': True},
            'image': {'required': False, 'allow_null': True},
            'minimum_stock': {'required': False},
            'is_active': {'required': False}
        }

    def get_category(self, obj):
        if obj.category:
            return {
                'id': obj.category.id,
                'name': obj.category.name,
                'slug': obj.category.slug,
                'description': obj.category.description,
                'parent': obj.category.parent.id if obj.category.parent else None
            }
        return None

    def get_supplier(self, obj):
        if obj.supplier:
            return {
                'id': obj.supplier.id,
                'company_name': obj.supplier.company_name,
                'contact_person': obj.supplier.contact_person,
                'email': obj.supplier.email,
                'phone': obj.supplier.phone
            }
        return None

    def get_total_stock(self, obj):
        return obj.stock_quantity

class ProductCreateSerializer(serializers.ModelSerializer):
    variations = ProductVariationSerializer(many=True, required=False)
    images = ProductImageSerializer(many=True, required=False)
    supplier = serializers.PrimaryKeyRelatedField(
        queryset=Supplier.objects.all(),
        required=False,
        allow_null=True
    )

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'sku', 'barcode', 'description', 'category', 'supplier',
            'cost_price', 'selling_price', 'stock_quantity', 'minimum_stock', 'image',
            'is_active', 'variations', 'images'
        ]
        extra_kwargs = {
            'category': {'required': False, 'allow_null': True},
            'description': {'required': False, 'allow_blank': True},
            'barcode': {'required': False, 'allow_null': True, 'allow_blank': True},
            'image': {'required': False, 'allow_null': True},
            'minimum_stock': {'required': False},
            'is_active': {'required': False}
        }

    def validate(self, data):
        # Handle empty strings for optional fields
        for field in ['category', 'barcode', 'description']:
            if field in data and data[field] == '':
                data[field] = None

        # Handle falsy values for boolean fields
        if 'is_active' in data and data['is_active'] is None:
            data['is_active'] = True

        # Handle falsy values for numeric fields
        if 'minimum_stock' in data and data['minimum_stock'] is None:
            data['minimum_stock'] = 10

        return data

    def create(self, validated_data):
        variations_data = validated_data.pop('variations', [])
        images_data = validated_data.pop('images', [])
        
        product = Product.objects.create(**validated_data)
        
        for variation_data in variations_data:
            ProductVariation.objects.create(product=product, **variation_data)
            
        for image_data in images_data:
            ProductImage.objects.create(product=product, **image_data)
            
        return product

class StockMovementSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    variation_code = serializers.CharField(source='variation.variation_code', read_only=True)
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)

    class Meta:
        model = StockMovement
        fields = '__all__'
        read_only_fields = ('created_by',)

class InventoryAlertSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    variation_code = serializers.CharField(source='variation.variation_code', read_only=True)

    class Meta:
        model = InventoryAlert
        fields = '__all__'

class BulkPriceUpdateSerializer(serializers.Serializer):
    product_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=True
    )
    price_adjustment = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        required=True
    )
    adjustment_type = serializers.ChoiceField(
        choices=['percentage', 'fixed'],
        required=True
    )

class BulkImageUploadSerializer(serializers.Serializer):
    product_id = serializers.IntegerField(required=True)
    images = serializers.ListField(
        child=serializers.ImageField(),
        required=True
    )
    is_primary = serializers.BooleanField(default=False)