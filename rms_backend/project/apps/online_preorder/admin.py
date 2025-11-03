from django.contrib import admin
from .models import OnlineConversion, OnlinePreorder


@admin.register(OnlineConversion)
class OnlineConversionAdmin(admin.ModelAdmin):
    list_display = ('id', 'online_preorder', 'sale', 'status', 'converted_at', 'updated_at')
    list_filter = ('status',)
    search_fields = ('online_preorder__id', 'sale__id')


@admin.register(OnlinePreorder)
class OnlinePreorderAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer_name', 'customer_phone', 'status', 'total_amount', 'created_at')
    list_filter = ('status',)
    search_fields = ('customer_name', 'customer_phone')


