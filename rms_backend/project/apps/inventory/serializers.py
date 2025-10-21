from rest_framework import serializers
from django.core.validators import MinValueValidator
from django.utils.text import slugify
from .models import Category, OnlineCategory, Product, ProductVariation, StockMovement, InventoryAlert, MeterialComposition, WhoIsThisFor, Features, Gallery, Image
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

class ImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Image
        fields = ['id', 'imageType', 'image', 'image_url', 'alt_text']
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            # Fallback: return the relative URL
            return obj.image.url
        return None

class GallerySerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Gallery
        fields = ['id', 'color','color_hax','alt_text', 'images']

class ColorImagesUploadSerializer(serializers.Serializer):
    color = serializers.CharField(max_length=50)
    color_hax = serializers.CharField(max_length=50, required=False, allow_blank=True)
    images = serializers.ListField(child=serializers.ImageField(), min_length=1, max_length=4)
    alt_text = serializers.CharField(max_length=255, required=False, allow_blank=True)

class MeterialCompositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MeterialComposition
        fields = ['id', 'percentige', 'title']

class WhoIsThisForSerializer(serializers.ModelSerializer):
    class Meta:
        model = WhoIsThisFor
        fields = ['id', 'title', 'description']

class FeaturesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Features
        fields = ['id', 'title', 'description']

# Ecommerce Showcase Serializers
class EcommerceProductSerializer(serializers.ModelSerializer):
    """Simplified serializer for ecommerce showcase"""
    image_url = serializers.SerializerMethodField()
    online_category_name = serializers.CharField(source='online_category.name', read_only=True)
    available_colors = serializers.SerializerMethodField()
    available_sizes = serializers.SerializerMethodField()
    primary_image = serializers.SerializerMethodField()
    images_ordered = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'sku', 'description', 'selling_price', 'stock_quantity',
            'image', 'image_url', 'online_category_name', 'available_colors', 'available_sizes',
            'primary_image', 'images_ordered', 'created_at', 'updated_at'
        ]
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
    
    def get_available_colors(self, obj):
        """Get unique colors from product variations"""
        colors = obj.variations.filter(is_active=True).values_list('color', 'color_hax').distinct()
        return [{'name': color[0], 'hex': color[1]} for color in colors]
    
    def get_available_sizes(self, obj):
        """Get unique sizes from product variations"""
        sizes = obj.variations.filter(is_active=True).values_list('size', flat=True).distinct()
        return list(sizes)
    
    def get_primary_image(self, obj):
        """Get primary image from galleries"""
        try:
            primary_gallery = obj.galleries.first()
            if primary_gallery:
                primary_img = primary_gallery.images.filter(imageType='PRIMARY').first()
                if primary_img:
                    request = self.context.get('request')
                    if request:
                        return request.build_absolute_uri(primary_img.image.url)
                    return primary_img.image.url
        except:
            pass
        return None
    
    def get_images_ordered(self, obj):
        """Get all product images in order: primary, secondary, third, fourth"""
        images = []
        try:
            for gallery in obj.galleries.all():
                # Get images in specific order
                image_order = ['PRIMARY', 'SECONDARY', 'THIRD', 'FOURTH']
                for img_type in image_order:
                    img = gallery.images.filter(imageType=img_type).first()
                    if img:
                        request = self.context.get('request')
                        if request:
                            images.append(request.build_absolute_uri(img.image.url))
                        else:
                            images.append(img.image.url)
        except:
            pass
        return images

class EcommerceProductDetailSerializer(serializers.ModelSerializer):
    """Comprehensive serializer for detailed product view"""
    image_url = serializers.SerializerMethodField()
    online_category_name = serializers.CharField(source='online_category.name', read_only=True)
    available_colors = serializers.SerializerMethodField()
    available_sizes = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()
    images_ordered = serializers.SerializerMethodField()
    material_composition = serializers.SerializerMethodField()
    who_is_this_for = serializers.SerializerMethodField()
    features = serializers.SerializerMethodField()
    size_chart = serializers.SerializerMethodField()
    primary_image = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'sku', 'description', 'selling_price', 'stock_quantity',
            'image', 'image_url', 'online_category_name', 'available_colors', 'available_sizes',
            'images', 'images_ordered', 'material_composition', 'who_is_this_for', 'features', 'size_chart',
            'primary_image', 'created_at', 'updated_at'
        ]
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
    
    def get_available_colors(self, obj):
        """Get unique colors from product variations"""
        colors = obj.variations.filter(is_active=True).values_list('color', 'color_hax').distinct()
        return [{'name': color_name, 'hex': color_hex} for color_name, color_hex in colors]
    
    def get_available_sizes(self, obj):
        """Get unique sizes from product variations"""
        sizes = obj.variations.filter(is_active=True).values_list('size', flat=True).distinct()
        return list(sizes)
    
    def get_primary_image(self, obj):
        """Get primary image from galleries"""
        try:
            primary_gallery = obj.galleries.first()
            if primary_gallery:
                primary_img = primary_gallery.images.filter(imageType='PRIMARY').first()
                if primary_img:
                    request = self.context.get('request')
                    if request:
                        return request.build_absolute_uri(primary_img.image.url)
                    return primary_img.image.url
        except:
            pass
        return None
    
    def get_images(self, obj):
        """Get all product images from galleries"""
        images = []
        try:
            for gallery in obj.galleries.all():
                for img in gallery.images.all():
                    request = self.context.get('request')
                    if request:
                        images.append(request.build_absolute_uri(img.image.url))
                    else:
                        images.append(img.image.url)
        except:
            pass
        return images

    def get_images_ordered(self, obj):
        """Get images ordered by type: PRIMARY, SECONDARY, THIRD, FOURTH"""
        ordered = []
        try:
            for gallery in obj.galleries.all():
                for img_type in ['PRIMARY', 'SECONDARY', 'THIRD', 'FOURTH']:
                    img = gallery.images.filter(imageType=img_type).first()
                    if img:
                        request = self.context.get('request')
                        if request:
                            ordered.append(request.build_absolute_uri(img.image.url))
                        else:
                            ordered.append(img.image.url)
        except:
            pass
        return ordered
    
    def get_material_composition(self, obj):
        """Get material composition data"""
        materials = []
        try:
            for comp in obj.material_compositions.all():
                materials.append({
                    'name': comp.title or 'Unknown',
                    'percentage': f"{comp.percentige}%"
                })
        except:
            pass
        return materials
    
    def get_who_is_this_for(self, obj):
        """Get who is this for data"""
        data = []
        try:
            for item in obj.who_is_this_for.all():
                data.append({
                    'title': item.title or '',
                    'description': item.description or ''
                })
        except:
            pass
        return data
    
    def get_features(self, obj):
        """Get product features"""
        features = []
        try:
            for feature in obj.features.all():
                features.append({
                    'title': feature.title or '',
                    'description': feature.description or ''
                })
        except:
            pass
        return features
    
    def get_size_chart(self, obj):
        """Get size chart from variations"""
        size_chart = []
        try:
            variations = obj.variations.filter(is_active=True)
            for var in variations:
                size_chart.append({
                    'size': var.size,
                    'chest': f"{var.chest_size}" if var.chest_size else 'N/A',
                    'waist': f"{var.waist_size}" if var.waist_size else 'N/A',
                    'height': f"{var.height}" if var.height else 'N/A'
                })
        except:
            pass
        return size_chart

class ProductVariationSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProductVariation
        fields = ['size', 'color', 'color_hax', 'stock', 'waist_size', 'chest_size', 'height', 'is_active']
        extra_kwargs = {
            'is_active': {'required': False, 'default': True},
            'waist_size': {'required': False, 'allow_null': True},
            'chest_size': {'required': False, 'allow_null': True},
            'height': {'required': False, 'allow_null': True},
        }

class ProductSerializer(serializers.ModelSerializer):
    variations = ProductVariationSerializer(many=True, read_only=True)
    galleries = GallerySerializer(many=True, read_only=True)
    category = serializers.SerializerMethodField()
    category_name = serializers.CharField(source='category.name', read_only=True, allow_null=True)
    online_category = serializers.SerializerMethodField()
    online_category_name = serializers.CharField(source='online_category.name', read_only=True, allow_null=True)
    supplier = serializers.SerializerMethodField()
    supplier_name = serializers.CharField(source='supplier.company_name', read_only=True, allow_null=True)
    total_stock = serializers.SerializerMethodField()
    material_composition = serializers.SerializerMethodField()
    who_is_this_for = serializers.SerializerMethodField()
    features = serializers.SerializerMethodField()
    color_galleries = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'sku', 'barcode', 'description', 'category', 'category_name',
            'online_category', 'online_category_name',
            'supplier', 'supplier_name', 'cost_price', 'selling_price', 'stock_quantity',
            'minimum_stock', 'image', 'is_active', 'size_type', 'size_category', 'gender', 'assign_to_online', 'variations', 
            'galleries', 'color_galleries', 'material_composition', 'who_is_this_for', 'features', 'total_stock', 'created_at', 'updated_at'
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

    def get_online_category(self, obj):
        if getattr(obj, 'online_category', None):
            return {
                'id': obj.online_category.id,
                'name': obj.online_category.name,
                'slug': obj.online_category.slug,
                'description': obj.online_category.description,
                'parent': obj.online_category.parent.id if obj.online_category.parent else None
            }
        return None

    def get_material_composition(self, obj):
        qs = obj.material_compositions.all()
        return MeterialCompositionSerializer(qs, many=True).data

    def get_who_is_this_for(self, obj):
        qs = obj.who_is_this_for.all()
        return WhoIsThisForSerializer(qs, many=True).data

    def get_features(self, obj):
        qs = obj.features.all()
        return FeaturesSerializer(qs, many=True).data

    def get_color_galleries(self, obj):
        qs = obj.galleries.all()
        return GallerySerializer(qs, many=True).data


class ProductCreateSerializer(serializers.ModelSerializer):
    variations = ProductVariationSerializer(many=True, required=False)
    galleries = GallerySerializer(many=True, required=False)
    material_composition = MeterialCompositionSerializer(many=True, required=False)
    who_is_this_for = WhoIsThisForSerializer(many=True, required=False)
    features = FeaturesSerializer(many=True, required=False)
    supplier = serializers.PrimaryKeyRelatedField(
        queryset=Supplier.objects.all(),
        required=False,
        allow_null=True
    )
    sku = serializers.CharField(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'sku', 'barcode', 'description', 'category', 'online_category', 'supplier',
            'cost_price', 'selling_price', 'stock_quantity', 'minimum_stock', 'image',
            'is_active', 'size_type', 'size_category', 'gender', 'variations', 'galleries',
            'material_composition', 'who_is_this_for', 'features'
        ]
        extra_kwargs = {
            'category': {'required': False, 'allow_null': True},
            'online_category': {'required': False, 'allow_null': True},
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
        galleries_data = validated_data.pop('galleries', [])
        material_data = validated_data.pop('material_composition', [])
        who_data = validated_data.pop('who_is_this_for', [])
        features_data = validated_data.pop('features', [])
        
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
            
        # Create galleries and images
        for gallery_data in galleries_data:
            images_data = gallery_data.pop('images', [])
            gallery = Gallery.objects.create(product=product, **gallery_data)
            for image_data in images_data:
                Image.objects.create(gallery=gallery, **image_data)

        # Create material composition entries
        for item in material_data:
            MeterialComposition.objects.create(product=product, **item)

        # Create who-is-this-for entries
        for item in who_data:
            WhoIsThisFor.objects.create(product=product, **item)

        # Create features entries
        for item in features_data:
            Features.objects.create(product=product, **item)
        
        return product

    def update(self, instance, validated_data):
        variations_data = validated_data.pop('variations', None)
        galleries_data = validated_data.pop('galleries', None)
        material_data = validated_data.pop('material_composition', None)
        who_data = validated_data.pop('who_is_this_for', None)
        features_data = validated_data.pop('features', None)
        
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
        
        # Handle galleries if provided
        if galleries_data is not None:
            # Only delete and recreate galleries if galleries_data is not empty
            # This allows for selective gallery updates without affecting existing galleries
            if galleries_data:
                # Delete existing galleries and images
                instance.galleries.all().delete()
                # Create new galleries and images
                for gallery_data in galleries_data:
                    images_data = gallery_data.pop('images', [])
                    gallery = Gallery.objects.create(product=instance, **gallery_data)
                    for image_data in images_data:
                        Image.objects.create(gallery=gallery, **image_data)
            # If galleries_data is empty list, don't delete existing galleries

        # Handle material composition if provided
        if material_data is not None:
            instance.material_compositions.all().delete()
            for item in material_data:
                MeterialComposition.objects.create(product=instance, **item)

        # Handle who-is-this-for if provided
        if who_data is not None:
            instance.who_is_this_for.all().delete()
            for item in who_data:
                WhoIsThisFor.objects.create(product=instance, **item)

        # Handle features if provided
        if features_data is not None:
            instance.features.all().delete()
            for item in features_data:
                Features.objects.create(product=instance, **item)
        
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


class OnlineCategorySerializer(serializers.ModelSerializer):
    """
    Serializer for OnlineCategory model.
    """
    parent_name = serializers.CharField(source='parent.name', read_only=True)
    children_count = serializers.SerializerMethodField()
    
    class Meta:
        model = OnlineCategory
        fields = [
            'id', 'name', 'slug', 'description', 'parent', 'parent_name',
            'children_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']
    
    def get_children_count(self, obj):
        return obj.children.count()
    
    def create(self, validated_data):
        # Generate slug if not provided
        if 'slug' not in validated_data or not validated_data['slug']:
            validated_data['slug'] = slugify(validated_data['name'])
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        # Update slug if name is being updated
        if 'name' in validated_data:
            validated_data['slug'] = slugify(validated_data['name'])
        return super().update(instance, validated_data)