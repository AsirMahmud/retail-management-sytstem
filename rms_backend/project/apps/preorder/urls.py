from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PreorderProductViewSet, PreorderVariationViewSet, PreorderViewSet

router = DefaultRouter()
router.register(r'products', PreorderProductViewSet)
router.register(r'variations', PreorderVariationViewSet)
router.register(r'orders', PreorderViewSet, basename='preorder')

urlpatterns = [
    path('', include(router.urls)),
    # Explicit route for online preorder endpoint to ensure it's accessible
    path('orders/online/', PreorderViewSet.as_view({'post': 'online'}), name='preorder-orders-online'),
] 