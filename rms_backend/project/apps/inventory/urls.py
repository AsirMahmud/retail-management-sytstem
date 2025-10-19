from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet,
    OnlineCategoryViewSet,
    ProductViewSet,
    ProductVariationViewSet,
    StockMovementViewSet,
    InventoryAlertViewSet,
    DashboardViewSet,
    MeterialCompositionViewSet,
    WhoIsThisForViewSet,
    FeaturesViewSet,
    GalleryViewSet,
    ImageViewSet
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'online-categories', OnlineCategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'variations', ProductVariationViewSet)
router.register(r'stock-movements', StockMovementViewSet)
router.register(r'alerts', InventoryAlertViewSet)
router.register(r'dashboard', DashboardViewSet, basename='dashboard')
router.register(r'material-composition', MeterialCompositionViewSet)
router.register(r'who-is-this-for', WhoIsThisForViewSet)
router.register(r'features', FeaturesViewSet)
router.register(r'galleries', GalleryViewSet)
router.register(r'images', ImageViewSet)


urlpatterns = [
    path('', include(router.urls)),
    # Add explicit URL patterns for dashboard actions
    path('dashboard/overview/', DashboardViewSet.as_view({'get': 'overview'}), name='dashboard-overview'),
    path('dashboard/stock-alerts/', DashboardViewSet.as_view({'get': 'stock_alerts'}), name='dashboard-stock-alerts'),
    path('dashboard/category-metrics/', DashboardViewSet.as_view({'get': 'category_metrics'}), name='dashboard-category-metrics'),
    path('dashboard/stock-movement-analysis/', DashboardViewSet.as_view({'get': 'stock_movement_analysis'}), name='dashboard-stock-movement-analysis'),
]