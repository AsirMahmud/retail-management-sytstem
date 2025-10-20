from django.contrib import admin
from .models import Customer

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email', 'phone', 'is_active', 'created_at')
    list_filter = ('is_active', 'gender', 'created_at')
    search_fields = ('first_name', 'last_name', 'email', 'phone')
    ordering = ('-created_at',) 