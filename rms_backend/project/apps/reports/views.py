from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Count, Avg, F, Q
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal
from .models import Report, ReportMetric, ReportDataPoint, SavedReport
from .serializers import (
    ReportSerializer, SavedReportSerializer,
    SalesReportSerializer, ExpenseReportSerializer,
    InventoryReportSerializer, CustomerReportSerializer,
    CategoryReportSerializer, ProfitLossReportSerializer,
    ProductPerformanceReportSerializer
)
from apps.sales.models import Sale, SaleItem
from apps.expenses.models import Expense, ExpenseCategory
from apps.inventory.models import Product, Category, StockMovement
from apps.customer.models import Customer

class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer

    @action(detail=False, methods=['get'])
    def sales(self, request):
        date_from = request.query_params.get('date_from')
        date_to = request.query_params.get('date_to')

        sales = Sale.objects.filter(
            date__range=[date_from, date_to],
            status='completed'
        )

        total_sales = sales.aggregate(total=Sum('total'))['total'] or Decimal('0.00')
        total_orders = sales.count()
        total_items_sold = SaleItem.objects.filter(sale__in=sales).aggregate(total=Sum('quantity'))['total'] or 0
        average_order_value = total_sales / total_orders if total_orders > 0 else Decimal('0.00')
        average_item_price = total_sales / total_items_sold if total_items_sold > 0 else Decimal('0.00')

        # Sales by date
        sales_by_date = sales.values('date__date').annotate(
            total=Sum('total'),
            count=Count('id')
        ).order_by('date__date')

        # Sales by category
        sales_by_category = SaleItem.objects.filter(
            sale__in=sales
        ).values(
            'product__category__name'
        ).annotate(
            total=Sum('total'),
            count=Count('id')
        ).order_by('-total')

        # Top products
        top_products = SaleItem.objects.filter(
            sale__in=sales
        ).values(
            'product__name'
        ).annotate(
            total=Sum('total'),
            quantity=Sum('quantity')
        ).order_by('-total')[:10]

        # Payment methods
        payment_methods = sales.values(
            'payment_method'
        ).annotate(
            total=Sum('total'),
            count=Count('id')
        ).order_by('-total')

        data = {
            'total_sales': total_sales,
            'total_orders': total_orders,
            'total_items_sold': total_items_sold,
            'average_order_value': average_order_value,
            'average_item_price': average_item_price,
            'sales_by_date': list(sales_by_date),
            'sales_by_category': list(sales_by_category),
            'top_products': list(top_products),
            'payment_methods': list(payment_methods)
        }

        serializer = SalesReportSerializer(data)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def expenses(self, request):
        date_from = request.query_params.get('date_from')
        date_to = request.query_params.get('date_to')

        expenses = Expense.objects.filter(
            date__range=[date_from, date_to],
            status='PAID'
        )

        total_expenses = expenses.aggregate(total=Sum('amount'))['total'] or Decimal('0.00')

        # Expenses by category
        expenses_by_category = expenses.values(
            'category__name'
        ).annotate(
            total=Sum('amount'),
            count=Count('id')
        ).order_by('-total')

        # Expenses by date
        expenses_by_date = expenses.values(
            'date'
        ).annotate(
            total=Sum('amount'),
            count=Count('id')
        ).order_by('date')

        # Payment methods
        payment_methods = expenses.values(
            'payment_method'
        ).annotate(
            total=Sum('amount'),
            count=Count('id')
        ).order_by('-total')

        data = {
            'total_expenses': total_expenses,
            'expenses_by_category': list(expenses_by_category),
            'expenses_by_date': list(expenses_by_date),
            'payment_methods': list(payment_methods)
        }

        serializer = ExpenseReportSerializer(data)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def inventory(self, request):
        products = Product.objects.all()
        total_products = products.count()
        total_stock_value = products.aggregate(
            total=Sum(F('stock_quantity') * F('selling_price'))
        )['total'] or Decimal('0.00')

        # Low stock items
        low_stock_items = products.filter(
            stock_quantity__lte=F('minimum_stock')
        ).values(
            'name', 'stock_quantity', 'minimum_stock', 'selling_price'
        ).order_by('stock_quantity')

        # Stock by category
        stock_by_category = products.values(
            'category__name'
        ).annotate(
            total_products=Count('id'),
            total_stock=Sum('stock_quantity'),
            total_value=Sum(F('stock_quantity') * F('selling_price'))
        ).order_by('-total_value')

        # Stock movements
        stock_movements = StockMovement.objects.all().values(
            'date', 'movement_type'
        ).annotate(
            total_quantity=Sum('quantity'),
            total_value=Sum(F('quantity') * F('unit_price'))
        ).order_by('-date')[:30]

        data = {
            'total_products': total_products,
            'total_stock_value': total_stock_value,
            'low_stock_items': list(low_stock_items),
            'stock_by_category': list(stock_by_category),
            'stock_movements': list(stock_movements)
        }

        serializer = InventoryReportSerializer(data)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def customers(self, request):
        date_from = request.query_params.get('date_from')
        date_to = request.query_params.get('date_to')

        customers = Customer.objects.all()
        total_customers = customers.count()
        new_customers = customers.filter(
            created_at__range=[date_from, date_to]
        ).count()

        # Calculate total sales and average customer value
        sales = Sale.objects.filter(
            date__range=[date_from, date_to],
            status='completed'
        )
        total_sales = sales.aggregate(total=Sum('total'))['total'] or Decimal('0.00')
        average_customer_value = total_sales / total_customers if total_customers > 0 else Decimal('0.00')

        # Top customers
        top_customers = sales.values(
            'customer__first_name',
            'customer__last_name',
            'customer__phone'
        ).annotate(
            total_sales=Sum('total'),
            order_count=Count('id')
        ).order_by('-total_sales')[:10]

        # Customer acquisition
        customer_acquisition = Customer.objects.values(
            'created_at__date'
        ).annotate(
            new_customers=Count('id')
        ).order_by('created_at__date')

        data = {
            'total_customers': total_customers,
            'new_customers': new_customers,
            'total_sales': total_sales,
            'average_customer_value': average_customer_value,
            'top_customers': list(top_customers),
            'customer_acquisition': list(customer_acquisition)
        }

        serializer = CustomerReportSerializer(data)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def categories(self, request):
        categories = Category.objects.all()
        total_categories = categories.count()
        total_products = Product.objects.count()

        # Sales by category
        sales_by_category = SaleItem.objects.values(
            'product__category__name'
        ).annotate(
            total_sales=Sum('total'),
            product_count=Count('product', distinct=True)
        ).order_by('-total_sales')

        # Stock by category
        stock_by_category = Product.objects.values(
            'category__name'
        ).annotate(
            total_stock=Sum('stock_quantity'),
            total_value=Sum(F('stock_quantity') * F('selling_price'))
        ).order_by('-total_value')

        # Top categories
        top_categories = Category.objects.annotate(
            total_sales=Sum('products__sale_items__total'),
            product_count=Count('products')
        ).order_by('-total_sales')[:10]

        data = {
            'total_categories': total_categories,
            'total_products': total_products,
            'sales_by_category': list(sales_by_category),
            'stock_by_category': list(stock_by_category),
            'top_categories': list(top_categories)
        }

        serializer = CategoryReportSerializer(data)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def profit_loss(self, request):
        date_from = request.query_params.get('date_from')
        date_to = request.query_params.get('date_to')

        # Calculate revenue and profit using Sale model
        sales = Sale.objects.filter(
            date__range=[date_from, date_to],
            status='completed'
        )
        total_revenue = sales.aggregate(total=Sum('total'))['total'] or Decimal('0.00')
        total_profit = sales.aggregate(profit=Sum('total_profit'))['profit'] or Decimal('0.00')
        total_loss = sales.aggregate(loss=Sum('total_loss'))['loss'] or Decimal('0.00')

        # Calculate expenses
        expenses = Expense.objects.filter(
            date__range=[date_from, date_to],
            status='PAID'
        )
        total_expenses = expenses.aggregate(total=Sum('amount'))['total'] or Decimal('0.00')

        # Calculate net profit and margin
        net_profit = total_profit - total_expenses
        profit_margin = (net_profit / total_revenue * 100) if total_revenue > 0 else Decimal('0.00')

        # Revenue by date
        revenue_by_date = sales.values(
            'date__date'
        ).annotate(
            revenue=Sum('total')
        ).order_by('date__date')

        # Expenses by date
        expenses_by_date = expenses.values(
            'date'
        ).annotate(
            amount=Sum('amount')
        ).order_by('date')

        # Profit by category using properly calculated profit fields
        profit_by_category = SaleItem.objects.filter(
            sale__in=sales
        ).values(
            'product__category__name'
        ).annotate(
            revenue=Sum('total'),
            profit=Sum('profit'),  # Use the properly calculated profit field
            items_sold=Sum('quantity')
        ).order_by('-profit')

        data = {
            'total_revenue': total_revenue,
            'total_expenses': total_expenses,
            'net_profit': net_profit,
            'profit_margin': profit_margin,
            'revenue_by_date': list(revenue_by_date),
            'expenses_by_date': list(expenses_by_date),
            'profit_by_category': [
                {
                    'category_name': item['product__category__name'] or 'Uncategorized',
                    'revenue': item['revenue'],
                    'cost': item['revenue'] - item['profit'],  # Calculate cost from revenue and profit
                    'profit': item['profit'],
                    'items_sold': item['items_sold']
                } for item in profit_by_category
            ]
        }

        serializer = ProfitLossReportSerializer(data)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def product_performance(self, request):
        date_from = request.query_params.get('date_from')
        date_to = request.query_params.get('date_to')

        # Get all products
        products = Product.objects.all()
        total_products = products.count()

        # Calculate sales and profit using Sale model
        sales = Sale.objects.filter(
            date__range=[date_from, date_to],
            status='completed'
        )
        total_sales = sales.aggregate(total=Sum('total'))['total'] or Decimal('0.00')
        total_profit = sales.aggregate(profit=Sum('total_profit'))['profit'] or Decimal('0.00')
        average_profit_margin = (total_profit / total_sales * 100) if total_sales > 0 else Decimal('0.00')

        # Top performing products using properly calculated profit fields
        top_performing_products = SaleItem.objects.filter(
            sale__in=sales
        ).values(
            'product__name',
            'product__category__name'
        ).annotate(
            total_sales=Sum('total'),
            total_profit=Sum('profit'),  # Use the properly calculated profit field
            quantity_sold=Sum('quantity'),
            profit_margin=(Sum('profit') / Sum('total') * 100)  # Calculate margin from profit field
        ).order_by('-total_profit')[:10]

        # Low performing products using properly calculated profit fields
        low_performing_products = SaleItem.objects.filter(
            sale__in=sales
        ).values(
            'product__name',
            'product__category__name'
        ).annotate(
            total_sales=Sum('total'),
            total_profit=Sum('profit'),  # Use the properly calculated profit field
            quantity_sold=Sum('quantity'),
            profit_margin=(Sum('profit') / Sum('total') * 100)  # Calculate margin from profit field
        ).order_by('total_profit')[:10]

        # Sales by product
        sales_by_product = SaleItem.objects.filter(
            sale__in=sales
        ).values(
            'product__name'
        ).annotate(
            total_sales=Sum('total'),
            quantity_sold=Sum('quantity'),
            average_price=Sum('total') / Sum('quantity')
        ).order_by('-total_sales')

        # Profit by product using properly calculated profit fields
        profit_by_product = SaleItem.objects.filter(
            sale__in=sales
        ).values(
            'product__name'
        ).annotate(
            total_profit=Sum('profit'),  # Use the properly calculated profit field
            profit_margin=(Sum('profit') / Sum('total') * 100)  # Calculate margin from profit field
        ).order_by('-total_profit')

        data = {
            'total_products': total_products,
            'total_sales': total_sales,
            'total_profit': total_profit,
            'average_profit_margin': average_profit_margin,
            'top_performing_products': list(top_performing_products),
            'low_performing_products': list(low_performing_products),
            'sales_by_product': list(sales_by_product),
            'profit_by_product': list(profit_by_product)
        }

        serializer = ProductPerformanceReportSerializer(data)
        return Response(serializer.data)

class SavedReportViewSet(viewsets.ModelViewSet):
    queryset = SavedReport.objects.all()
    serializer_class = SavedReportSerializer

    def perform_create(self, serializer):
        report = Report.objects.get(id=serializer.validated_data['report_id'])
        report.is_saved = True
        report.save()
        serializer.save(report=report) 