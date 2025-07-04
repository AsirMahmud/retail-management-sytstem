from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Count, Avg, F, Q, DecimalField, Max, OuterRef, Subquery, Case, When, Value, CharField, DateField
from django.db.models.functions import Coalesce, Cast, TruncDate
from django.utils import timezone
from datetime import timedelta, datetime, time
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
from apps.preorder.models import Preorder, PreorderProduct
import logging

logger = logging.getLogger(__name__)

class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer

    def _get_date_range(self, request):
        date_from_str = request.query_params.get('date_from')
        date_to_str = request.query_params.get('date_to')

        if not date_from_str or not date_to_str:
            return None, None, Response({"error": "date_from and date_to parameters are required."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            date_from = timezone.make_aware(datetime.strptime(date_from_str, '%Y-%m-%d'))
            date_to = timezone.make_aware(datetime.combine(datetime.strptime(date_to_str, '%Y-%m-%d'), time.max))
        except ValueError:
            return None, None, Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

        return date_from, date_to, None

    @action(detail=False, methods=['get'])
    def overview(self, request):
        date_from, date_to, error = self._get_date_range(request)
        if error:
            return error

        # Sales data
        sales = Sale.objects.filter(date__range=[date_from, date_to], status='completed')
        total_sales = sales.aggregate(total=Sum('total'))['total'] or Decimal('0.00')
        total_orders = sales.count()
        
        # Expense data
        expenses = Expense.objects.filter(date__range=[date_from, date_to], status='APPROVED')
        total_expenses = expenses.aggregate(total=Sum('amount'))['total'] or Decimal('0.00')

        # Profit & Loss data
        total_profit = sales.aggregate(total=Sum('total_profit'))['total'] or Decimal('0.00')
        net_profit = total_profit # Simplified for overview
        profit_margin = (net_profit / total_sales * 100) if total_sales > 0 else Decimal('0.00')

        # Preorder analysis
        preorders = Preorder.objects.filter(created_at__range=[date_from, date_to])
        preorder_status_breakdown = {}
        for status_choice in Preorder.STATUS_CHOICES:
            preorder_status_breakdown[status_choice[0]] = preorders.filter(status=status_choice[0]).count()
        # Only count revenue and profit for COMPLETED preorders
        completed_preorders = preorders.filter(status='COMPLETED')
        preorder_total_orders = completed_preorders.count()
        preorder_total_revenue = completed_preorders.aggregate(total=Sum('total_amount'))['total'] or Decimal('0.00')
        preorder_profit = completed_preorders.aggregate(total=Sum('profit'))['total'] or Decimal('0.00')

        # Data for charts
        sales_by_date = sales.values('date__date').annotate(date=F('date__date'), total=Sum('total')).order_by('date')
        expenses_by_date = expenses.values('date').annotate(total=Sum('amount')).order_by('date')

        data = {
            "total_sales": total_sales,
            "total_orders": total_orders,
            "total_expenses": total_expenses,
            "net_profit": net_profit,
            "profit_margin": profit_margin,
            "sales_by_date": list(sales_by_date),
            "expenses_by_date": list(expenses_by_date),
            # Preorder analytics
            "preorder_total_orders": preorder_total_orders,
            "preorder_total_revenue": preorder_total_revenue,
            "preorder_profit": preorder_profit,
            "preorder_status_breakdown": preorder_status_breakdown,
        }
        
        return Response(data)

    @action(detail=False, methods=['get'])
    def sales(self, request):
        date_from, date_to, error = self._get_date_range(request)
        if error:
            return error
        
        sales = Sale.objects.filter(
            date__range=[date_from, date_to],
            status='completed'
        )

        total_sales = sales.aggregate(total=Sum('total'))['total'] or Decimal('0.00')
        total_orders = sales.count()
        total_items_sold = sales.aggregate(total_items=Sum('items__quantity'))['total_items'] or 0

        average_order_value = total_sales / total_orders if total_orders > 0 else Decimal('0.00')
        average_item_price = total_sales / total_items_sold if total_items_sold > 0 else Decimal('0.00')

        # Sales by date
        sales_by_date = sales.values('date__date').annotate(
            date=F('date__date'),
            total=Sum('total'),
            items_count=Sum('items__quantity')
        ).order_by('date__date')

        # Sales by category
        sales_by_category = SaleItem.objects.filter(
            sale__in=sales
        ).values(
            'product__category__name'
        ).annotate(
            category_name=F('product__category__name'),
            total=Sum('total'),
            items_count=Count('id'),
            quantity_sold=Sum('quantity')
        ).order_by('-total')

        # Top products
        top_products = SaleItem.objects.filter(
            sale__in=sales
        ).values(
            'product__name',
            'product__category__name'
        ).annotate(
            product_name=F('product__name'),
            category_name=F('product__category__name'),
            total_sales=Sum('total'),
            quantity_sold=Sum('quantity'),
            average_price=Avg('unit_price'),
            profit=Sum('profit')
        ).order_by('-total_sales')[:10]

        # Payment methods
        payment_methods = sales.values(
            'payment_method'
        ).annotate(
            total=Sum('total'),
            orders_count=Count('id'),
            items_count=Sum('items__quantity')
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
        date_from, date_to, error = self._get_date_range(request)
        if error:
            return error

        expenses = Expense.objects.filter(
            date__range=[date_from, date_to],
            status='APPROVED'
        )

        total_expenses = expenses.aggregate(total=Sum('amount'))['total'] or Decimal('0.00')

        # Expenses by category
        expenses_by_category = expenses.values(
            'category__name'
        ).annotate(
            category_name=F('category__name'),
            total=Sum('amount'),
            count=Count('id')
        ).order_by('-total')

        # Expenses by date
        expenses_by_date = expenses.annotate(
            expense_date=Cast('date', DateField())
        ).values('expense_date').annotate(
            amount=Sum('amount'),
            count=Count('id')
        ).order_by('expense_date')

        # Simplified expenses over time for charting
        expenses_over_time = [
            {'date': e['expense_date'], 'amount': e['amount']} for e in expenses_by_date
        ]

        data = {
            'total_expenses': total_expenses,
            'expenses_by_category': list(expenses_by_category),
            'expenses_by_date': list(expenses_by_date),
            'expenses_over_time': expenses_over_time,
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
        ).annotate(
            stock=F('stock_quantity'),
            reorder_level=F('minimum_stock'),
            price=F('selling_price')
        ).order_by('stock_quantity')

        # Stock by category
        stock_by_category = products.values(
            'category__name'
        ).annotate(
            category_name=F('category__name'),
            total_products=Count('id'),
            total_stock=Sum('stock_quantity'),
            total_value=Sum(F('stock_quantity') * F('selling_price'))
        ).order_by('-total_value')

        # Stock movements
        stock_movements = StockMovement.objects.values(
            'created_at__date', 'movement_type'
        ).annotate(
            date=F('created_at__date'),
            total_quantity=Sum('quantity'),
            total_value=Sum(F('quantity') * F('product__cost_price'))
        ).order_by('-created_at__date')[:30]

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
        date_from, date_to, error = self._get_date_range(request)
        if error:
            return error

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
        active_customers_count = sales.values('customer').distinct().count()
        average_customer_value = total_sales / active_customers_count if active_customers_count > 0 else Decimal('0.00')

        # Top customers
        top_customers = sales.values('customer_id').annotate(
            first_name=F('customer__first_name'),
            last_name=F('customer__last_name'),
            phone=F('customer__phone'),
            total_sales=Sum('total'),
            items_purchased=Sum('items__quantity'),
            unique_products=Count('items__product', distinct=True),
            last_purchase_date=Cast(Max('date'), DateField())
        ).order_by('-total_sales')[:10]

        # Customer acquisition
        customer_acquisition = Customer.objects.filter(
            created_at__range=[date_from, date_to]
        ).annotate(date=TruncDate('created_at')).values('date').annotate(
            new_customers=Count('id')
        ).order_by('date')

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
        date_from, date_to, error = self._get_date_range(request)
        if error:
            return error

        categories = Category.objects.all()
        total_categories = categories.count()
        total_products = Product.objects.count()

        # Sales by category
        sales_by_category = SaleItem.objects.filter(
            sale__date__range=[date_from, date_to]
        ).values('product__category__name').annotate(
            category_name=F('product__category__name'),
            total_sales=Sum('total'),
            items_sold=Sum('quantity'),
            unique_products=Count('product', distinct=True)
        ).order_by('-total_sales')

        # Stock by category
        stock_by_category = Product.objects.values(
            'category__name'
        ).annotate(
            category_name=F('category__name'),
            total_products=Count('id'),
            total_stock=Sum('stock_quantity'),
            total_value=Sum(F('stock_quantity') * F('selling_price'))
        ).order_by('-total_value')

        # Top categories by sales
        top_categories = Category.objects.annotate(
            total_sales=Coalesce(Sum(
                'products__saleitem__total',
                filter=Q(products__saleitem__sale__date__range=[date_from, date_to])
            ), Decimal('0.00')),
            items_sold=Coalesce(Sum(
                'products__saleitem__quantity',
                filter=Q(products__saleitem__sale__date__range=[date_from, date_to])
            ), 0),
            product_count=Count('products', distinct=True)
        ).annotate(
            average_price=Case(
                When(items_sold__gt=0, then=F('total_sales') / F('items_sold')),
                default=Decimal('0.0'),
                output_field=DecimalField()
            )
        ).order_by('-total_sales')[:10]

        data = {
            'total_categories': total_categories,
            'total_products': total_products,
            'sales_by_category': list(sales_by_category),
            'stock_by_category': list(stock_by_category),
            'top_categories': top_categories.values(
                'name', 'total_sales', 'items_sold', 'product_count', 'average_price'
            )
        }
        serializer = CategoryReportSerializer(data)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='profit-loss')
    def profit_loss(self, request):
        date_from, date_to, error = self._get_date_range(request)
        if error:
            return error

        # Sales and profit
        sales = Sale.objects.filter(
            date__range=[date_from, date_to],
            status='completed'
        )
        total_revenue = sales.aggregate(total=Sum('total'))['total'] or Decimal('0.00')
        total_profit = sales.aggregate(total=Sum('total_profit'))['total'] or Decimal('0.00')

        # Expenses
        expenses = Expense.objects.filter(
            date__range=[date_from, date_to],
            status='APPROVED'
        )
        total_expenses = expenses.aggregate(total=Sum('amount'))['total'] or Decimal('0.00')

        net_profit = total_revenue - total_expenses
        profit_margin = (net_profit / total_revenue * 100) if total_revenue > 0 else Decimal('0.00')

        # Preorder analysis
        preorders = Preorder.objects.filter(created_at__range=[date_from, date_to])
        preorder_status_breakdown = {}
        for status_choice in Preorder.STATUS_CHOICES:
            preorder_status_breakdown[status_choice[0]] = preorders.filter(status=status_choice[0]).count()
        # Only count revenue and profit for COMPLETED preorders
        completed_preorders = preorders.filter(status='COMPLETED')
        preorder_total_orders = completed_preorders.count()
        preorder_total_revenue = completed_preorders.aggregate(total=Sum('total_amount'))['total'] or Decimal('0.00')
        preorder_profit = completed_preorders.aggregate(total=Sum('profit'))['total'] or Decimal('0.00')

        # Revenue by date
        revenue_by_date = sales.annotate(
            sale_date=Cast('date', DateField())
        ).values('sale_date').annotate(
            revenue=Sum('total'),
            items_sold=Sum('items__quantity')
        ).order_by('sale_date')

        # Expenses by date
        expenses_by_date = expenses.annotate(
            expense_date=Cast('date', DateField())
        ).values('expense_date').annotate(
            amount=Sum('amount'),
            count=Count('id')
        ).order_by('expense_date')

        # Simplified expenses over time for charting
        expenses_over_time = [
            {'date': e['expense_date'], 'amount': e['amount']} for e in expenses_by_date
        ]

        # --- Combine revenue and expenses by date for charting ---
        from collections import defaultdict
        import datetime
        # Normalize date keys to string for correct matching
        revenue_map = {str(r['sale_date']): r['revenue'] for r in revenue_by_date}
        expense_map = {str(e['expense_date']): e['amount'] for e in expenses_by_date}
        all_dates = set(revenue_map.keys()) | set(expense_map.keys())
        revenue_vs_expense_by_date = []
        for d in sorted(all_dates):
            revenue_vs_expense_by_date.append({
                'date': d,
                'revenue': revenue_map.get(d, 0),
                'expense': expense_map.get(d, 0)
            })
        # ---

        # Profit by category
        profit_by_category = SaleItem.objects.filter(
            sale__date__range=[date_from, date_to],
            sale__status='completed'
        ).values('product__category__name').annotate(
            category_name=F('product__category__name'),
            revenue=Sum('total'),
            cost=Sum('product__cost_price'),
            profit=Sum('profit'),
            items_sold=Sum('quantity')
        ).order_by('-profit')

        data = {
            'total_revenue': total_revenue,
            'total_expenses': total_expenses,
            'net_profit': net_profit,
            'profit_margin': profit_margin,
            'revenue_by_date': list(revenue_by_date),
            'expenses_by_date': list(expenses_by_date),
            'expenses_over_time': expenses_over_time,
            'revenue_vs_expense_by_date': revenue_vs_expense_by_date,
            'profit_by_category': list(profit_by_category),
            # Preorder analytics
            'preorder_total_orders': preorder_total_orders,
            'preorder_total_revenue': preorder_total_revenue,
            'preorder_profit': preorder_profit,
            'preorder_status_breakdown': preorder_status_breakdown,
        }
        serializer = ProfitLossReportSerializer(data)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='product-performance')
    def product_performance(self, request):
        date_from, date_to, error = self._get_date_range(request)
        if error:
            return error

        sales_items = SaleItem.objects.filter(sale__date__range=[date_from, date_to], sale__status='completed')
        
        products = Product.objects.all()
        total_products = products.count()
        total_sales = sales_items.aggregate(total=Sum('total'))['total'] or Decimal('0.00')
        total_profit = sales_items.aggregate(total=Sum('profit'))['total'] or Decimal('0.00')
        average_profit_margin = (total_profit / total_sales * 100) if total_sales > 0 else Decimal('0.00')

        # Top performing products
        top_performing_products = sales_items.values(
            'product__name', 'product__category__name'
        ).annotate(
            product_name=F('product__name'),
            category_name=F('product__category__name'),
            total_sales=Sum('total'),
            quantity_sold=Sum('quantity'),
            total_profit=Sum('profit'),
            average_price=Avg('unit_price')
        ).annotate(
            average_profit_margin=Case(
                When(total_sales__gt=0, then=(F('total_profit') / F('total_sales')) * 100),
                default=Decimal('0.0'),
                output_field=DecimalField()
            )
        ).order_by('-total_profit')[:10]

        # Low performing products
        low_performing_products = sales_items.values(
            'product__name', 'product__category__name'
        ).annotate(
            product_name=F('product__name'),
            category_name=F('product__category__name'),
            total_sales=Sum('total'),
            quantity_sold=Sum('quantity'),
            total_profit=Sum('profit'),
            average_price=Avg('unit_price')
        ).annotate(
            average_profit_margin=Case(
                When(total_sales__gt=0, then=(F('total_profit') / F('total_sales')) * 100),
                default=Decimal('0.0'),
                output_field=DecimalField()
            )
        ).order_by('total_profit')[:10]

        # Sales by product
        sales_by_product = sales_items.values('product__name').annotate(
            product_name=F('product__name'),
            total_sales=Sum('total'),
            quantity_sold=Sum('quantity'),
            average_price=Avg('unit_price')
        ).order_by('-total_sales')

        # Profit by product
        profit_by_product = sales_items.values('product__name').annotate(
            product_name=F('product__name'),
            total_sales=Sum('total'),
            total_profit=Sum('profit'),
            quantity_sold=Sum('quantity')
        ).annotate(
            profit_margin=Case(
                When(total_sales__gt=0, then=(F('total_profit') / F('total_sales')) * 100),
                default=Decimal('0.0'),
                output_field=DecimalField()
            )
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