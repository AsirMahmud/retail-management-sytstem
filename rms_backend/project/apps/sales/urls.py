from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SaleViewSet, PaymentViewSet, ReturnViewSet

router = DefaultRouter()
router.register(r'sales', SaleViewSet)
router.register(r'payments', PaymentViewSet)
router.register(r'returns', ReturnViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 