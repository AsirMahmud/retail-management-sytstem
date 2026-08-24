import hashlib
import json
import logging
import urllib.request
import urllib.parse
from django.conf import settings
from django.utils import timezone
from django.db import transaction

logger = logging.getLogger(__name__)


def hash_meta_data(val: str) -> str:
    """
    Normalizes string and computes SHA-256 hash required by Meta CAPI for PII fields.
    """
    if not val:
        return None
    cleaned = str(val).strip().lower()
    if not cleaned:
        return None
    return hashlib.sha256(cleaned.encode('utf-8')).hexdigest()


def normalize_phone_for_meta(phone: str) -> str:
    """
    Normalizes Bangladesh phone numbers to E.164 standard. E.g. "01712345678" -> "+8801712345678"
    """
    if not phone:
        return ""
    digits = ''.join(c for c in str(phone) if c.isdigit())
    if not digits:
        return ""

    if digits.startswith('880'):
        return f"+{digits}"
    elif digits.startswith('0'):
        return f"+88{digits}"
    elif digits.startswith('1'):
        return f"+880{digits}"
    return f"+{digits}"


def parse_customer_name(full_name: str):
    if not full_name:
        return "", ""
    parts = full_name.strip().split(maxsplit=1)
    first_name = parts[0] if len(parts) > 0 else ""
    last_name = parts[1] if len(parts) > 1 else ""
    return first_name, last_name


def dispatch_meta_purchase_event(order):
    """
    Reliably dispatches a Meta Purchase CAPI event for an OnlinePreorder when it reaches conversion status.
    Guarantees idempotency via purchase_event_sent check and atomic locking.
    """
    from apps.online_preorder.models import OnlinePreorder, MetaEventLog

    with transaction.atomic():
        # Lock row for update to prevent concurrent double dispatch
        locked_order = OnlinePreorder.objects.select_for_update().get(pk=order.pk)

        if locked_order.purchase_event_sent:
            logger.info(f"Purchase CAPI event already sent for Order #{order.id}. Skipping.")
            return {
                'status': 'SKIPPED',
                'message': f"Purchase event already sent for Order #{order.id} at {locked_order.purchase_event_sent_at}"
            }

        event_id = locked_order.event_id or f"purchase_{locked_order.id}"
        if not locked_order.event_id:
            locked_order.event_id = event_id

        first_name, last_name = parse_customer_name(locked_order.customer_name)
        phone_normalized = normalize_phone_for_meta(locked_order.customer_phone)

        # Shipping city extraction
        shipping_addr = locked_order.shipping_address or {}
        city = shipping_addr.get('city_corporation') or shipping_addr.get('city') or shipping_addr.get('thana') or shipping_addr.get('district') or ""

        # Build Hashed User Data for Meta Advanced Matching
        user_data = {}

        fn_hash = hash_meta_data(first_name)
        if fn_hash:
            user_data['fn'] = [fn_hash]

        ln_hash = hash_meta_data(last_name)
        if ln_hash:
            user_data['ln'] = [ln_hash]

        if locked_order.customer_email:
            em_hash = hash_meta_data(locked_order.customer_email)
            if em_hash:
                user_data['em'] = [em_hash]

        if phone_normalized:
            ph_hash = hash_meta_data(phone_normalized)
            if ph_hash:
                user_data['ph'] = [ph_hash]

        if city:
            ct_hash = hash_meta_data(city)
            if ct_hash:
                user_data['ct'] = [ct_hash]

        user_data['country'] = [hash_meta_data('bd')]

        # Raw values (NOT hashed per Meta spec)
        if locked_order.fbp:
            user_data['fbp'] = locked_order.fbp
        if locked_order.fbc:
            user_data['fbc'] = locked_order.fbc
        if locked_order.ip_address:
            user_data['client_ip_address'] = locked_order.ip_address
        if locked_order.user_agent:
            user_data['client_user_agent'] = locked_order.user_agent
        if phone_normalized:
            user_data['external_id'] = [hash_meta_data(phone_normalized)]

        # Build Line Items Content Payload
        contents = []
        for item in locked_order.items or []:
            color_slug = (item.get('color') or '').strip().lower().replace(' ', '-')
            item_id = f"{item.get('product_id')}-{color_slug}" if color_slug else str(item.get('product_id'))
            contents.append({
                'id': item_id,
                'quantity': int(item.get('quantity', 1)),
                'item_price': float(item.get('unit_price', 0))
            })

        payload = {
            "data": [
                {
                    "event_name": "Purchase",
                    "event_time": int(timezone.now().timestamp()),
                    "event_id": event_id,
                    "action_source": "website",
                    "event_source_url": getattr(settings, 'SITE_URL', 'https://rawstitch.com.bd'),
                    "user_data": user_data,
                    "custom_data": {
                        "currency": "BDT",
                        "value": float(locked_order.total_amount or 0),
                        "content_type": "product",
                        "contents": contents,
                        "order_id": str(locked_order.id)
                    }
                }
            ]
        }

        pixel_id = getattr(settings, 'META_PIXEL_ID', None) or getattr(settings, 'FACEBOOK_PIXEL_ID', None)
        access_token = getattr(settings, 'META_CAPI_ACCESS_TOKEN', None) or getattr(settings, 'FACEBOOK_ACCESS_TOKEN', None)
        gtm_server_url = getattr(settings, 'GTM_SERVER_URL', None)

        response_code = 200
        response_body = ""
        error_msg = ""
        dispatch_status = 'SUCCESS'

        if pixel_id and access_token:
            endpoint = f"https://graph.facebook.com/v19.0/{pixel_id}/events?access_token={access_token}"
            try:
                data_bytes = json.dumps(payload).encode('utf-8')
                req = urllib.request.Request(
                    endpoint,
                    data=data_bytes,
                    headers={'Content-Type': 'application/json'}
                )
                with urllib.request.urlopen(req, timeout=10) as resp:
                    response_code = resp.status
                    response_body = resp.read().decode('utf-8')
            except Exception as e:
                response_code = getattr(e, 'code', 500)
                error_msg = str(e)
                dispatch_status = 'FAILED'
                logger.error(f"Meta CAPI dispatch error for Order #{locked_order.id}: {error_msg}")
        elif gtm_server_url:
            endpoint = gtm_server_url
            try:
                data_bytes = json.dumps(payload).encode('utf-8')
                req = urllib.request.Request(
                    endpoint,
                    data=data_bytes,
                    headers={'Content-Type': 'application/json'}
                )
                with urllib.request.urlopen(req, timeout=10) as resp:
                    response_code = resp.status
                    response_body = resp.read().decode('utf-8')
            except Exception as e:
                response_code = getattr(e, 'code', 500)
                error_msg = str(e)
                dispatch_status = 'FAILED'
                logger.error(f"GTM Server dispatch error for Order #{locked_order.id}: {error_msg}")
        else:
            # Dev / Staging fallback: Log payload safely without throwing error
            response_body = json.dumps({"note": "Meta Pixel credentials not configured in environment; payload logged successfully."})
            logger.info(f"Meta CAPI payload logged for Order #{locked_order.id}: {payload}")

        # Update order idempotency tracking
        if dispatch_status == 'SUCCESS':
            locked_order.purchase_event_sent = True
            locked_order.purchase_event_sent_at = timezone.now()
            locked_order.save(update_fields=['event_id', 'purchase_event_sent', 'purchase_event_sent_at', 'updated_at'])

        # Create audit log entry
        MetaEventLog.objects.create(
            online_preorder=locked_order,
            event_id=event_id,
            event_name='Purchase',
            action_source='website',
            status=dispatch_status,
            request_payload=payload,
            response_code=response_code,
            response_body=response_body[:2000],
            error_message=error_msg[:1000]
        )

        return {
            'status': dispatch_status,
            'event_id': event_id,
            'response_code': response_code,
            'error_message': error_msg
        }
