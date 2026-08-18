import requests
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

class SteadfastService:
    @staticmethod
    def get_headers():
        api_key = getattr(settings, 'STEADFAST_API_KEY', 'default_api_key')
        secret_key = getattr(settings, 'STEADFAST_SECRET_KEY', 'default_secret_key')
        return {
            'Api-Key': api_key,
            'Secret-Key': secret_key,
            'Content-Type': 'application/json'
        }

    @staticmethod
    def get_base_url():
        return getattr(settings, 'STEADFAST_BASE_URL', 'https://portal.steadfast.com.bd/api/v1')

    @classmethod
    def create_consignment(cls, order):
        """
        Creates a delivery consignment on Steadfast Courier portal.
        """
        url = f"{cls.get_base_url()}/create_order"
        
        # Build shipping address string
        address_str = ""
        if order.shipping_address and isinstance(order.shipping_address, dict):
            parts = [
                order.shipping_address.get('address'),
                order.shipping_address.get('area'),
                order.shipping_address.get('city')
            ]
            address_str = ", ".join([p for p in parts if p])
        
        if not address_str:
            address_str = "Customer Address"

        payload = {
            "invoice": str(order.id),
            "recipient_name": order.customer_name,
            "recipient_phone": order.customer_phone,
            "recipient_address": address_str,
            "cod_amount": float(order.total_amount or 0),
            "note": order.notes or f"Online Order #{order.id}"
        }

        try:
            logger.info(f"Posting to Steadfast API: {payload}")
            response = requests.post(url, json=payload, headers=cls.get_headers(), timeout=10)
            data = response.json()
            
            if response.status_code == 200 and data.get('status') == 200:
                consignment = data.get('consignment', {})
                return {
                    'success': True,
                    'consignment_id': str(consignment.get('consignment_id', '')),
                    'tracking_code': str(consignment.get('tracking_code', '')),
                    'status': consignment.get('status', 'in_review'),
                    'message': data.get('message', 'Booking successful')
                }
            else:
                # If API credentials are not set or fail in sandbox mode, fallback gracefully for demo/testing
                error_msg = data.get('message') or f"Steadfast Error Code {response.status_code}"
                return {
                    'success': False,
                    'message': error_msg,
                    'data': data
                }
        except Exception as e:
            logger.error(f"Steadfast API exception: {str(e)}")
            return {
                'success': False,
                'message': f"Failed to connect to Steadfast Courier: {str(e)}"
            }

    @classmethod
    def get_status(cls, consignment_id):
        """
        Fetches live tracking status for a consignment ID.
        """
        url = f"{cls.get_base_url()}/status_by_cid/{consignment_id}"
        try:
            response = requests.get(url, headers=cls.get_headers(), timeout=10)
            data = response.json()
            if response.status_code == 200:
                return {
                    'success': True,
                    'status': data.get('delivery_status') or data.get('status') or 'unknown',
                    'data': data
                }
            return {'success': False, 'message': 'Status fetch failed'}
        except Exception as e:
            return {'success': False, 'message': str(e)}

    @classmethod
    def check_fraud(cls, phone):
        """
        Queries Steadfast's official Fraud Check endpoint for a phone number.
        Endpoint: GET /fraud_check/{phone}
        """
        clean_phone = ''.join(filter(str.isdigit, str(phone)))
        url = f"{cls.get_base_url()}/fraud_check/{clean_phone}"
        try:
            response = requests.get(url, headers=cls.get_headers(), timeout=10)
            data = response.json()
            if response.status_code == 200:
                total_parcels = data.get('total_parcels', 0)
                total_delivered = data.get('total_delivered', 0)
                total_cancelled = data.get('total_cancelled', 0)
                
                # Calculate success rate percentage
                success_rate = (total_delivered / total_parcels * 100) if total_parcels > 0 else 100.0
                
                # Risk level decision
                if total_parcels >= 3 and success_rate < 50:
                    risk_level = 'HIGH_RISK'
                elif total_parcels >= 1 and success_rate >= 80:
                    risk_level = 'SAFE'
                else:
                    risk_level = 'NORMAL'

                return {
                    'success': True,
                    'phone': clean_phone,
                    'total_parcels': total_parcels,
                    'total_delivered': total_delivered,
                    'total_cancelled': total_cancelled,
                    'success_rate': round(success_rate, 1),
                    'risk_level': risk_level,
                    'data': data
                }
            return {
                'success': False,
                'message': data.get('message', 'Fraud check request failed')
            }
        except Exception as e:
            return {
                'success': False,
                'message': f"Error calling Steadfast Fraud Check: {str(e)}"
            }
