from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PreorderProductViewSet, PreorderVariationViewSet, PreorderViewSet

router = DefaultRouter()
router.register(r'products', PreorderProductViewSet)
router.register(r'variations', PreorderVariationViewSet)
router.register(r'orders', PreorderViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 