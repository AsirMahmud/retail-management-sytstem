from datetime import timedelta
from decimal import Decimal
from django.utils import timezone
from django.db import models


def calculate_customer_order_stats(customer_phone: str, exclude_order_id: int = None):
    """
    Calculates historical order statistics for a given customer phone number.
    """
    from apps.online_preorder.models import OnlinePreorder

    if not customer_phone:
        return {
            'total_orders': 0,
            'delivered_count': 0,
            'cancelled_count': 0,
            'returned_refused_count': 0,
            'recent_orders_24h': 0,
            'recent_orders_7d': 0,
            'previous_total_value': 0.0,
            'previous_delivered_value': 0.0,
            'last_order_date': None,
        }

    qs = OnlinePreorder.objects.filter(customer_phone=customer_phone)
    if exclude_order_id:
        qs = qs.exclude(pk=exclude_order_id)

    total_orders = qs.count()
    if total_orders == 0:
        return {
            'total_orders': 0,
            'delivered_count': 0,
            'cancelled_count': 0,
            'returned_refused_count': 0,
            'recent_orders_24h': 0,
            'recent_orders_7d': 0,
            'previous_total_value': 0.0,
            'previous_delivered_value': 0.0,
            'last_order_date': None,
        }

    now = timezone.now()
    cutoff_24h = now - timedelta(hours=24)
    cutoff_7d = now - timedelta(days=7)

    delivered_count = qs.filter(status__in=['DELIVERED', 'COMPLETED']).count()
    cancelled_count = qs.filter(status='CANCELLED').count()

    # Returned/refused orders check
    refused_keywords = ['refus', 'return', 'fake', 'unreach', 'reject', 'denied']
    returned_refused_count = 0
    for order in qs.filter(status='CANCELLED'):
        reason = (getattr(order, 'cancel_reason', '') or '').lower()
        notes = (getattr(order, 'notes', '') or '').lower()
        is_fake = getattr(order, 'is_fake', False)
        if is_fake or any(k in reason for k in refused_keywords) or any(k in notes for k in refused_keywords):
            returned_refused_count += 1

    recent_orders_24h = qs.filter(created_at__gte=cutoff_24h).count()
    recent_orders_7d = qs.filter(created_at__gte=cutoff_7d).count()

    total_val = qs.aggregate(sum_val=models.Sum('total_amount'))['sum_val'] or Decimal('0.00')
    delivered_val = qs.filter(status__in=['DELIVERED', 'COMPLETED']).aggregate(sum_val=models.Sum('total_amount'))['sum_val'] or Decimal('0.00')

    last_order = qs.order_by('-created_at').first()
    last_order_date = last_order.created_at.isoformat() if last_order else None

    return {
        'total_orders': total_orders,
        'delivered_count': delivered_count,
        'cancelled_count': cancelled_count,
        'returned_refused_count': returned_refused_count,
        'recent_orders_24h': recent_orders_24h,
        'recent_orders_7d': recent_orders_7d,
        'previous_total_value': float(total_val),
        'previous_delivered_value': float(delivered_val),
        'last_order_date': last_order_date,
    }


def calculate_fraud_score(customer_phone: str, current_order_amount: float = 0.0, ip_address: str = None, fbp: str = None, fbc: str = None, exclude_order_id: int = None):
    """
    Computes a risk score (0-100) and risk level (LOW, MEDIUM, HIGH) for an order.
    Returns score, risk_level, customer stats, and matching signal descriptions.
    """
    from apps.online_preorder.models import OnlinePreorder

    stats = calculate_customer_order_stats(customer_phone, exclude_order_id=exclude_order_id)
    matching_signals = []
    score = 0

    total_orders = stats['total_orders']
    delivered = stats['delivered_count']
    cancelled = stats['cancelled_count']
    returned_refused = stats['returned_refused_count']
    recent_24h = stats['recent_orders_24h']

    # 1. Historical Refusals & Cancellations
    if returned_refused > 0:
        points = min(returned_refused * 25, 50)
        score += points
        matching_signals.append(f"{returned_refused} previous refused/fake order(s)")

    if total_orders >= 2 and cancelled > 0:
        cancel_ratio = cancelled / total_orders
        if cancel_ratio > 0.5:
            score += 25
            matching_signals.append(f"High cancellation rate ({int(cancel_ratio * 100)}%)")

    # 2. Rapid Order Frequency
    if recent_24h >= 2:
        score += 25
        matching_signals.append(f"{recent_24h + 1} orders placed within 24 hours")
    elif stats['recent_orders_7d'] >= 4:
        score += 15
        matching_signals.append(f"{stats['recent_orders_7d'] + 1} orders placed within 7 days")

    # 3. IP Sharing across multiple customer phone numbers
    if ip_address:
        now = timezone.now()
        cutoff_7d = now - timedelta(days=7)
        distinct_phones = OnlinePreorder.objects.filter(
            ip_address=ip_address,
            created_at__gte=cutoff_7d
        ).exclude(customer_phone=customer_phone).values('customer_phone').distinct().count()

        if distinct_phones >= 2:
            score += 25
            matching_signals.append(f"IP address shared with {distinct_phones} other customer phone(s) in last 7 days")

    # 4. _fbp / _fbc Device/Browser cookie sharing across multiple customer phones
    if fbp:
        distinct_fbp_phones = OnlinePreorder.objects.filter(
            fbp=fbp
        ).exclude(customer_phone=customer_phone).values('customer_phone').distinct().count()

        if distinct_fbp_phones >= 2:
            score += 20
            matching_signals.append(f"Browser pixel (_fbp) shared with {distinct_fbp_phones} other customer phone(s)")

    # 5. Unusually High Order Amount
    if current_order_amount > 25000:
        score += 20
        matching_signals.append(f"Unusually high order value (৳{int(current_order_amount):,})")

    # 6. Loyalty & Positive History Reduction (rewards good customers)
    if delivered >= 3:
        delivery_rate = delivered / max(total_orders, 1)
        if delivery_rate >= 0.8:
            score -= 25
            matching_signals.append(f"Strong delivery history ({delivered} successful deliveries)")

    # Clamp score between 0 and 100
    final_score = max(0, min(100, score))

    if final_score <= 30:
        risk_level = 'LOW'
    elif final_score <= 60:
        risk_level = 'MEDIUM'
    else:
        risk_level = 'HIGH'

    return {
        'risk_score': final_score,
        'risk_level': risk_level,
        'stats': stats,
        'matching_signals': matching_signals
    }
