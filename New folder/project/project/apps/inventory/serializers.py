from rest_framework import serializers
from django.core.validators import MinValueValidator
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
        fields = ['size', 'color', 'color_hax', 'stock', 'is_active', 'images']
        extra_kwargs = {
            'is_active': {'required': False, 'default': True}
        }

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
            'minimum_stock', 'image', 'is_active', 'size_type', 'size_category', 'gender', 'variations', 
            'images', 'total_stock', 'created_at', 'updated_at'
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
    sku = serializers.CharField(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'sku', 'barcode', 'description', 'category', 'supplier',
            'cost_price', 'selling_price', 'stock_quantity', 'minimum_stock', 'image',
            'is_active', 'size_type', 'size_category', 'gender', 'variations', 'images'
        ]
        extra_kwargs = {
            'category': {'required': False, 'allow_null': True},
            'description': {'required': False, 'allow_blank': True},
            'barcode': {'required': False, 'allow_null': True, 'allow_blank': True},
            'image': {'required': False, 'allow_null': True},
            'minimum_stock': {'required': False},
            'is_active': {'required': False},
            'stock_quantity': {'read_only': True}  # Make stock_quantity read-only
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

        # Validate variations for duplicates
        variations_data = data.get('variations', [])
        if variations_data:
            seen_combinations = set()
            for variation in variations_data:
                combination = (variation['size'], variation['color'])
                if combination in seen_combinations:
                    raise serializers.ValidationError(
                        f"Duplicate variation found: Size '{variation['size']}' and Color '{variation['color']}'"
                    )
                seen_combinations.add(combination)

        return data

    def create(self, validated_data):
        variations_data = validated_data.pop('variations', [])
        images_data = validated_data.pop('images', [])
        
        # Create the product first
        product = Product.objects.create(**validated_data)
        
        # Create variations and calculate total stock
        total_stock = 0
        for variation_data in variations_data:
            variation = ProductVariation.objects.create(product=product, **variation_data)
            total_stock += variation.stock
            # Record initial stock movement for each variation
            if variation.stock and variation.stock > 0:
                StockMovement.objects.create(
                    product=product,
                    variation=variation,
                    movement_type='IN',
                    quantity=variation.stock,
                    reference_number='INIT',
                    notes='Initial stock at product creation'
                )
            
        # Update product's total stock
        product.stock_quantity = total_stock
        product.save()
            
        # Create images
        for image_data in images_data:
            ProductImage.objects.create(product=product, **image_data)
            
        return product

    def update(self, instance, validated_data):
        variations_data = validated_data.pop('variations', None)
        images_data = validated_data.pop('images', None)
        
        # Update product fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Handle variations if provided
        if variations_data is not None:
            # Track old stock quantities by size/color combination
            old_variations = {}
            for v in instance.variations.all():
                key = f"{v.size}-{v.color}"
                old_variations[key] = v.stock
            
            # Delete existing variations
            instance.variations.all().delete()
            
            # Create new variations and calculate total stock
            total_stock = 0
            for variation_data in variations_data:
                variation = ProductVariation.objects.create(product=instance, **variation_data)
                total_stock += variation.stock
                
                # Log stock movement for changes in existing variations or new ones
                key = f"{variation.size}-{variation.color}"
                old_stock = old_variations.get(key, 0)
                
                if variation.stock > old_stock:
                    StockMovement.objects.create(
                        product=instance, 
                        variation=variation, 
                        movement_type='IN', 
                        quantity=variation.stock - old_stock, 
                        notes='Stock updated via product edit',
                        reference_number='EDIT'
                    )
                elif variation.stock < old_stock:
                    StockMovement.objects.create(
                        product=instance, 
                        variation=variation, 
                        movement_type='OUT', 
                        quantity=old_stock - variation.stock, 
                        notes='Stock updated via product edit',
                        reference_number='EDIT'
                    )
            
            # Update product's total stock
            instance.stock_quantity = total_stock
        
        # Handle images if provided
        if images_data is not None:
            # Delete existing images
            instance.images.all().delete()
            # Create new images
            for image_data in images_data:
                ProductImage.objects.create(product=instance, **image_data)
        
        instance.save()
        return instance

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

class AddStockSerializer(serializers.Serializer):
    variation_id = serializers.IntegerField(required=True, allow_null=False)
    quantity = serializers.IntegerField(validators=[MinValueValidator(1)], required=True)
    notes = serializers.CharField(max_length=255, required=False, allow_blank=True)
    reference_number = serializers.CharField(max_length=50, required=False, allow_blank=True)

    def validate_variation_id(self, value):
        if value is None:
            raise serializers.ValidationError("variation_id cannot be null")
        if value <= 0:
            raise serializers.ValidationError("variation_id must be a positive integer")
        return value