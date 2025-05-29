from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, F, Q, Count
from django.utils import timezone
from datetime import datetime, timedelta
from .models import Sale, SaleItem, Payment, Return, ReturnItem
from .serializers import (
    SaleSerializer, SaleItemSerializer, PaymentSerializer,
    ReturnSerializer, ReturnItemSerializer
)
from apps.inventory.models import Product, ProductVariation
from apps.customer.models import Customer

class SaleViewSet(viewsets.ModelViewSet):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['invoice_number', 'customer__name', 'customer_phone', 'staff__username']
    ordering_fields = ['date', 'total', 'status']
    ordering = ['-date']

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

    def create(self, request, *args, **kwargs):
        items_data = request.data.pop('items', [])
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Create sale with items
        sale = serializer.save(items=items_data)
        
        # Update product stock
        for item_data in items_data:
            product = Product.objects.get(id=item_data['product_id'])
            if item_data.get('variation_id'):
                variation = ProductVariation.objects.get(id=item_data['variation_id'])
                variation.stock -= item_data['quantity']
                variation.save()
            else:
                product.stock_quantity -= item_data['quantity']
                product.save()
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)

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
        
        # Today's sales
        today_sales = Sale.objects.filter(
            date__date=today,
            status='completed'
        ).aggregate(
            total_sales=Sum('total'),
            total_transactions=Count('id')
        )
        
        # Monthly sales
        monthly_sales = Sale.objects.filter(
            date__date__gte=start_of_month,
            status='completed'
        ).aggregate(
            total_sales=Sum('total'),
            total_transactions=Count('id')
        )
        
        # Top selling products
        top_products = SaleItem.objects.filter(
            sale__date__date__gte=start_of_month,
            sale__status='completed'
        ).values(
            'product__name'
        ).annotate(
            total_quantity=Sum('quantity'),
            total_revenue=Sum('total')
        ).order_by('-total_quantity')[:5]
        
        return Response({
            'today': today_sales,
            'monthly': monthly_sales,
            'top_products': top_products
        })

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