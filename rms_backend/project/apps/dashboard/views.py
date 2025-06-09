from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum, Count, F, Q, Max
from django.utils import timezone
from datetime import timedelta
from .models import DashboardMetrics
from apps.sales.models import Sale
from apps.expenses.models import Expense, ExpenseCategory
from apps.customer.models import Customer
from apps.inventory.models import Product
from apps.supplier.models import Supplier

class DashboardStatsView(APIView):
    def get(self, request):
        today = timezone.now().date()
        thirty_days_ago = today - timedelta(days=30)
        
        # Get today's metrics
        today_sales = Sale.objects.filter(
            date__date=today,
            status='completed'
        ).aggregate(total=Sum('total'))['total'] or 0
        
        today_expenses = Expense.objects.filter(date=today).aggregate(total=Sum('amount'))['total'] or 0
        today_profit = today_sales - today_expenses
        
        # Get monthly metrics
        monthly_sales = Sale.objects.filter(
            date__date__gte=thirty_days_ago,
            status='completed'
        ).aggregate(total=Sum('total'))['total'] or 0
        
        monthly_expenses = Expense.objects.filter(date__gte=thirty_days_ago).aggregate(total=Sum('amount'))['total'] or 0
        monthly_profit = monthly_sales - monthly_expenses
        
        # Get counts
        total_customers = Customer.objects.count()
        total_products = Product.objects.count()
        total_suppliers = Supplier.objects.count()
        
        # Get sales trend
        sales_trend = Sale.objects.filter(
            date__date__gte=thirty_days_ago,
            status='completed'
        ).values('date__date')\
            .annotate(total=Sum('total'))\
            .order_by('date__date')
            
        # Get expense trend
        expense_trend = Expense.objects.filter(date__gte=thirty_days_ago)\
            .values('date')\
            .annotate(amount=Sum('amount'))\
            .order_by('date')
            
        # Get top selling products
        top_products = Product.objects.annotate(
            total_sales=Sum('saleitem__quantity')
        ).order_by('-total_sales')[:5]
        
        # Get expense categories
        expense_categories = ExpenseCategory.objects.annotate(
            amount=Sum('expenses__amount')
        ).values('name', 'amount').order_by('-amount')
        
        # Get low stock items
        low_stock_items = Product.objects.filter(
            Q(stock_quantity__lte=F('minimum_stock'))
        ).values('name', 'stock_quantity', 'minimum_stock')[:5]
        
        # Get recent suppliers
        recent_suppliers = Supplier.objects.filter(is_active=True)[:6]
        
        return Response({
            'today': {
                'sales': today_sales,
                'expenses': today_expenses,
                'profit': today_profit,
            },
            'monthly': {
                'sales': monthly_sales,
                'expenses': monthly_expenses,
                'profit': monthly_profit,
            },
            'counts': {
                'customers': total_customers,
                'products': total_products,
                'suppliers': total_suppliers,
            },
            'sales_trend': list(sales_trend),
            'expense_trend': list(expense_trend),
            'top_products': [
                {
                    'name': product.name,
                    'total_sales': product.total_sales or 0
                } for product in top_products
            ],
            'expense_categories': list(expense_categories),
            'low_stock_items': list(low_stock_items),
            'recent_suppliers': [
                {
                    'name': supplier.company_name,
                    'phone': supplier.phone,
                    'email': supplier.email,
                    'address': supplier.address
                } for supplier in recent_suppliers
            ]
        }) 