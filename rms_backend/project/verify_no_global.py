import os
import django
import sys
from decimal import Decimal
from django.utils import timezone
from datetime import timedelta

# Setup Django environment
sys.path.append('c:\\Users\\KHAN GADGET\\Documents\\webdev\\retail management sytstem\\rms_backend\\project')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'rms.settings')
django.setup()

from apps.inventory.models import Product
from apps.ecommerce.models import Discount
from apps.inventory.serializers import EcommerceProductSerializer

def run_test():
    print("Setting up test data for 'No Global Discount' scenario...")
    
    # 1. Clean up previous test data
    Product.objects.filter(sku__startswith='TEST-').delete()
    Discount.objects.filter(name__startswith='TEST-').delete()
    
    # Ensure NO active APP_WIDE discounts exist (disable them if any)
    Discount.objects.filter(discount_type='APP_WIDE', is_active=True).update(is_active=False)
    print("Disabled all existing APP_WIDE discounts for this test.")

    # 2. Create test products
    # Product 1 will eventually have a specific discount
    p1 = Product.objects.create(
        name="TEST-Product-1",
        sku="TEST-SKU-1",
        cost_price=Decimal('50.00'),
        selling_price=Decimal('100.00'),
        stock_quantity=10,
        assign_to_online=True,
        is_active=True
    )
    # Product 2 will have NO discount
    p2 = Product.objects.create(
        name="TEST-Product-2",
        sku="TEST-SKU-2",
        cost_price=Decimal('50.00'),
        selling_price=Decimal('100.00'),
        stock_quantity=10,
        assign_to_online=True,
        is_active=True
    )
    
    # 3. Verify baseline: No discounts at all
    print("\n--- Phase 1: No Discounts At All ---")
    s1 = EcommerceProductSerializer(p1)
    s2 = EcommerceProductSerializer(p2)
    
    d1 = s1.data['discount'] or 0
    d2 = s2.data['discount'] or 0
    
    print(f"P1 Discount: {d1}% (Expected: 0.0)")
    print(f"P2 Discount: {d2}% (Expected: 0.0)")
    
    if d1 != 0 or d2 != 0:
        print("FAIL: Discounts found when none should exist!")
        return

    # 4. Create a specific PRODUCT discount for P1
    print("\n--- Phase 2: Specific Discount on P1 ---")
    p1_discount = Discount.objects.create(
        name="TEST-P1-Discount",
        discount_type='PRODUCT',
        value=Decimal('20.00'),
        product=p1,
        start_date=timezone.now() - timedelta(days=1),
        end_date=timezone.now() + timedelta(days=1),
        is_active=True,
        status='ACTIVE'
    )
    print(f"Created specific discount for P1: 20%")

    # 5. Verify P1 has discount, P2 has none
    # Refresh serializers
    s1 = EcommerceProductSerializer(p1)
    s2 = EcommerceProductSerializer(p2)
    
    d1 = s1.data['discount'] or 0
    d2 = s2.data['discount'] or 0
    
    print(f"P1 Discount: {d1}% (Expected: 20.0)")
    print(f"P2 Discount: {d2}% (Expected: 0.0)")
    
    if d1 == 20.0 and d2 == 0:
        print("PASS: P1 has specific discount, P2 has none.")
    else:
        print("FAIL: Incorrect discount application.")
        print(f"Debug: P1={d1}, P2={d2}")

    # Cleanup (Optional, keep false to inspect db if needed)
    # Product.objects.filter(sku__startswith='TEST-').delete()
    # Discount.objects.filter(name__startswith='TEST-').delete()

if __name__ == '__main__':
    run_test()
