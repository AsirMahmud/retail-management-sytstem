from django.contrib import admin
from .models import PreorderProduct, PreorderVariation, Preorder


@admin.register(PreorderProduct)
class PreorderProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'supplier', 'estimated_price', 'cost_price', 'selling_price', 'status', 'is_active', 'current_orders', 'max_quantity', 'expected_arrival_date']
    list_filter = ['status', 'is_active', 'category', 'supplier', 'gender']
    search_fields = ['name', 'description']
    readonly_fields = ['current_orders', 'created_at', 'updated_at']
    list_editable = ['status', 'is_active']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'category', 'supplier', 'image')
        }),
        ('Pricing', {
            'fields': ('estimated_price', 'cost_price', 'selling_price', 'deposit_amount')
        }),
        ('Inventory', {
            'fields': ('max_quantity', 'current_orders', 'expected_arrival_date')
        }),
        ('Attributes', {
            'fields': ('size_type', 'size_category', 'gender')
        }),
        ('Status', {
            'fields': ('status', 'is_active')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(PreorderVariation)
class PreorderVariationAdmin(admin.ModelAdmin):
    list_display = ['preorder_product', 'size', 'color', 'max_quantity', 'current_orders', 'is_active']
    list_filter = ['is_active', 'preorder_product']
    search_fields = ['preorder_product__name', 'size', 'color']
    readonly_fields = ['current_orders', 'created_at', 'updated_at']


@admin.register(Preorder)
class PreorderAdmin(admin.ModelAdmin):
    list_display = ['id', 'customer_name', 'customer_phone', 'preorder_product', 'total_amount', 'status', 'created_at']
    list_filter = ['status', 'created_at', 'preorder_product']
    search_fields = ['customer_name', 'customer_phone', 'customer_email', 'preorder_product__name']
    readonly_fields = ['created_at', 'updated_at']
    list_editable = ['status']
    
    fieldsets = (
        ('Customer Information', {
            'fields': ('customer_name', 'customer_phone', 'customer_email')
        }),
        ('Order Details', {
            'fields': ('preorder_product', 'items', 'total_amount', 'deposit_paid')
        }),
        ('Status & Notes', {
            'fields': ('status', 'notes', 'expected_delivery_date')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['mark_as_delivered', 'mark_as_completed', 'cancel_orders']
    
    def mark_as_delivered(self, request, queryset):
        updated = queryset.update(status='DELIVERED')
        self.message_user(request, f'{updated} preorder(s) marked as delivered.')
    mark_as_delivered.short_description = "Mark selected preorders as delivered"
    
    def mark_as_completed(self, request, queryset):
        updated = queryset.update(status='COMPLETED')
        self.message_user(request, f'{updated} preorder(s) marked as completed.')
    mark_as_completed.short_description = "Mark selected preorders as completed"
    
    def cancel_orders(self, request, queryset):
        for preorder in queryset:
            preorder.cancel()
        self.message_user(request, f'{queryset.count()} preorder(s) cancelled.')
    cancel_orders.short_description = "Cancel selected preorders" 