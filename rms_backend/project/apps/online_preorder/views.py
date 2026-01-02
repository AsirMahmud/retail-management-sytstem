from rest_framework import viewsets, mixins
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

from .models import OnlinePreorder
from .serializers import OnlinePreorderCreateSerializer, OnlinePreorderSerializer


class PublicCreateOnlinePreorderView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        payload = request.data.copy()
        # Serializer enforces ONLINE/COD/online
        serializer = OnlinePreorderCreateSerializer(data=payload)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        online_preorder = serializer.save()
        
        # Send notifications
        from .email_utils import send_admin_order_notification, send_customer_order_received
        send_admin_order_notification(online_preorder.id)
        send_customer_order_received(online_preorder.id)
        
        return Response(OnlinePreorderSerializer(online_preorder).data, status=status.HTTP_201_CREATED)


class OnlinePreorderViewSet(mixins.ListModelMixin,
                            mixins.RetrieveModelMixin,
                            mixins.UpdateModelMixin,
                            viewsets.GenericViewSet):
    queryset = OnlinePreorder.objects.all().order_by('-created_at')
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return OnlinePreorderCreateSerializer
        return OnlinePreorderSerializer

    def get_queryset(self):
        qs = OnlinePreorder.objects.all()
        status_filter = self.request.query_params.get('status')
        if status_filter and status_filter != 'all':
            qs = qs.filter(status=status_filter)
        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(models.Q(customer_name__icontains=search) | models.Q(customer_phone__icontains=search))
        return qs.order_by('-created_at')

    def perform_update(self, serializer):
        instance = serializer.instance
        old_status = instance.status
        updated_instance = serializer.save()
        new_status = updated_instance.status

        # Check for status changes
        if old_status != 'CONFIRMED' and new_status == 'CONFIRMED':
            try:
                from .email_utils import send_customer_order_confirmation
                send_customer_order_confirmation(updated_instance.id)
            except Exception as e:
                import logging
                logger = logging.getLogger(__name__)
                logger.error(f"Error sending confirmation notification for order {updated_instance.id}: {str(e)}")

        elif old_status != 'DELIVERED' and new_status == 'DELIVERED':
            try:
                from .email_utils import send_delivery_notification
                send_delivery_notification(updated_instance.id)
            except Exception as e:
                import logging
                logger = logging.getLogger(__name__)
                logger.error(f"Error sending delivery notification for order {updated_instance.id}: {str(e)}")


