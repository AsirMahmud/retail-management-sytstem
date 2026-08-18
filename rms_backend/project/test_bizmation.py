import os
import sys
import django
import json

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'rms.settings')
django.setup()

from apps.online_preorder.bizmation_service import submit_fake_order

def test_connection():
    print("Testing BizMation API Connection...")
    test_payload = {
        'customer_name': 'Test User',
        'customer_phone': '00000000000',
        'items': []
    }
    
    # We will submit a fake order which goes to custom-ft
    result = submit_fake_order(test_payload, reason="Testing API Integration from backend")
    if result:
        print("SUCCESS! The API token works and the request was accepted.")
    else:
        print("FAILED! Could not connect to BizMation or the request was rejected (Check token/URL).")

if __name__ == '__main__':
    test_connection()
