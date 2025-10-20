from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SaleViewSet, PaymentViewSet, ReturnViewSet, SalePaymentViewSet, DuePaymentViewSet

router = DefaultRouter()
router.register(r'sales', SaleViewSet)
router.register(r'payments', PaymentViewSet)  # Legacy payments
router.register(r'sale-payments', SalePaymentViewSet)  # New payment system
router.register(r'due-payments', DuePaymentViewSet)  # Due payment management
router.register(r'returns', ReturnViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 