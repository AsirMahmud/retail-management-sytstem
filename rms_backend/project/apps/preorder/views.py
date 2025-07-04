from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count
from django.utils import timezone
from datetime import timedelta
from .models import PreorderProduct, PreorderVariation, Preorder
from .serializers import (
    PreorderProductSerializer, PreorderProductCreateSerializer,
    PreorderVariationSerializer, PreorderSerializer, PreorderCreateSerializer,
    PreorderDashboardSerializer
)


class PreorderProductViewSet(viewsets.ModelViewSet):
    queryset = PreorderProduct.objects.all().order_by('-created_at')
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create' or self.action == 'update':
            return PreorderProductCreateSerializer
        return PreorderProductSerializer
    
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """Get dashboard data for preorder products"""
        products = PreorderProduct.objects.all()
        serializer = PreorderDashboardSerializer(products, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get only active preorder products"""
        products = PreorderProduct.objects.filter(is_active=True, status='ACTIVE')
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Mark a preorder product as completed"""
        product = self.get_object()
        product.status = 'COMPLETED'
        product.save()
        return Response({'message': 'Product marked as completed'})
    
    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        """Deactivate a preorder product"""
        product = self.get_object()
        product.is_active = False
        product.save()
        return Response({'message': 'Product deactivated'})


class PreorderVariationViewSet(viewsets.ModelViewSet):
    queryset = PreorderVariation.objects.all()
    serializer_class = PreorderVariationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = PreorderVariation.objects.all()
        product_id = self.request.query_params.get('product', None)
        if product_id:
            queryset = queryset.filter(preorder_product_id=product_id)
        return queryset


class PreorderViewSet(viewsets.ModelViewSet):
    queryset = Preorder.objects.all().order_by('-created_at')
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create' or self.action == 'update':
            return PreorderCreateSerializer
        return PreorderSerializer
    
    def get_queryset(self):
        queryset = Preorder.objects.all()
        status_filter = self.request.query_params.get('status', None)
        product_filter = self.request.query_params.get('product', None)
        
        if status_filter and status_filter != 'all':
            queryset = queryset.filter(status=status_filter)
        
        if product_filter:
            queryset = queryset.filter(preorder_product_id=product_filter)
        
        return queryset.order_by('-created_at')
    
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """Get dashboard statistics"""
        total_orders = Preorder.objects.count()
        total_revenue = Preorder.objects.aggregate(total=Sum('total_amount'))['total'] or 0
        pending_orders = Preorder.objects.filter(status__in=['PENDING', 'CONFIRMED', 'DEPOSIT_PAID']).count()
        completed_orders = Preorder.objects.filter(status='COMPLETED').count()
        
        # Recent orders (last 7 days)
        week_ago = timezone.now() - timedelta(days=7)
        recent_orders = Preorder.objects.filter(created_at__gte=week_ago).count()
        
        # Status breakdown
        status_breakdown = {}
        for status_choice in Preorder.STATUS_CHOICES:
            status_breakdown[status_choice[0]] = Preorder.objects.filter(status=status_choice[0]).count()
        
        return Response({
            'total_orders': total_orders,
            'total_revenue': total_revenue,
            'pending_orders': pending_orders,
            'completed_orders': completed_orders,
            'recent_orders': recent_orders,
            'status_breakdown': status_breakdown
        })
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Complete a preorder and convert to sale"""
        preorder = self.get_object()
        
        if preorder.status != 'DELIVERED':
            return Response(
                {'error': 'Preorder must be delivered before completion'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            sale = preorder.complete_and_convert_to_sale()
            if sale:
                return Response({
                    'message': 'Preorder completed and converted to sale',
                    'sale_id': sale.id
                })
            else:
                return Response(
                    {'error': 'Failed to convert preorder to sale'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            return Response(
                {'error': f'Error completing preorder: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel a preorder"""
        preorder = self.get_object()
        
        if preorder.status in ['CANCELLED', 'DELIVERED', 'COMPLETED']:
            return Response(
                {'error': 'Cannot cancel preorder in current status'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        preorder.cancel()
        return Response({'message': 'Preorder cancelled successfully'})
    
    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """Update preorder status"""
        preorder = self.get_object()
        new_status = request.data.get('status')
        if not new_status:
            return Response(
                {'error': 'Status is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        if new_status not in dict(Preorder.STATUS_CHOICES):
            return Response(
                {'error': 'Invalid status'},
                status=status.HTTP_400_BAD_REQUEST
            )
        # If status is being set to COMPLETED, trigger sale creation
        if new_status == 'COMPLETED' and preorder.status in ['DELIVERED', 'FULLY_PAID', 'ARRIVED', 'CONFIRMED', 'PENDING', 'DEPOSIT_PAID']:
            sale = preorder.complete_and_convert_to_sale()
            if sale:
                return Response({'message': 'Preorder completed and converted to sale', 'sale_id': sale.id})
            else:
                return Response({'error': 'Failed to convert preorder to sale'}, status=status.HTTP_400_BAD_REQUEST)
        preorder.status = new_status
        preorder.save()
        return Response({'message': f'Status updated to {new_status}'}) 