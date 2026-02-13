
import os
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.online_preorder.models import OnlinePreorder
from apps.customer.models import Customer
from apps.inventory.models import Product
from rest_framework.test import APIRequestFactory
from apps.online_preorder.views import OnlinePreorderViewSet

def test_manual_order_flow():
    print("Starting manual order flow test...")
    
    # Setup: Ensure a product exists
    product = Product.objects.first()
    if not product:
        print("No products found. Please create a product first.")
        return

    factory = APIRequestFactory()
    view = OnlinePreorderViewSet.as_view({'post': 'create'})

    # ---------------------------------------------------------
    # Scenario 1: New Customer
    # ---------------------------------------------------------
    phone = "01122334455"
    # Ensure customer doesn't exist
    Customer.objects.filter(phone=phone).delete()
    
    payload_new = {
        "customer_name": "New Customer",
        "customer_phone": phone,
        "customer_email": "new@example.com",
        "items": [
            {
                "product_id": product.id,
                "quantity": 1,
                # letting backend calculate price
            }
        ],
        "shipping_address": {
            "city_corporation": "Dhaka North",
            "thana": "Gulshan",
            "place": "Gulshan 1",
            "address": "House 10, Road 5"
        },
        "delivery_method": "Inside Dhaka",
        "delivery_charge": 60,
        "notes": "Test Order 1"
    }
    
    request = factory.post('/api/online/orders/', payload_new, format='json')
    response = view(request)
    
    if response.status_code == 201:
        print("[SUCCESS] Scenario 1: Order created.")
        order_id = response.data['id']
        
        # Verify Customer Creation
        try:
            customer = Customer.objects.get(phone=phone)
            print(f"  - Customer created: {customer}")
            # Address check: "House 10, Road 5, Gulshan 1, Gulshan, Dhaka North"
            expected_parts = ["House 10, Road 5", "Gulshan 1", "Gulshan", "Dhaka North"]
            # The backend joins with ", "
            # Let's check if parts are present in address
            if all(part in customer.address for part in expected_parts):
                 print("  - Address formatted correctly.")
            else:
                 print(f"  - [WARNING] Address format mismatch. Got: {customer.address}")
                 
        except Customer.DoesNotExist:
            print("  - [FAIL] Customer was NOT created.")
    else:
        print(f"[FAIL] Scenario 1: Order creation failed. {response.data}")

    # ---------------------------------------------------------
    # Scenario 2: Existing Customer (Update)
    # ---------------------------------------------------------
    # Update name and address
    payload_update = {
        "customer_name": "Updated Name", # Changed
        "customer_phone": phone, # Same phone
        "customer_email": "new@example.com",
        "items": [
            {
                "product_id": product.id,
                "quantity": 2
            }
        ],
        "shipping_address": {
            "division": "Chattogram",
            "district": "Chattogram",
            "upazila": "Panchlaish",
            "union": "",
            "address": "New Address Line"
        },
        "delivery_method": "Outside Dhaka",
        "delivery_charge": 120,
        "notes": "Test Order 2"
    }

    request = factory.post('/api/online/orders/', payload_update, format='json')
    response = view(request)
    
    if response.status_code == 201:
        print("[SUCCESS] Scenario 2: Order created for existing customer.")
        
        # Verify Customer Update
        customer.refresh_from_db()
        print(f"  - Customer updated: {customer}")
        
        if customer.first_name == "Updated" and customer.last_name == "Name":
            print("  - Name updated successfully.")
        else:
            print(f"  - [FAIL] Name mismatch. Got: {customer.first_name} {customer.last_name}")
            
        if "Chattogram" in customer.address and "New Address Line" in customer.address:
            print("  - Address updated successfully.")
        else:
            print(f"  - [FAIL] Address mismatch. Got: {customer.address}")
            
    else:
        print(f"[FAIL] Scenario 2: Order creation failed. {response.data}")

if __name__ == "__main__":
    test_manual_order_flow()
