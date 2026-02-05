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

from rest_framework.test import APIRequestFactory
from apps.inventory.models import Product
from apps.ecommerce.models import Discount
from apps.ecommerce.views import DiscountViewSet

def run_test():
    print("Verifying Global Discount Endpoint...")
    
    # 1. Clean up
    Product.objects.filter(sku__startswith='TEST-').delete()
    Discount.objects.filter(name__startswith='TEST-').delete()
    Discount.objects.filter(discount_type='APP_WIDE', is_active=True).update(is_active=False)

    # 2. Create test product
    p1 = Product.objects.create(
        name="TEST-Product-View",
        sku="TEST-SKU-VIEW",
        cost_price=Decimal('50.00'),
        selling_price=Decimal('100.00'),
        stock_quantity=10,
        assign_to_online=True,
        is_active=True
    )
    
    # 3. Create a "BUGGED" discount (Type=APP_WIDE, but assigned to Product)
    bugged_discount = Discount.objects.create(
        name="TEST-Active-View-Bug",
        discount_type='APP_WIDE',
        value=Decimal('50.00'),
        product=p1,
        start_date=timezone.now() - timedelta(days=1),
        end_date=timezone.now() + timedelta(days=1),
        is_active=True,
        status='ACTIVE'
    )
    print("Created bugged discount (APP_WIDE but linked to product).")

    # 4. Call the view directly
    factory = APIRequestFactory()
    request = factory.get('/api/ecommerce/discounts/active/')
    view = DiscountViewSet.as_view({'get': 'active'})
    
    try:
        response = view(request)
        data = response.data
        print(f"Data type: {type(data)}")
        print(f"Data content: {data}")
        print(f"Endpoint returned {len(data)} items.")
        
        found = False
        for d in data:
            if d['id'] == bugged_discount.id:
                found = True
                break
        
        if found:
            print("FAIL: The endpoint returned the bugged discount! It should have been filtered out.")
        else:
            print("PASS: The endpoint correctly excluded the bugged discount.")
            
    except Exception as e:
        print(f"Error calling view: {e}")

if __name__ == '__main__':
    try:
        run_test()
    except Exception as e:
        print(f"Failed with error: {e}")
