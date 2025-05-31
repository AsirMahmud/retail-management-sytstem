from rest_framework import serializers
from .models import Customer

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')
        extra_kwargs = {
            'phone': {'required': True},
            'first_name': {'required': False},
            'last_name': {'required': False},
            'email': {'required': False},
            'address': {'required': False},
            'gender': {'required': False},
            'date_of_birth': {'required': False}
        } 