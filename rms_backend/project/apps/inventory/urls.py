from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet,
    ProductViewSet,
    ProductVariationViewSet,
    StockMovementViewSet,
    InventoryAlertViewSet
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'variations', ProductVariationViewSet)
router.register(r'stock-movements', StockMovementViewSet)
router.register(r'alerts', InventoryAlertViewSet)

urlpatterns = [
    path('', include(router.urls)),
]