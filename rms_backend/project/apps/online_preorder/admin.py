from django.contrib import admin
from .models import OnlineConversion, OnlinePreorder


@admin.register(OnlineConversion)
class OnlineConversionAdmin(admin.ModelAdmin):
    list_display = ('id', 'online_preorder', 'sale', 'status', 'converted_at', 'updated_at')
    list_filter = ('status',)
    search_fields = ('online_preorder__id', 'sale__id')


@admin.register(OnlinePreorder)
class OnlinePreorderAdmin(admin.ModelAdmin):
    list_display = ('id', 'product_image', 'customer_name', 'customer_phone', 'status', 'total_amount', 'created_at')
    list_filter = ('status',)
    search_fields = ('customer_name', 'customer_phone')

    def product_image(self, obj):
        if not obj.items:
            return "-"
        
        try:
            # Get first item's product
            item = obj.items[0]
            product_id = item.get('product_id')
            if not product_id:
                return "-"

            from apps.inventory.models import Product, Gallery, Image
            
            product = Product.objects.get(id=product_id)
            
            # Logic: "primary photo of first variant of that product"
            image_url = None
            
            # 1. Try first variant's primary photo
            first_variant = product.variations.first()
            if first_variant:
                gallery = Gallery.objects.filter(product=product, color=first_variant.color).first()
                if gallery:
                    primary_img = Image.objects.filter(gallery=gallery, imageType='PRIMARY').first()
                    if primary_img and primary_img.image:
                        image_url = primary_img.image.url
            
            # 2. Fallback to main product image
            if not image_url and product.image:
                image_url = product.image.url
                
            if image_url:
                from django.utils.html import mark_safe
                return mark_safe(f'<img src="{image_url}" width="50" height="50" style="object-fit: cover; border-radius: 4px;" />')
            
            return "No Image"
            
        except Exception:
            return "Error"
    
    product_image.short_description = "Image"


