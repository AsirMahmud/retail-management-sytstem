from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DiscountViewSet,
    BrandViewSet,
    HomePageSettingsViewSet,
    PublicHomePageSettingsView,
    PublicBrandsView
)

router = DefaultRouter()
router.register(r'discounts', DiscountViewSet, basename='discount')
router.register(r'brands', BrandViewSet, basename='brand')
router.register(r'home-page-settings', HomePageSettingsViewSet, basename='home-page-settings')

urlpatterns = [
    path('', include(router.urls)),
    path('public/home-page-settings/', PublicHomePageSettingsView.as_view(), name='public-home-page-settings'),
    path('public/brands/', PublicBrandsView.as_view(), name='public-brands'),
]

