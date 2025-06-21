#!/usr/bin/env python
"""
Test script to verify that the sales recursion issue is fixed.
This script creates a sale with items and verifies that no recursion occurs.
"""

import os
import sys
import django

# Add the project directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'project'))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'rms.settings')
django.setup()

from decimal import Decimal
from apps.inventory.models import Category, Product, ProductVariation
from apps.customer.models import Customer
from apps.sales.models import Sale, SaleItem

def test_sales_recursion():
    """Test that creating a sale with items doesn't cause recursion."""
    print("Testing sales recursion fix...")
    
    try:
        # Create test data
        print("Creating test data...")
        
        # Create category
        category, created = Category.objects.get_or_create(
            name="Test Category",
            defaults={'description': 'Test category for recursion testing'}
        )
        
        # Create customer
        customer, created = Customer.objects.get_or_create(
            phone="1234567890",
            defaults={
                'first_name': 'Test',
                'last_name': 'Customer',
                'email': 'test@example.com',
                'address': 'Test Address',
                'gender': 'O'
            }
        )
        
        # Create product
        product, created = Product.objects.get_or_create(
            name="Test Product",
            defaults={
                'category': category,
                'cost_price': Decimal('10.00'),
                'selling_price': Decimal('20.00'),
                'stock_quantity': 100,
                'minimum_stock': 10
            }
        )
        
        # Create product variation
        variation, created = ProductVariation.objects.get_or_create(
            product=product,
            size='M',
            color='Red',
            defaults={'stock': 50}
        )
        
        # Create sale
        print("Creating sale...")
        sale = Sale.objects.create(
            customer=customer,
            customer_phone=customer.phone,
            subtotal=Decimal('40.00'),
            tax=Decimal('0.00'),
            discount=Decimal('5.00'),
            total=Decimal('35.00'),
            payment_method='cash',
            status='completed'
        )
        
        # Create sale items
        print("Creating sale items...")
        item1 = SaleItem.objects.create(
            sale=sale,
            product=product,
            size='M',
            color='Red',
            quantity=2,
            unit_price=Decimal('20.00'),
            discount=Decimal('0.00'),
            total=Decimal('40.00')
        )
        
        print("Sale and items created successfully!")
        print(f"Sale ID: {sale.id}")
        print(f"Sale total: {sale.total}")
        print(f"Sale profit: {sale.total_profit}")
        print(f"Sale loss: {sale.total_loss}")
        print(f"Item total: {item1.total}")
        print(f"Item profit: {item1.profit}")
        print(f"Item loss: {item1.loss}")
        
        # Test updating the sale
        print("\nTesting sale update...")
        sale.discount = Decimal('10.00')
        sale.calculate_totals()
        
        print("Sale updated successfully!")
        print(f"Updated sale total: {sale.total}")
        print(f"Updated sale profit: {sale.total_profit}")
        print(f"Updated sale loss: {sale.total_loss}")
        
        print("\n✅ Recursion test passed! No maximum recursion depth exceeded.")
        
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    return True

if __name__ == "__main__":
    success = test_sales_recursion()
    if success:
        print("\n🎉 All tests passed! The recursion issue has been fixed.")
    else:
        print("\n💥 Tests failed! There may still be recursion issues.")
        sys.exit(1) 