from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.db.models import Sum, F, Q, Count, Avg
from django.utils import timezone
from datetime import datetime, timedelta
from django.db import transaction
from .models import Sale, SaleItem, Payment, Return, ReturnItem
from .serializers import (
    SaleSerializer, SaleItemSerializer, PaymentSerializer,
    ReturnSerializer, ReturnItemSerializer
)
from apps.inventory.models import Product, ProductVariation, StockMovement, InventoryAlert, Category
from apps.customer.models import Customer

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class SaleViewSet(viewsets.ModelViewSet):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['invoice_number', 'customer__name', 'customer_phone', 'staff__username']
    ordering_fields = ['date', 'total', 'status']
    ordering = ['-date']
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by date range
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        if start_date and end_date:
            queryset = queryset.filter(
                date__range=[start_date, end_date]
            )
        
        # Filter by status
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
        
        # Filter by payment method
        payment_method = self.request.query_params.get('payment_method')
        if payment_method:
            queryset = queryset.filter(payment_method=payment_method)
        
        # Filter by customer phone
        customer_phone = self.request.query_params.get('customer_phone')
        if customer_phone:
            queryset = queryset.filter(customer_phone=customer_phone)
        
        return queryset

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            sale = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        
        try:
            sale = serializer.save()
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def add_payment(self, request, pk=None):
        sale = self.get_object()
        serializer = PaymentSerializer(data=request.data)
        
        if serializer.is_valid():
            payment = serializer.save(sale=sale)
            return Response(PaymentSerializer(payment).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def create_return(self, request, pk=None):
        sale = self.get_object()
        serializer = ReturnSerializer(data=request.data)
        
        if serializer.is_valid():
            return_order = serializer.save(sale=sale)
            return Response(ReturnSerializer(return_order).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def customer_lookup(self, request):
        """Lookup customer by phone number"""
        phone = request.query_params.get('phone')
        if not phone:
            return Response(
                {'error': 'Phone number is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            customer = Customer.objects.get(phone=phone)
            return Response({
                'exists': True,
                'customer': {
                    'id': customer.id,
                    'name': customer.name,
                    'phone': customer.phone,
                    'email': customer.email
                }
            })
        except Customer.DoesNotExist:
            return Response({
                'exists': False,
                'message': 'Customer not found'
            })

    @action(detail=False, methods=['get'])
    def dashboard_stats(self, request):
        today = timezone.now().date()
        start_of_month = today.replace(day=1)
        
        # Today's sales with more detailed metrics using Sale model
        today_sales = Sale.objects.filter(
            date__date=today,
            status='completed'
        ).aggregate(
            total_sales=Sum('total'),
            total_transactions=Count('id'),
            total_profit=Sum('total_profit'),
            total_customers=Count('customer', distinct=True),
            total_loss=Sum('total_loss'),
            average_transaction_value=Avg('total'),
            total_discount=Sum('discount')
        )
        
        # Monthly sales with more detailed metrics using Sale model
        monthly_sales = Sale.objects.filter(
            date__date__gte=start_of_month,
            status='completed'
        ).aggregate(
            total_sales=Sum('total'),
            total_transactions=Count('id'),
            total_profit=Sum('total_profit'),
            total_customers=Count('customer', distinct=True),
            total_loss=Sum('total_loss'),
            average_transaction_value=Avg('total'),
            total_discount=Sum('discount')
        )

        # Customer analytics
        customer_analytics = {
            'new_customers_today': Customer.objects.filter(
                created_at__date=today
            ).count(),
            'active_customers_today': Sale.objects.filter(
                date__date=today,
                status='completed'
            ).values('customer').distinct().count(),
            'customer_retention_rate': self._calculate_customer_retention_rate(),
            'top_customers': Sale.objects.filter(
                date__date__gte=start_of_month,
                status='completed'
            ).values(
                'customer__first_name',
                'customer__last_name',
                'customer__phone'
            ).annotate(
                total_spent=Sum('total'),
                visit_count=Count('id')
            ).order_by('-total_spent')[:5]
        }

        # Format customer names
        for customer in customer_analytics['top_customers']:
            customer['customer__name'] = f"{customer['customer__first_name']} {customer['customer__last_name']}".strip()
            del customer['customer__first_name']
            del customer['customer__last_name']

        # Payment method distribution
        payment_method_distribution = Sale.objects.filter(
            date__date__gte=start_of_month,
            status='completed'
        ).values('payment_method').annotate(
            count=Count('id'),
            total=Sum('total')
        ).order_by('-total')

        # Sales by hour distribution
        sales_by_hour = []
        for hour in range(24):
            hour_sales = Sale.objects.filter(
                date__date=today,
                date__hour=hour,
                status='completed'
            ).aggregate(
                count=Count('id'),
                total=Sum('total')
            )
            sales_by_hour.append({
                'hour': hour,
                'count': hour_sales['count'] or 0,
                'total': hour_sales['total'] or 0
            })

        # Top selling products
        top_products = SaleItem.objects.filter(
            sale__date__date__gte=start_of_month,
            sale__status='completed'
        ).values(
            'product__name'
        ).annotate(
            total_quantity=Sum('quantity'),
            total_revenue=Sum('total'),
            total_profit=Sum('profit')
        ).order_by('-total_quantity')[:5]

        # Sales trend data
        period = request.query_params.get('period', '7d')
        if period == '7d':
            start_date = today - timedelta(days=7)
        elif period == '30d':
            start_date = today - timedelta(days=30)
        elif period == '90d':
            start_date = today - timedelta(days=90)
        else:
            start_date = today - timedelta(days=7)

        sales_trend = Sale.objects.filter(
            date__date__gte=start_date,
            date__date__lte=today,
            status='completed'
        ).values('date__date').annotate(
            sales=Sum('total'),
            profit=Sum('total_profit'),
            orders=Count('id')
        ).order_by('date__date')

        # Sales distribution by category
        sales_distribution = SaleItem.objects.filter(
            sale__date__date__gte=start_of_month,
            sale__status='completed'
        ).values(
            'product__category__name'
        ).annotate(
            value=Sum('total'),
            profit=Sum('profit')
        ).order_by('-value')

        # Category distribution
        category_distribution = Category.objects.annotate(
            product_count=Count('products'),
            total_value=Sum(F('products__stock_quantity') * F('products__cost_price'))
        ).values('name', 'product_count', 'total_value')

        # Recent alerts
        recent_alerts = InventoryAlert.objects.filter(
            is_active=True
        ).order_by('-created_at')[:5]

        # Stock movement trends
        movement_trends = StockMovement.objects.filter(
            created_at__date__gte=start_date,
            created_at__date__lte=today
        ).values('created_at__date').annotate(
            stock_in=Sum('quantity', filter=Q(movement_type='IN')),
            stock_out=Sum('quantity', filter=Q(movement_type='OUT'))
        ).order_by('created_at__date')

        return Response({
            'today': today_sales,
            'monthly': monthly_sales,
            'customer_analytics': customer_analytics,
            'payment_method_distribution': list(payment_method_distribution),
            'sales_by_hour': sales_by_hour,
            'top_products': list(top_products),
            'sales_trend': list(sales_trend),
            'sales_distribution': list(sales_distribution),
            'category_distribution': list(category_distribution),
            'recent_alerts': list(recent_alerts),
            'movement_trends': list(movement_trends)
        })

    def _calculate_customer_retention_rate(self):
        """Calculate customer retention rate for the current month"""
        today = timezone.now().date()
        start_of_month = today.replace(day=1)
        
        # Get total customers from previous month
        last_month_start = (start_of_month - timedelta(days=1)).replace(day=1)
        last_month_end = start_of_month - timedelta(days=1)
        
        previous_month_customers = Sale.objects.filter(
            date__date__range=[last_month_start, last_month_end],
            status='completed'
        ).values('customer').distinct().count()
        
        if previous_month_customers == 0:
            return 0
        
        # Get returning customers this month
        returning_customers = Sale.objects.filter(
            date__date__gte=start_of_month,
            status='completed'
        ).values('customer').distinct().count()
        
        return (returning_customers / previous_month_customers) * 100

    @transaction.atomic
    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            
            # Delete associated items and update inventory
            for item in instance.items.all():
                # Restore stock for non-completed sales
                if instance.status in ['pending', 'cancelled']:
                    variation = item.product_variation
                    if variation:
                        variation.stock += item.quantity
                        variation.save()
            
            # Delete the sale
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['post'])
    @transaction.atomic
    def bulk_delete(self, request):
        """Delete multiple sales at once"""
       

    @action(detail=False, methods=['post'])
    @transaction.atomic
    def delete_all_sales(self, request):
        """Delete all sales data"""
        try:
            # Get count before deletion
            total_count = Sale.objects.count()
            
            # Simple direct deletion of all sales
            Sale.objects.all().delete()
            
            return Response({
                'message': f'Successfully deleted all {total_count} sales',
                'deleted_count': total_count
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['transaction_id', 'sale__invoice_number']
    ordering_fields = ['payment_date', 'amount', 'status']
    ordering = ['-payment_date']

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by date range
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        if start_date and end_date:
            queryset = queryset.filter(
                payment_date__range=[start_date, end_date]
            )
        
        # Filter by status
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
        
        # Filter by payment method
        payment_method = self.request.query_params.get('payment_method')
        if payment_method:
            queryset = queryset.filter(payment_method=payment_method)
        
        return queryset

class ReturnViewSet(viewsets.ModelViewSet):
    queryset = Return.objects.all()
    serializer_class = ReturnSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['return_number', 'sale__invoice_number']
    ordering_fields = ['created_at', 'status', 'refund_amount']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by date range
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        if start_date and end_date:
            queryset = queryset.filter(
                created_at__range=[start_date, end_date]
            )
        
        # Filter by status
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
        
        return queryset

    def create(self, request, *args, **kwargs):
        items_data = request.data.pop('items', [])
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Create return with items
        return_order = serializer.save(items=items_data)
        
        # Update product stock
        for item_data in items_data:
            sale_item = SaleItem.objects.get(id=item_data['sale_item_id'])
            product = sale_item.product
            if sale_item.variation:
                variation = sale_item.variation
                variation.stock += item_data['quantity']
                variation.save()
            else:
                product.stock_quantity += item_data['quantity']
                product.save()
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        return_order = self.get_object()
        if return_order.status != 'pending':
            return Response(
                {'error': 'Only pending returns can be approved'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return_order.status = 'approved'
        return_order.processed_by = request.user
        return_order.processed_date = timezone.now()
        return_order.save()
        
        return Response(self.get_serializer(return_order).data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        return_order = self.get_object()
        if return_order.status != 'pending':
            return Response(
                {'error': 'Only pending returns can be rejected'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return_order.status = 'rejected'
        return_order.processed_by = request.user
        return_order.processed_date = timezone.now()
        return_order.save()
        
        return Response(self.get_serializer(return_order).data)

    @action(detail=True, methods=['post'])
    def add_item(self, request, pk=None):
        return_order = self.get_object()
        serializer = ReturnItemSerializer(data=request.data)
        
        if serializer.is_valid():
            item = serializer.save(return_order=return_order)
            return Response(ReturnItemSerializer(item).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 