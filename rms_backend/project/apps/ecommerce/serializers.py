from rest_framework import serializers
from .models import Discount, Brand, HomePageSettings, DeliverySettings, HeroSlide
from apps.inventory.serializers import ProductSerializer, CategorySerializer, OnlineCategorySerializer


class DiscountSerializer(serializers.ModelSerializer):
    """Serializer for Discount model"""
    
    # Include nested serializers for better API response
    category_detail = CategorySerializer(source='category', read_only=True)
    online_category_detail = OnlineCategorySerializer(source='online_category', read_only=True)
    product_detail = ProductSerializer(source='product', read_only=True)
    
    # Add display fields
    discount_type_display = serializers.SerializerMethodField()
    status_display = serializers.SerializerMethodField()
    
    class Meta:
        model = Discount
        fields = [
            'id',
            'name',
            'discount_type',
            'discount_type_display',
            'value',
            'description',
            'start_date',
            'end_date',
            'status',
            'status_display',
            'category',
            'category_detail',
            'online_category',
            'online_category_detail',
            'product',
            'product_detail',
            'is_active',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at', 'status']
    
    def get_discount_type_display(self, obj):
        """Get human-readable discount type"""
        return obj.get_discount_type_display()
    
    def get_status_display(self, obj):
        """Get human-readable status"""
        return obj.get_status_display()
    
    def validate(self, data):
        """Custom validation for discount"""
        # Check if start_date is before end_date
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        
        if start_date and end_date and start_date >= end_date:
            raise serializers.ValidationError({
                'end_date': 'End date must be after start date.'
            })
        
        # Validate discount_type specific requirements
        discount_type = data.get('discount_type')
        category = data.get('category')
        online_category = data.get('online_category')
        product = data.get('product')
        
        if discount_type == 'CATEGORY' and not category and not online_category:
            raise serializers.ValidationError({
                'category': 'Category or online category is required for CATEGORY discount type.'
            })
        
        if discount_type == 'PRODUCT' and not product:
            raise serializers.ValidationError({
                'product': 'Product is required for PRODUCT discount type.'
            })
        
        return data
    
    def create(self, validated_data):
        """Create discount with automatic status setting"""
        from django.utils import timezone
        
        now = timezone.now()
        start_date = validated_data.get('start_date')
        end_date = validated_data.get('end_date')
        
        # Set status based on dates
        if start_date > now:
            validated_data['status'] = 'SCHEDULED'
        elif end_date < now:
            validated_data['status'] = 'EXPIRED'
        else:
            validated_data['status'] = 'ACTIVE'
        
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        """Update discount with automatic status setting"""
        from django.utils import timezone
        
        now = timezone.now()
        start_date = validated_data.get('start_date', instance.start_date)
        end_date = validated_data.get('end_date', instance.end_date)
        
        # Update status based on dates
        if start_date > now:
            validated_data['status'] = 'SCHEDULED'
        elif end_date < now:
            validated_data['status'] = 'EXPIRED'
        else:
            validated_data['status'] = 'ACTIVE'
        
        return super().update(instance, validated_data)


class DiscountListSerializer(serializers.ModelSerializer):
    """Simplified serializer for listing discounts"""
    
    # Add display fields
    discount_type_display = serializers.SerializerMethodField()
    status_display = serializers.SerializerMethodField()
    
    class Meta:
        model = Discount
        fields = [
            'id',
            'name',
            'discount_type',
            'discount_type_display',
            'value',
            'start_date',
            'end_date',
            'status',
            'status_display',
            'is_active',
            'created_at',
        ]
    
    def get_discount_type_display(self, obj):
        """Get human-readable discount type"""
        return obj.get_discount_type_display()

    def get_status_display(self, obj):
        """Get human-readable status"""
        return obj.get_status_display()


class BrandSerializer(serializers.ModelSerializer):
    """Serializer for Brand model"""
    logo_image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Brand
        fields = [
            'id',
            'name',
            'logo_image',
            'logo_image_url',
            'logo_text',
            'website_url',
            'is_active',
            'display_order',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def get_logo_image_url(self, obj):
        if obj.logo_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.logo_image.url)
            return obj.logo_image.url
        return None


class HomePageSettingsSerializer(serializers.ModelSerializer):
    """Serializer for HomePageSettings model"""
    logo_image_url = serializers.SerializerMethodField()
    hero_primary_image_url = serializers.SerializerMethodField()
    hero_secondary_image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = HomePageSettings
        fields = [
            'id',
            'logo_image',
            'logo_image_url',
            'logo_text',
            'footer_tagline',
            'footer_address',
            'footer_phone',
            'footer_email',
            'footer_facebook_url',
            'footer_instagram_url',
            'footer_twitter_url',
            'footer_github_url',
            'footer_map_embed_url',
            'hero_badge_text',
            'hero_heading_line1',
            'hero_heading_line2',
            'hero_heading_line3',
            'hero_heading_line4',
            'hero_heading_line5',
            'hero_description',
            'hero_primary_image',
            'hero_primary_image_url',
            'hero_secondary_image',
            'hero_secondary_image_url',
            'stat_brands',
            'stat_products',
            'stat_customers',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def get_logo_image_url(self, obj):
        if obj.logo_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.logo_image.url)
            return obj.logo_image.url
        return None
    
    def get_hero_primary_image_url(self, obj):
        if obj.hero_primary_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.hero_primary_image.url)
            return obj.hero_primary_image.url
        return None
    
    def get_hero_secondary_image_url(self, obj):
        if obj.hero_secondary_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.hero_secondary_image.url)
            return obj.hero_secondary_image.url
        return None

    def update(self, instance, validated_data):
        """Handle image replacement with old file cleanup and canonical naming."""
        import os
        request = self.context.get('request')

        def replace_image(field_name: str, new_file):
            if not new_file:
                return
            # delete previous file if exists
            old_file = getattr(instance, field_name, None)
            if old_file:
                try:
                    old_file.delete(save=False)
                except Exception:
                    pass
            # set canonical filename
            base = {
                'logo_image': 'logo',
                'hero_primary_image': 'primary',
                'hero_secondary_image': 'secondary',
            }.get(field_name, field_name)
            _, ext = os.path.splitext(getattr(new_file, 'name', '') or '')
            if not ext:
                ext = '.jpg'
            new_file.name = f"{base}{ext}"
            setattr(instance, field_name, new_file)

        # Handle explicit delete flags coming from request (e.g., remove_logo_image=true)
        if request is not None:
            remove_logo = str(request.data.get('remove_logo_image', 'false')).lower() == 'true'
            remove_primary = str(request.data.get('remove_hero_primary_image', 'false')).lower() == 'true'
            remove_secondary = str(request.data.get('remove_hero_secondary_image', 'false')).lower() == 'true'
            if remove_logo and getattr(instance, 'logo_image', None):
                try:
                    instance.logo_image.delete(save=False)
                except Exception:
                    pass
                instance.logo_image = None
            if remove_primary and getattr(instance, 'hero_primary_image', None):
                try:
                    instance.hero_primary_image.delete(save=False)
                except Exception:
                    pass
                instance.hero_primary_image = None
            if remove_secondary and getattr(instance, 'hero_secondary_image', None):
                try:
                    instance.hero_secondary_image.delete(save=False)
                except Exception:
                    pass
                instance.hero_secondary_image = None

        # Extract image files from validated_data first
        logo_file = validated_data.pop('logo_image', None)
        primary_file = validated_data.pop('hero_primary_image', None)
        secondary_file = validated_data.pop('hero_secondary_image', None)

        # Update non-file fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # Handle images with cleanup and naming
        replace_image('logo_image', logo_file)
        replace_image('hero_primary_image', primary_file)
        replace_image('hero_secondary_image', secondary_file)

        instance.save()
        return instance


class DeliverySettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliverySettings
        fields = [
            'inside_dhaka_charge',
            'inside_gazipur_charge',
            'outside_dhaka_charge',
            'updated_at',
        ]
        read_only_fields = ['updated_at']


class HeroSlideSerializer(serializers.ModelSerializer):
    """Serializer for HeroSlide model"""
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = HeroSlide
        fields = [
            'id',
            'title',
            'subtitle',
            'button_text',
            'image',
            'image_url',
            'bg_color',
            'layout',
            'title_class',
            'subtitle_class',
            'stats',
            'display_order',
            'is_active',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

