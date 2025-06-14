from rest_framework import serializers
from .models import Supplier

class SupplierSerializer(serializers.ModelSerializer):
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