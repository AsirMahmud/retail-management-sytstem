from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ReportViewSet, SavedReportViewSet

router = DefaultRouter()
router.register(r'', ReportViewSet)
router.register(r'saved-reports', SavedReportViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 