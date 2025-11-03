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


