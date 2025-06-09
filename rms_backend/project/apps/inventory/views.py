from rest_framework import viewsets, filters, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.db.models import Q, F, Sum, Count, Avg, Case, When, IntegerField
from django.utils import timezone
from datetime import datetime, timedelta
from django.db.models.functions import TruncDate, TruncMonth, TruncYear
from .models import Category, Product, ProductImage, ProductVariation, StockMovement, InventoryAlert
from apps.supplier.models import Supplier
from apps.supplier.serializers import SupplierSerializer
from .serializers import (
    CategorySerializer,
    ProductSerializer,
    ProductCreateSerializer,
    ProductVariationSerializer,
    ProductImageSerializer,
    StockMovementSerializer,
    InventoryAlertSerializer,
    BulkPriceUpdateSerializer,
    BulkImageUploadSerializer
)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Category.objects.prefetch_related('products')
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(name__icontains=search)
        # Only return root categories (those without parent)
        if self.action == 'list':
            return queryset.filter(parent=None)
        return queryset

    @action(detail=True, methods=['get'])
    def products(self, request, pk=None):
        category = self.get_object()
        products = category.products.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def stats(self, request, pk=None):
        category = self.get_object()
        total_products = category.products.count()
        active_products = category.products.filter(is_active=True).count()
        low_stock_products = category.products.filter(stock_quantity__lte=F('minimum_stock')).count()
        total_value = category.products.aggregate(
            total=Sum('selling_price' * 'stock_quantity')
        )['total'] or 0

        return Response({
            'total_products': total_products,
            'active_products': active_products,
            'low_stock_products': low_stock_products,
            'total_value': total_value
        })

class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'code', 'contact_person', 'email']

    def get_queryset(self):
        queryset = Supplier.objects.all()
        is_active = self.request.query_params.get('is_active', None)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active)
        return queryset

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'sku', 'description']
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ProductCreateSerializer
        return ProductSerializer

    def get_queryset(self):
        queryset = Product.objects.all()
        search = self.request.query_params.get('search', None)
        category = self.request.query_params.get('category', None)
        supplier = self.request.query_params.get('supplier', None)
        is_active = self.request.query_params.get('is_active', None)
        stock_status = self.request.query_params.get('stock_status', None)

        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(sku__icontains=search) |
                Q(description__icontains=search)
            )
        if category:
            queryset = queryset.filter(category_id=category)
        if supplier:
            queryset = queryset.filter(supplier_id=supplier)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active)
        if stock_status:
            if stock_status == 'low':
                queryset = queryset.filter(stock_quantity__lte=F('minimum_stock'))
            elif stock_status == 'out':
                queryset = queryset.filter(stock_quantity=0)

        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def bulk_price_update(self, request):
        serializer = BulkPriceUpdateSerializer(data=request.data)
        if serializer.is_valid():
            product_ids = serializer.validated_data['product_ids']
            price_adjustment = serializer.validated_data['price_adjustment']
            adjustment_type = serializer.validated_data['adjustment_type']

            products = Product.objects.filter(id__in=product_ids)
            
            for product in products:
                if adjustment_type == 'percentage':
                    new_price = product.price * (1 + price_adjustment / 100)
                else:
                    new_price = product.price + price_adjustment
                product.price = new_price
                product.save()

            return Response({'message': 'Prices updated successfully'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def upload_images(self, request, pk=None):
        product = self.get_object()
        serializer = BulkImageUploadSerializer(data=request.data)
        
        if serializer.is_valid():
            images = serializer.validated_data['images']
            is_primary = serializer.validated_data['is_primary']

            for image in images:
                ProductImage.objects.create(
                    product=product,
                    image=image,
                    is_primary=is_primary
                )

            return Response({'message': 'Images uploaded successfully'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def upload_image(self, request, pk=None):
        product = self.get_object()
        serializer = ProductImageSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(product=product)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def add_variant(self, request, pk=None):
        product = self.get_object()
        serializer = ProductVariationSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(product=product)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def variants(self, request, pk=None):
        product = self.get_object()
        variants = product.variations.all()
        serializer = ProductVariationSerializer(variants, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def images(self, request, pk=None):
        product = self.get_object()
        images = product.images.all()
        serializer = ProductImageSerializer(images, many=True)
        return Response(serializer.data)

class ProductVariationViewSet(viewsets.ModelViewSet):
    queryset = ProductVariation.objects.all()
    serializer_class = ProductVariationSerializer

    def get_queryset(self):
        queryset = ProductVariation.objects.all()
        product = self.request.query_params.get('product', None)
        variation_code = self.request.query_params.get('variation_code', None)
        is_active = self.request.query_params.get('is_active', None)
        
        if product:
            queryset = queryset.filter(product_id=product)
        if variation_code:
            queryset = queryset.filter(variation_code=variation_code)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active)
        return queryset

class ProductImageViewSet(viewsets.ModelViewSet):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        queryset = ProductImage.objects.all()
        product = self.request.query_params.get('product', None)
        is_primary = self.request.query_params.get('is_primary', None)
        
        if product:
            queryset = queryset.filter(product_id=product)
        if is_primary is not None:
            queryset = queryset.filter(is_primary=is_primary)
        return queryset

class StockMovementViewSet(viewsets.ModelViewSet):
    queryset = StockMovement.objects.all()
    serializer_class = StockMovementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        movement = serializer.save(created_by=self.request.user)
        
        # Update product stock
        product = movement.product
        if movement.movement_type == 'IN':
            product.stock_quantity += movement.quantity
        elif movement.movement_type == 'OUT':
            product.stock_quantity -= movement.quantity
        product.save()

        # Check for alerts
        if product.stock_quantity <= product.reorder_level:
            InventoryAlert.objects.create(
                product=product,
                alert_type='LOW',
                message=f'Low stock alert: {product.name} has {product.stock_quantity} units remaining'
            )
        elif product.stock_quantity == 0:
            InventoryAlert.objects.create(
                product=product,
                alert_type='OUT',
                message=f'Out of stock alert: {product.name} has no units remaining'
            )

    def get_queryset(self):
        queryset = StockMovement.objects.all()
        product_id = self.request.query_params.get('product', None)
        movement_type = self.request.query_params.get('type', None)
        
        if product_id:
            queryset = queryset.filter(product_id=product_id)
        if movement_type:
            queryset = queryset.filter(movement_type=movement_type)
            
        return queryset

class InventoryAlertViewSet(viewsets.ModelViewSet):
    queryset = InventoryAlert.objects.all()
    serializer_class = InventoryAlertSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = InventoryAlert.objects.all()
        is_active = self.request.query_params.get('active', None)
        alert_type = self.request.query_params.get('type', None)
        
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active)
        if alert_type:
            queryset = queryset.filter(alert_type=alert_type)
            
        return queryset

    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        alert = self.get_object()
        alert.resolve()
        return Response({'message': 'Alert resolved successfully'})

class DashboardViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def _get_date_range(self, period):
        today = timezone.now()
        if period == 'day':
            start_date = today - timedelta(days=1)
        elif period == 'week':
            start_date = today - timedelta(days=7)
        elif period == 'month':
            start_date = today - timedelta(days=30)
        elif period == 'year':
            start_date = today - timedelta(days=365)
        else:
            start_date = today - timedelta(days=30)  # Default to month
        return start_date, today

    @action(detail=False, methods=['get'])
    def overview(self, request):
        # Get date range from query params
        period = request.query_params.get('period', 'month')
        start_date, end_date = self._get_date_range(period)

        # Basic metrics
        total_products = Product.objects.count()
        active_products = Product.objects.filter(is_active=True).count()
        out_of_stock_products = Product.objects.filter(stock_quantity=0).count()
        low_stock_products = Product.objects.filter(stock_quantity__lte=F('minimum_stock')).count()
        
        # Calculate total inventory value
        total_inventory_value = Product.objects.aggregate(
            total=Sum(F('selling_price') * F('stock_quantity'))
        )['total'] or 0

        # Stock movement metrics
        stock_movements = StockMovement.objects.filter(
            created_at__range=(start_date, end_date)
        )
        stock_in = stock_movements.filter(movement_type='IN').aggregate(
            total=Sum('quantity')
        )['total'] or 0
        stock_out = stock_movements.filter(movement_type='OUT').aggregate(
            total=Sum('quantity')
        )['total'] or 0

        # Category distribution
        category_distribution = Category.objects.annotate(
            product_count=Count('products'),
            total_value=Sum(F('products__selling_price') * F('products__stock_quantity'))
        ).values('name', 'product_count', 'total_value')

        # Top selling products
        top_selling_products = Product.objects.annotate(
            total_sold=Sum(
                Case(
                    When(
                        stock_movements__movement_type='OUT',
                        then='stock_movements__quantity'
                    ),
                    default=0,
                    output_field=IntegerField()
                )
            )
        ).order_by('-total_sold')[:5]

        # Stock health metrics
        stock_health = {
            'healthy': Product.objects.filter(stock_quantity__gt=F('minimum_stock')).count(),
            'low': low_stock_products,
            'out': out_of_stock_products
        }

        # Recent stock movements
        recent_movements = StockMovement.objects.select_related(
            'product', 'variation'
        ).order_by('-created_at')[:10]

        # Supplier performance
        supplier_metrics = Supplier.objects.annotate(
            total_products=Count('products'),
            total_value=Sum(F('products__selling_price') * F('products__stock_quantity')),
            low_stock_count=Count(
                'products',
                filter=Q(products__stock_quantity__lte=F('products__minimum_stock'))
            )
        ).values(
            'company_name',
            'total_products',
            'total_value',
            'low_stock_count'
        ).order_by('-total_value')

        return Response({
            'metrics': {
                'total_products': total_products,
                'active_products': active_products,
                'out_of_stock_products': out_of_stock_products,
                'low_stock_products': low_stock_products,
                'total_inventory_value': total_inventory_value,
                'stock_in': stock_in,
                'stock_out': stock_out,
                'stock_health': stock_health
            },
            'category_distribution': category_distribution,
            'top_selling_products': ProductSerializer(top_selling_products, many=True).data,
            'recent_movements': StockMovementSerializer(recent_movements, many=True).data,
            'supplier_metrics': list(supplier_metrics)  # Convert QuerySet to list
        })

    @action(detail=False, methods=['get'])
    def stock_alerts(self, request):
        # Get low stock and out of stock products
        low_stock_products = Product.objects.filter(
            stock_quantity__lte=F('minimum_stock')
        ).select_related('category', 'supplier')
        
        out_of_stock_products = Product.objects.filter(
            stock_quantity=0
        ).select_related('category', 'supplier')

        # Get active alerts
        active_alerts = InventoryAlert.objects.filter(
            is_active=True
        ).select_related('product', 'variation')

        return Response({
            'low_stock': ProductSerializer(low_stock_products, many=True).data,
            'out_of_stock': ProductSerializer(out_of_stock_products, many=True).data,
            'active_alerts': InventoryAlertSerializer(active_alerts, many=True).data
        })

    @action(detail=False, methods=['get'])
    def category_metrics(self, request):
        categories = Category.objects.annotate(
            total_products=Count('products'),
            active_products=Count('products', filter=Q(products__is_active=True)),
            low_stock_products=Count(
                'products',
                filter=Q(products__stock_quantity__lte=F('products__minimum_stock'))
            ),
            total_value=Sum(F('products__selling_price') * F('products__stock_quantity'))
        ).values('name', 'total_products', 'active_products', 'low_stock_products', 'total_value')

        return Response(categories)

    @action(detail=False, methods=['get'])
    def stock_movement_analysis(self, request):
        period = request.query_params.get('period', 'month')
        start_date, end_date = self._get_date_range(period)

        # Daily stock movements
        daily_movements = StockMovement.objects.filter(
            created_at__range=(start_date, end_date)
        ).annotate(
            date=TruncDate('created_at')
        ).values('date').annotate(
            stock_in=Sum('quantity', filter=Q(movement_type='IN')),
            stock_out=Sum('quantity', filter=Q(movement_type='OUT'))
        ).order_by('date')

        # Movement by category
        category_movements = StockMovement.objects.filter(
            created_at__range=(start_date, end_date)
        ).values('product__category__name').annotate(
            stock_in=Sum('quantity', filter=Q(movement_type='IN')),
            stock_out=Sum('quantity', filter=Q(movement_type='OUT'))
        )

        return Response({
            'daily_movements': daily_movements,
            'category_movements': category_movements
        })