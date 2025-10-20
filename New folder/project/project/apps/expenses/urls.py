from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ExpenseViewSet, ExpenseCategoryViewSet

router = DefaultRouter()
router.register(r'expenses', ExpenseViewSet)
router.register(r'categories', ExpenseCategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 