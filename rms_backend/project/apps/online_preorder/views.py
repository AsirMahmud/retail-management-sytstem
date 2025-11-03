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


