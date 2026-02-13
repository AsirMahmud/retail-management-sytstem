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

class TopProductsSerializer(serializers.Serializer):
    product_name = serializers.CharField()
    category_name = serializers.CharField()
    total_sales = serializers.DecimalField(max_digits=10, decimal_places=2)
    quantity_sold = serializers.IntegerField()
    average_price = serializers.DecimalField(max_digits=10, decimal_places=2)
    profit = serializers.DecimalField(max_digits=10, decimal_places=2)

class ExpenseByCategorySerializer(serializers.Serializer):
    category_name = serializers.CharField()
    total = serializers.DecimalField(max_digits=10, decimal_places=2)
    count = serializers.IntegerField()

class ExpenseByDateSerializer(serializers.Serializer):
    date = serializers.DateField(source='expense_date')
    total = serializers.DecimalField(max_digits=10, decimal_places=2, source='amount')
    count = serializers.IntegerField()

class ExpenseReportSerializer(serializers.Serializer):
    total_expenses = serializers.DecimalField(max_digits=10, decimal_places=2)
    expenses_by_category = ExpenseByCategorySerializer(many=True)
    expenses_by_date = ExpenseByDateSerializer(many=True)

class InventoryReportSerializer(serializers.Serializer):
    total_products = serializers.IntegerField()
    total_stock_value = serializers.DecimalField(max_digits=10, decimal_places=2)
    low_stock_items = serializers.ListField(child=serializers.DictField())
    stock_by_category = serializers.ListField(child=serializers.DictField())
    stock_movements = serializers.ListField(child=serializers.DictField())

class SalesByCategorySerializer(serializers.Serializer):
    category_name = serializers.CharField()
    total_sales = serializers.DecimalField(max_digits=10, decimal_places=2)
    items_sold = serializers.IntegerField()
    unique_products = serializers.IntegerField()

class PaymentMethodSerializer(serializers.Serializer):
    payment_method = serializers.CharField()
    total = serializers.DecimalField(max_digits=10, decimal_places=2)
    orders_count = serializers.IntegerField()
    items_count = serializers.IntegerField()

class SalesReportSerializer(serializers.Serializer):
    total_sales = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_orders = serializers.IntegerField()
    total_items_sold = serializers.IntegerField()
    average_order_value = serializers.DecimalField(max_digits=15, decimal_places=2)
    average_item_price = serializers.DecimalField(max_digits=15, decimal_places=2)
    sales_by_date = serializers.ListField(child=serializers.DictField())
    sales_by_category = serializers.ListField(child=serializers.DictField())
    top_products = TopProductsSerializer(many=True)
    payment_methods = PaymentMethodSerializer(many=True)

class LowStockItemSerializer(serializers.Serializer):
    name = serializers.CharField()
    stock = serializers.IntegerField()

class StockByCategorySerializer(serializers.Serializer):
    category_name = serializers.CharField()
    total_products = serializers.IntegerField()
    total_stock = serializers.IntegerField()
    total_value = serializers.DecimalField(max_digits=10, decimal_places=2)

class StockMovementSerializer(serializers.Serializer):
    date = serializers.DateField()
    movement_type = serializers.CharField()
    total_quantity = serializers.IntegerField()
    total_value = serializers.DecimalField(max_digits=10, decimal_places=2)

class TopCustomersSerializer(serializers.Serializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    phone = serializers.CharField()
    total_sales = serializers.DecimalField(max_digits=15, decimal_places=2)
    items_purchased = serializers.IntegerField()
    unique_products = serializers.IntegerField()
    last_purchase_date = serializers.DateField()

class CustomerAcquisitionSerializer(serializers.Serializer):
    date = serializers.DateField()
    new_customers = serializers.IntegerField()

class CustomerReportSerializer(serializers.Serializer):
    total_customers = serializers.IntegerField()
    new_customers = serializers.IntegerField()
    total_sales = serializers.DecimalField(max_digits=15, decimal_places=2)
    average_customer_value = serializers.DecimalField(max_digits=15, decimal_places=2)
    top_customers = TopCustomersSerializer(many=True)
    customer_acquisition = CustomerAcquisitionSerializer(many=True)

class TopCategoriesSerializer(serializers.Serializer):
    name = serializers.CharField()
    total_sales = serializers.DecimalField(max_digits=10, decimal_places=2)
    items_sold = serializers.IntegerField()
    product_count = serializers.IntegerField()
    average_price = serializers.DecimalField(max_digits=10, decimal_places=2)

class CategoryReportSerializer(serializers.Serializer):
    total_categories = serializers.IntegerField()
    total_products = serializers.IntegerField()
    sales_by_category = SalesByCategorySerializer(many=True)
    stock_by_category = StockByCategorySerializer(many=True)
    top_categories = TopCategoriesSerializer(many=True)

class RevenueByDateSerializer(serializers.Serializer):
    date = serializers.DateField(source='sale_date')
    revenue = serializers.DecimalField(max_digits=10, decimal_places=2)
    items_sold = serializers.IntegerField()

class ProfitByCategorySerializer(serializers.Serializer):
    category_name = serializers.CharField()
    revenue = serializers.DecimalField(max_digits=10, decimal_places=2)
    cost = serializers.DecimalField(max_digits=10, decimal_places=2)
    profit = serializers.DecimalField(max_digits=10, decimal_places=2)
    items_sold = serializers.IntegerField()

class ProfitLossReportSerializer(serializers.Serializer):
    total_revenue = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_expenses = serializers.DecimalField(max_digits=10, decimal_places=2)
    net_profit = serializers.DecimalField(max_digits=10, decimal_places=2)
    profit_margin = serializers.DecimalField(max_digits=10, decimal_places=2)
    revenue_by_date = RevenueByDateSerializer(many=True)
    expenses_by_date = ExpenseByDateSerializer(many=True)
    profit_by_category = ProfitByCategorySerializer(many=True)

class ProductPerformanceSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    product_name = serializers.CharField()
    category_name = serializers.CharField()
    total_sales = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_profit = serializers.DecimalField(max_digits=10, decimal_places=2)
    profit_margin = serializers.DecimalField(max_digits=10, decimal_places=2)
    average_price = serializers.DecimalField(max_digits=10, decimal_places=2)
    average_profit = serializers.DecimalField(max_digits=10, decimal_places=2)
    average_selling_price_with_discount = serializers.DecimalField(max_digits=10, decimal_places=2)
    quantity_sold = serializers.IntegerField()

class SalesByProductSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    product_name = serializers.CharField()
    total_sales = serializers.DecimalField(max_digits=10, decimal_places=2)
    quantity_sold = serializers.IntegerField()
    average_price = serializers.DecimalField(max_digits=10, decimal_places=2)
    average_selling_price_with_discount = serializers.DecimalField(max_digits=10, decimal_places=2)

class ProfitByProductSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    product_name = serializers.CharField()
    total_profit = serializers.DecimalField(max_digits=10, decimal_places=2)
    profit_margin = serializers.DecimalField(max_digits=10, decimal_places=2)
    quantity_sold = serializers.IntegerField()
    average_profit = serializers.DecimalField(max_digits=10, decimal_places=2)

class ProductPerformanceReportSerializer(serializers.Serializer):
    total_products = serializers.IntegerField()
    total_sales = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_profit = serializers.DecimalField(max_digits=10, decimal_places=2)
    average_profit_margin = serializers.DecimalField(max_digits=10, decimal_places=2)
    average_profit = serializers.DecimalField(max_digits=10, decimal_places=2)
    average_selling_price_with_discount = serializers.DecimalField(max_digits=10, decimal_places=2)
    top_performing_products = ProductPerformanceSerializer(many=True)
    low_performing_products = ProductPerformanceSerializer(many=True)
    sales_by_product = SalesByProductSerializer(many=True)
    profit_by_product = ProfitByProductSerializer(many=True)

class OnlinePreorderTopProductSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    product_name = serializers.CharField()
    category_name = serializers.CharField()
    total_sales = serializers.DecimalField(max_digits=10, decimal_places=2)
    quantity_sold = serializers.IntegerField()
    total_profit = serializers.DecimalField(max_digits=10, decimal_places=2)

class OnlinePreorderTopCategorySerializer(serializers.Serializer):
    category_name = serializers.CharField()
    total_sales = serializers.DecimalField(max_digits=10, decimal_places=2)
    quantity_sold = serializers.IntegerField()
    total_profit = serializers.DecimalField(max_digits=10, decimal_places=2)
    order_count = serializers.IntegerField()

class OnlinePreorderAnalyticsSerializer(serializers.Serializer):
    total_orders = serializers.IntegerField()
    total_sales_count = serializers.IntegerField()
    total_revenue = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_profit = serializers.DecimalField(max_digits=10, decimal_places=2)
    average_order_value = serializers.DecimalField(max_digits=10, decimal_places=2)
    top_products = OnlinePreorderTopProductSerializer(many=True)
    top_categories = OnlinePreorderTopCategorySerializer(many=True)
    sales_by_date = serializers.ListField(child=serializers.DictField())
    status_breakdown = serializers.DictField() 