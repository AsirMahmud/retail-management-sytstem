from rest_framework import viewsets, filters, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from .models import Supplier
from .serializers import SupplierSerializer

class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active']
    search_fields = ['company_name', 'contact_person', 'email', 'phone', 'tax_number']
    ordering_fields = ['created_at', 'company_name']
    ordering = ['-created_at']
    
    def perform_create(self, serializer):
        serializer.save()

    def perform_destroy(self, instance):
        instance.delete()

    @action(detail=False, methods=['get'])
    def active_suppliers(self, request):
        active_suppliers = Supplier.objects.filter(is_active=True)
        serializer = self.get_serializer(active_suppliers, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def inactive_suppliers(self, request):
        inactive_suppliers = Supplier.objects.filter(is_active=False)
        serializer = self.get_serializer(inactive_suppliers, many=True)
        return Response(serializer.data) 