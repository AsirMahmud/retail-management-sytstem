from django.urls import path
from .views import FlushDatabaseView

urlpatterns = [
    path('flush-database/', FlushDatabaseView.as_view(), name='flush-database'),
] 