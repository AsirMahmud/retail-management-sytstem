from rest_framework import serializers
from .models import Report, ReportMetric, ReportDataPoint, SavedReport
from apps.sales.models import Sale, SaleItem
from apps.expenses.models import Expense
from apps.inventory.models import Product, Category
from apps.customer.models import Customer
from decimal import Decimal

class ReportMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportMetric
        fields = ['id', 'metric_name', 'metric_value', 'metric_type', 'created_at']
        read_only_fields = ['created_at']

class ReportDataPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportDataPoint
        fields = ['id', 'date', 'value', 'label', 'category', 'created_at']
        read_only_fields = ['created_at']

class ReportSerializer(serializers.ModelSerializer):
    metrics = ReportMetricSerializer(many=True, read_only=True)
    data_points = ReportDataPointSerializer(many=True, read_only=True)

    class Meta:
        model = Report
        fields = [
            'id', 'name', 'report_type', 'date_from', 'date_to',
            'created_at', 'updated_at', 'is_saved', 'notes',
            'metrics', 'data_points'
        ]
        read_only_fields = ['created_at', 'updated_at']

class SavedReportSerializer(serializers.ModelSerializer):
    report = ReportSerializer(read_only=True)
    report_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = SavedReport
        fields = [
            'id', 'report', 'report_id', 'name', 'description',
            'created_at', 'updated_at', 'is_favorite'
        ]
        read_only_fields = ['created_at', 'updated_at']

class SalesReportSerializer(serializers.Serializer):
    total_sales = serializers.DecimalField(max_digits=15, decimal_places=2)
    total_orders = serializers.IntegerField()
    total_items_sold = serializers.IntegerField()
    average_order_value = serializers.DecimalField(max_digits=15, decimal_places=2)
    average_item_price = serializers.DecimalField(max_digits=15, decimal_places=2)
    sales_by_date = serializers.ListField(child=serializers.DictField())
    sales_by_category = serializers.ListField(child=serializers.DictField())
    top_products = serializers.ListField(child=serializers.DictField())
    payment_methods = serializers.ListField(child=serializers.DictField())

class ExpenseReportSerializer(serializers.Serializer):
    total_expenses = serializers.DecimalField(max_digits=15, decimal_places=2)
    expenses_by_category = serializers.ListField(child=serializers.DictField())
    expenses_by_date = serializers.ListField(child=serializers.DictField())
    payment_methods = serializers.ListField(child=serializers.DictField())

class InventoryReportSerializer(serializers.Serializer):
    total_products = serializers.IntegerField()
    total_stock_value = serializers.DecimalField(max_digits=15, decimal_places=2)
    low_stock_items = serializers.ListField(child=serializers.DictField())
    stock_by_category = serializers.ListField(child=serializers.DictField())
    stock_movements = serializers.ListField(child=serializers.DictField())

class CustomerReportSerializer(serializers.Serializer):
    total_customers = serializers.IntegerField()
    new_customers = serializers.IntegerField()
    total_sales = serializers.DecimalField(max_digits=15, decimal_places=2)
    average_customer_value = serializers.DecimalField(max_digits=15, decimal_places=2)
    top_customers = serializers.ListField(child=serializers.DictField())
    customer_acquisition = serializers.ListField(child=serializers.DictField())

class CategoryReportSerializer(serializers.Serializer):
    total_categories = serializers.IntegerField()
    total_products = serializers.IntegerField()
    sales_by_category = serializers.ListField(child=serializers.DictField())
    stock_by_category = serializers.ListField(child=serializers.DictField())
    top_categories = serializers.ListField(child=serializers.DictField())

class ProfitLossReportSerializer(serializers.Serializer):
    total_revenue = serializers.DecimalField(max_digits=15, decimal_places=2)
    total_expenses = serializers.DecimalField(max_digits=15, decimal_places=2)
    net_profit = serializers.DecimalField(max_digits=15, decimal_places=2)
    profit_margin = serializers.DecimalField(max_digits=15, decimal_places=2)
    revenue_by_date = serializers.ListField(child=serializers.DictField())
    expenses_by_date = serializers.ListField(child=serializers.DictField())
    profit_by_category = serializers.ListField(child=serializers.DictField())

class ProductPerformanceReportSerializer(serializers.Serializer):
    total_products = serializers.IntegerField()
    total_sales = serializers.DecimalField(max_digits=15, decimal_places=2)
    total_profit = serializers.DecimalField(max_digits=15, decimal_places=2)
    average_profit_margin = serializers.DecimalField(max_digits=15, decimal_places=2)
    top_performing_products = serializers.ListField(child=serializers.DictField())
    low_performing_products = serializers.ListField(child=serializers.DictField())
    sales_by_product = serializers.ListField(child=serializers.DictField())
    profit_by_product = serializers.ListField(child=serializers.DictField()) 