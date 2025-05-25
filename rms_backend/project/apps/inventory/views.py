from rest_framework import viewsets, filters, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.db.models import Q, F
from django.utils import timezone
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
        queryset = Category.objects.all()
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(name__icontains=search)
        # Only return root categories (those without parent)
        if self.action == 'list':
            return queryset.filter(parent=None)
        return queryset

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