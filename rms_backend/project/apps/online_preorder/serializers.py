from rest_framework import serializers
from decimal import Decimal
from .models import OnlinePreorder


class OnlinePreorderCreateSerializer(serializers.ModelSerializer):
    items = serializers.JSONField()

    class Meta:
        model = OnlinePreorder
        fields = '__all__'

    def validate_items(self, value):
        if not isinstance(value, list) or not value:
            raise serializers.ValidationError('Items must be a non-empty list.')
        for item in value:
            for field in ['product_id', 'size', 'color', 'quantity', 'unit_price', 'discount']:
                if field not in item:
                    raise serializers.ValidationError(f"Each item must include '{field}' field.")
        return value

    def validate(self, data):
        # Compute total if not provided explicitly
        if data.get('items'):
            items_subtotal = sum(
                float(item.get('quantity', 0)) * float(item.get('unit_price', 0)) - float(item.get('discount', 0) or 0)
                for item in data['items']
            )
            delivery_charge = float(data.get('delivery_charge', 0) or 0)
            data['total_amount'] = Decimal(str(items_subtotal + delivery_charge))
        return data


class OnlinePreorderSerializer(serializers.ModelSerializer):
    class Meta:
        model = OnlinePreorder
        fields = '__all__'

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        items = ret.get('items', [])
        if isinstance(items, list):
            enriched_items = []
            from apps.inventory.models import Product
            for item in items:
                pid = item.get('product_id')
                if pid:
                    try:
                        product = Product.objects.get(id=pid)
                        item['product_name'] = product.name
                        
                        # Logic: "primary photo of first variant of that product"
                        image_url = None
                        
                        from apps.inventory.models import Gallery, Image
                        
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
                            request = self.context.get('request')
                            if request:
                                item['product_image'] = request.build_absolute_uri(image_url)
                            else:
                                item['product_image'] = image_url

                    except Product.DoesNotExist:
                        pass
                enriched_items.append(item)
            ret['items'] = enriched_items
        return ret


