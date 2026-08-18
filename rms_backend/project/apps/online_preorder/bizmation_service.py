import requests
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

def get_bizmation_headers():
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': f'Bearer {settings.BIZMATION_API_TOKEN}'
    }

def is_suspected_fake_order(order_data: dict) -> bool:
    """
    Evaluates order data to determine if it's likely a fake order.
    Customize this logic according to the business rules.
    """
    # Check for empty or obviously fake phone numbers
    phone = order_data.get('customer_phone', '').strip()
    if not phone or len(phone) < 10 or phone == '00000000000':
        return True
    
    # Check for common test names
    name = order_data.get('customer_name', '').strip().lower()
    test_names = ['test', 'fake', 'dummy', 'asdf']
    if any(test_name in name for test_name in test_names):
        return True
        
    return False

def submit_valid_order(order) -> bool:
    """
    Submits a valid order to the BizMation Create Order API.
    API URL: https://api.bizmation.io/api/orders/store
    Method: POST
    """
    url = f"{settings.BIZMATION_API_URL.rstrip('/')}/api/orders/store"
    
    # Format payload according to API requirements
    # Adjust this based on exact BizMation API schema if needed
    payload = {
        'customer_name': order.customer_name,
        'customer_phone': order.customer_phone,
        'customer_email': order.customer_email,
        'total_amount': str(order.total_amount),
        'shipping_address': order.shipping_address,
        'items': order.items,
        # 'uu_id': ..., # Add other fields as required by BizMation
    }
    
    try:
        response = requests.post(url, json=payload, headers=get_bizmation_headers(), timeout=10)
        response.raise_for_status()
        return True
    except requests.exceptions.RequestException as e:
        logger.error(f"Failed to submit valid order {order.id} to BizMation: {e}")
        return False

def submit_fake_order(order_data: dict, reason: str = "Suspected fake order") -> bool:
    """
    Submits a failed or suspected fake order to the BizMation Custom Fake Tracker API.
    API URL: https://api.bizmation.io/api/orders/custom-ft
    Method: POST
    """
    url = f"{settings.BIZMATION_API_URL.rstrip('/')}/api/orders/custom-ft"
    
    # Format payload according to API requirements
    payload = {
        'customer_name': order_data.get('customer_name', ''),
        'customer_phone': order_data.get('customer_phone', ''),
        'reason': reason,
        'order_data': order_data
    }
    
    try:
        response = requests.post(url, json=payload, headers=get_bizmation_headers(), timeout=10)
        response.raise_for_status()
        return True
    except requests.exceptions.RequestException as e:
        logger.error(f"Failed to submit fake order to BizMation: {e}")
        return False
