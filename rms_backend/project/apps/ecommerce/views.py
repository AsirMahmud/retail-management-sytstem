from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils import timezone
from django.db.models import Q
from .models import Discount, Brand, HomePageSettings
from .serializers import DiscountSerializer, DiscountListSerializer, BrandSerializer, HomePageSettingsSerializer


class DiscountViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing discounts
    - List all discounts
    - Create new discount
    - Update existing discount
    - Delete discount
    - Get active discounts
    - Get expired discounts
    """
    queryset = Discount.objects.all()
    serializer_class = DiscountSerializer
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return DiscountListSerializer
        return DiscountSerializer
    
    def get_queryset(self):
        queryset = Discount.objects.all()
        
        # Filter by status
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Filter by discount type
        discount_type = self.request.query_params.get('discount_type', None)
        if discount_type:
            queryset = queryset.filter(discount_type=discount_type)
        
        # Filter by active status
        is_active = self.request.query_params.get('is_active', None)
        if is_active is not None:
            is_active_bool = is_active.lower() == 'true'
            queryset = queryset.filter(is_active=is_active_bool)
        
        # Search by name
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(description__icontains=search)
            )
        
        return queryset.order_by('-created_at')
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def active(self, request):
        """Get all currently active discounts"""
        now = timezone.now()
        active_discounts = self.queryset.filter(
            is_active=True,
            status='ACTIVE',
            start_date__lte=now,
            end_date__gte=now
        )
        serializer = self.get_serializer(active_discounts, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def expired(self, request):
        """Get all expired discounts"""
        now = timezone.now()
        expired_discounts = self.queryset.filter(
            end_date__lt=now
        )
        serializer = self.get_serializer(expired_discounts, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def scheduled(self, request):
        """Get all scheduled discounts"""
        now = timezone.now()
        scheduled_discounts = self.queryset.filter(
            start_date__gt=now
        )
        serializer = self.get_serializer(scheduled_discounts, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Activate a discount"""
        discount = self.get_object()
        discount.is_active = True
        discount.save()
        serializer = self.get_serializer(discount)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        """Deactivate a discount"""
        discount = self.get_object()
        discount.is_active = False
        discount.save()
        serializer = self.get_serializer(discount)
        return Response(serializer.data)


class BrandViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing brands
    """
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = Brand.objects.all()
        
        # Filter by active status
        is_active = self.request.query_params.get('is_active', None)
        if is_active is not None:
            is_active_bool = is_active.lower() == 'true'
            queryset = queryset.filter(is_active=is_active_bool)
        
        # Search by name
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(name__icontains=search)
        
        return queryset.order_by('display_order', 'name')


class HomePageSettingsViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing home page settings (singleton)
    """
    queryset = HomePageSettings.objects.all()
    serializer_class = HomePageSettingsSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'
    parser_classes = [MultiPartParser, FormParser]
    
    def get_object(self):
        """Always return the singleton instance"""
        return HomePageSettings.load()
    
    def list(self, request):
        """Return the singleton instance"""
        instance = HomePageSettings.load()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    def create(self, request):
        """Update or create the singleton instance"""
        instance = HomePageSettings.load()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
    def update(self, request, id=None):
        """Update the singleton instance"""
        instance = HomePageSettings.load()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
    def partial_update(self, request, id=None):
        """Partially update the singleton instance"""
        instance = HomePageSettings.load()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class PublicHomePageSettingsView(APIView):
    """Public API endpoint for home page settings"""
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Get home page settings for public access"""
        try:
            settings = HomePageSettings.load()
            serializer = HomePageSettingsSerializer(settings, context={'request': request})
            return Response(serializer.data)
        except HomePageSettings.DoesNotExist:
            # Return default values if settings don't exist
            return Response({
                'logo_image_url': None,
                'logo_text': None,
                'hero_badge_text': 'New Collection 2024',
                'hero_heading_line1': 'FIND',
                'hero_heading_line2': 'CLOTHES',
                'hero_heading_line3': 'THAT',
                'hero_heading_line4': 'Matches',
                'hero_heading_line5': 'YOUR STYLE',
                'hero_description': 'Browse through our diverse range of meticulously crafted garments...',
                'hero_primary_image_url': None,
                'hero_secondary_image_url': None,
                'stat_brands': '200+',
                'stat_products': '2,000+',
                'stat_customers': '30,000+',
            })


class PublicBrandsView(APIView):
    """Public API endpoint for active brands"""
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Get active brands for public access"""
        brands = Brand.objects.filter(is_active=True).order_by('display_order', 'name')
        serializer = BrandSerializer(brands, many=True, context={'request': request})
        return Response(serializer.data)

