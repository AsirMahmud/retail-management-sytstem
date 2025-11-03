from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PublicCreateOnlinePreorderView, OnlinePreorderViewSet

router = DefaultRouter()
router.register(r'orders', OnlinePreorderViewSet, basename='online-preorders')

urlpatterns = [
    path('', include(router.urls)),
    path('orders/create/', PublicCreateOnlinePreorderView.as_view(), name='online-preorder-create'),
]


