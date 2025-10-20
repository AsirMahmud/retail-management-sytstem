from rest_framework import serializers
from .models import Expense, ExpenseCategory

class ExpenseCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpenseCategory
        fields = ['id', 'name', 'color', 'description', 'created_at', 'updated_at']

class ExpenseSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_color = serializers.CharField(source='category.color', read_only=True)

    class Meta:
        model = Expense
        fields = [
            'id', 'description', 'amount', 'date', 'category', 'category_name',
            'category_color', 'payment_method', 'status', 'reference_number',
            'notes', 'receipt', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than zero")
        return value 