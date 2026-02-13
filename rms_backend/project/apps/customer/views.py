from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Sum, Count, Q
from .models import Customer
from .serializers import CustomerSerializer, TopCustomerSerializer

class CustomerPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

class CustomerViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing customer operations.
    Provides CRUD operations and additional filtering capabilities.
    """
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    pagination_class = CustomerPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['gender', 'is_active', 'customer_type']
    search_fields = ['first_name', 'last_name', 'email', 'phone']
    ordering_fields = ['created_at', 'first_name', 'last_name', 'ranking', 'total_sales', 'sales_count', 'last_sale_date']
    ordering = ['-created_at']

    def get_queryset(self):
        """Override to add ranking calculation and filtering"""
        # Start with base queryset
        queryset = Customer.objects.all()
        
        # Apply ranking calculation first
        queryset = queryset.annotate(
            total_sales=Sum('sale__total', filter=Q(sale__status='completed'))
        ).order_by('-total_sales')
        
        # Update rankings for all customers
        for rank, customer in enumerate(queryset, 1):
            if customer.ranking != rank:
                customer.ranking = rank
                customer.save(update_fields=['ranking'])
        
        # Start fresh queryset for filtering
        queryset = Customer.objects.all()
        
        # Apply search filter first (if search parameter is provided)
        search_query = self.request.query_params.get('search', None)
        if search_query:
            queryset = queryset.filter(
                Q(first_name__icontains=search_query) |
                Q(last_name__icontains=search_query) |
                Q(email__icontains=search_query) |
                Q(phone__icontains=search_query)
            )
        
        # Apply additional filtering based on query parameters
        ranking_filter = self.request.query_params.get('ranking_filter', None)
        if ranking_filter:
            if ranking_filter == 'top-20':
                queryset = queryset.filter(ranking__lte=20)
            elif ranking_filter == 'top-30':
                queryset = queryset.filter(ranking__lte=30)
            elif ranking_filter == 'top-50':
                queryset = queryset.filter(ranking__lte=50)
            elif ranking_filter == 'top-100':
                queryset = queryset.filter(ranking__lte=100)
        
        # Filter by sales value
        sales_filter = self.request.query_params.get('sales_filter', None)
        if sales_filter:
            if sales_filter == 'high-value':
                queryset = queryset.annotate(
                    total_sales=Sum('sale__total', filter=Q(sale__status='completed'))
                ).filter(total_sales__gt=1000)
            elif sales_filter == 'low-value':
                queryset = queryset.annotate(
                    total_sales=Sum('sale__total', filter=Q(sale__status='completed'))
                ).filter(total_sales__lt=100)
        
        # Filter by recent activity
        recent_filter = self.request.query_params.get('recent_filter', None)
        if recent_filter == 'recent':
            from datetime import datetime, timedelta
            thirty_days_ago = datetime.now() - timedelta(days=30)
            queryset = queryset.filter(
                sale__date__gte=thirty_days_ago,
                sale__status='completed'
            ).distinct()
        
        return queryset

    def perform_create(self, serializer):
        """Override to add any additional logic during customer creation"""
        serializer.save()

    @action(detail=False, methods=['get'])
    def active_customers(self, request):
        """Custom action to get only active customers"""
        active_customers = Customer.objects.filter(is_active=True)
        page = self.paginate_queryset(active_customers)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(active_customers, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def inactive_customers(self, request):
        """Custom action to get only inactive customers"""
        inactive_customers = Customer.objects.filter(is_active=False)
        page = self.paginate_queryset(inactive_customers)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(inactive_customers, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def top_customers(self, request):
        """Get top customers by total sales"""
        limit = int(request.query_params.get('limit', 5))
        top_customers = Customer.objects.annotate(
            total_sales=Sum('sale__total', filter=Q(sale__status='completed'))
        ).filter(
            total_sales__gt=0
        ).order_by('-total_sales')[:limit]
        
        serializer = TopCustomerSerializer(top_customers, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def customer_analytics(self, request):
        """Get customer analytics and statistics"""
        total_customers = Customer.objects.count()
        active_customers = Customer.objects.filter(is_active=True).count()
        
        # Get top customers for analysis
        top_customers = Customer.objects.annotate(
            total_sales=Sum('sale__total', filter=Q(sale__status='completed'))
        ).filter(
            total_sales__gt=0
        ).order_by('-total_sales')[:5]
        
        # Calculate average order value
        total_sales = Customer.objects.aggregate(
            total=Sum('sale__total', filter=Q(sale__status='completed'))
        )['total'] or 0
        
        total_orders = Customer.objects.aggregate(
            count=Count('sale', filter=Q(sale__status='completed'))
        )['count'] or 0
        
        average_order_value = total_sales / total_orders if total_orders > 0 else 0
        
        # Calculate due amounts
        total_due_amount = Customer.objects.aggregate(
            total=Sum('sale__amount_due', filter=Q(sale__amount_due__gt=0))
        )['total'] or 0
        
        # Calculate average discount
        total_discount = Customer.objects.aggregate(
            total=Sum('sale__discount', filter=Q(sale__status='completed'))
        )['total'] or 0
        
        average_discount = (total_discount / total_sales * 100) if total_sales > 0 else 0
        
        analytics = {
            'total_customers': total_customers,
            'active_customers': active_customers,
            'inactive_customers': total_customers - active_customers,
            'total_sales': total_sales,
            'total_orders': total_orders,
            'average_order_value': average_order_value,
            'total_due_amount': total_due_amount,
            'average_discount': average_discount,
            'top_customers': TopCustomerSerializer(top_customers, many=True).data
        }
        
        return Response(analytics)

    def destroy(self, request, *args, **kwargs):
        """Override to implement soft delete"""
        customer = self.get_object()
        customer.is_active = False
        customer.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
