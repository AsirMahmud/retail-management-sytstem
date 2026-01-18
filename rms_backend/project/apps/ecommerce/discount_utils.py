"""
Discount utility functions for priority-based discount calculation.

Priority Order:
1. Product-specific discount (highest priority)
2. Category discount (checks both category and online_category)
3. App-wide/Global discount (lowest priority)
"""

from decimal import Decimal
from django.utils import timezone
from django.db.models import Q


def get_applicable_discount(product):
    """
    Returns the best applicable discount for a product based on priority:
    1. Product-specific discount (PRODUCT type)
    2. Category discount (CATEGORY type - checks category and online_category)
    3. App-wide (global) discount (APP_WIDE type)
    
    Args:
        product: Product instance
        
    Returns:
        Discount object or None
    """
    from .models import Discount
    
    now = timezone.now()
    
    # Base query for active discounts within date range
    base_query = Q(
        is_active=True,
        start_date__lte=now,
        end_date__gte=now
    )
    
    # 1. Check for product-specific discount (highest priority)
    product_discount = Discount.objects.filter(
        base_query,
        discount_type='PRODUCT',
        product=product
    ).first()
    
    if product_discount:
        return product_discount
    
    # 2. Check for category discount
    category_query = Q(discount_type='CATEGORY') & base_query
    
    # Build OR conditions for category matches
    category_conditions = Q()
    
    if product.category:
        category_conditions |= Q(category=product.category)
    
    if product.online_category:
        category_conditions |= Q(online_category=product.online_category)
    
    if category_conditions:
        category_discount = Discount.objects.filter(
            category_query & category_conditions
        ).order_by('-value').first()  # Get highest value category discount
        
        if category_discount:
            return category_discount
    
    # 3. Check for app-wide/global discount (lowest priority)
    global_discount = Discount.objects.filter(
        base_query,
        discount_type='APP_WIDE'
    ).order_by('-value').first()  # Get highest value global discount
    
    return global_discount


def calculate_discounted_price(product, original_price=None):
    """
    Calculates the final price after applying the best applicable discount.
    
    Args:
        product: Product instance
        original_price: Optional override for original price (defaults to product.selling_price)
        
    Returns:
        dict with:
            - original_price: Decimal (the base price before discount)
            - discount_value: Decimal (percentage, e.g., 15.00 for 15%)
            - discount_amount: Decimal (actual amount discounted)
            - final_price: Decimal (price after discount)
            - discount_type: str or None ('PRODUCT', 'CATEGORY', 'APP_WIDE')
            - discount_name: str or None (name of the applied discount)
    """
    if original_price is None:
        original_price = product.selling_price
    
    original_price = Decimal(str(original_price))
    
    discount = get_applicable_discount(product)
    
    if discount:
        discount_value = Decimal(str(discount.value))
        discount_amount = (original_price * discount_value / Decimal('100')).quantize(Decimal('0.01'))
        final_price = (original_price - discount_amount).quantize(Decimal('0.01'))
        
        return {
            'original_price': float(original_price),
            'discount_value': float(discount_value),
            'discount_amount': float(discount_amount),
            'final_price': float(final_price),
            'discount_type': discount.discount_type,
            'discount_name': discount.name,
        }
    
    # No discount applies
    return {
        'original_price': float(original_price),
        'discount_value': 0,
        'discount_amount': 0,
        'final_price': float(original_price),
        'discount_type': None,
        'discount_name': None,
    }


def get_discount_info_for_serializer(product):
    """
    Convenience function to get discount info formatted for API responses.
    Returns None if no discount applies (to reduce JSON payload size).
    
    Args:
        product: Product instance
        
    Returns:
        dict with discount info or None if no discount
    """
    info = calculate_discounted_price(product)
    
    # Only return info if there's actually a discount
    if info['discount_type'] is not None:
        return info
    
    return None
