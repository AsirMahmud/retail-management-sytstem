from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Customer
from .serializers import CustomerSerializer

class CustomerViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing customer operations.
    Provides CRUD operations and additional filtering capabilities.
    """
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['gender', 'is_active']
    search_fields = ['first_name', 'last_name', 'email', 'phone']
    ordering_fields = ['created_at', 'first_name', 'last_name']
    ordering = ['-created_at']

    def perform_create(self, serializer):
        """Override to add any additional logic during customer creation"""
        serializer.save()

    @action(detail=False, methods=['get'])
    def active_customers(self, request):
        """Custom action to get only active customers"""
        active_customers = Customer.objects.filter(is_active=True)
        serializer = self.get_serializer(active_customers, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def inactive_customers(self, request):
        """Custom action to get only inactive customers"""
        inactive_customers = Customer.objects.filter(is_active=False)
        serializer = self.get_serializer(inactive_customers, many=True)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        """Override to implement soft delete"""
        customer = self.get_object()
        customer.is_active = False
        customer.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
