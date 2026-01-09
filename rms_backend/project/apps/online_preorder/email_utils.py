import logging
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from apps.ecommerce.models import HomePageSettings
from .models import OnlinePreorder

logger = logging.getLogger(__name__)

def send_admin_order_notification(order_id):
    """
    Sends a notification email to admin when a new order is created.
    """
    try:
        order = OnlinePreorder.objects.get(id=order_id)
        
        # Get settings for links and contact info
        try:
            home_settings = HomePageSettings.load()
            admin_email = home_settings.footer_email or settings.DEFAULT_FROM_EMAIL
            support_email = home_settings.footer_email or "support@rawstitch.info"
        except Exception:
            admin_email = settings.DEFAULT_FROM_EMAIL
            support_email = "support@rawstitch.info"

        # Prepare context for templates
        context = {
            'order_id': order.id,
            'customer_name': order.customer_name,
            'customer_phone': order.customer_phone,
            'date': order.created_at.strftime('%Y-%m-%d %H:%M'),
            'items': order.items,
            'subtotal': float(order.total_amount) - float(order.delivery_charge),
            'delivery_charge': order.delivery_charge,
            'total_amount': order.total_amount,
            'shipping_address': order.shipping_address or {},
            'support_email': support_email,
            'item_count': len(order.items),
            'admin_url': f"https://rawstitch.info/admin/online-orders/{order.id}"
        }

        # Send Email to Admin
        try:
            html_content_admin = render_to_string('emails/admin_new_order_alert.html', context)
            text_content_admin = strip_tags(html_content_admin)
            
            msg_admin = EmailMultiAlternatives(
                subject=f"NEW ORDER RECEIVED: # {order.id}",
                body=text_content_admin,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[admin_email]
            )
            msg_admin.attach_alternative(html_content_admin, "text/html")
            msg_admin.send()
            logger.info(f"Admin notification email sent to {admin_email} for order {order.id}")
        except Exception as e:
            logger.error(f"Failed to send admin email for order {order.id}: {str(e)}")

    except OnlinePreorder.DoesNotExist:
        logger.error(f"Order {order_id} not found for admin notification.")
    except Exception as e:
        logger.error(f"Unexpected error in send_admin_order_notification: {str(e)}")

def send_customer_order_confirmation(order_id):
    """
    Sends a confirmation email to the customer when their order is marked as CONFIRMED.
    """
    try:
        order = OnlinePreorder.objects.get(id=order_id)
        
        if not order.customer_email:
            logger.info(f"No customer email for order {order.id}, skipping confirmation.")
            return

        # Get settings for contact info
        try:
            home_settings = HomePageSettings.load()
            support_email = home_settings.footer_email or "support@rawstitch.info"
        except Exception:
            support_email = "support@rawstitch.info"

        # Prepare context for templates
        context = {
            'order_id': order.id,
            'customer_name': order.customer_name,
            'customer_phone': order.customer_phone,
            'date': order.created_at.strftime('%Y-%m-%d %H:%M'),
            'items': order.items,
            'subtotal': float(order.total_amount) - float(order.delivery_charge),
            'delivery_charge': order.delivery_charge,
            'total_amount': order.total_amount,
            'shipping_address': order.shipping_address or {},
            'support_email': support_email,
            'item_count': len(order.items),
        }

        try:
            html_content = render_to_string('emails/customer_order_confirmation.html', context)
            text_content = strip_tags(html_content)
            
            msg = EmailMultiAlternatives(
                subject=f"Order Confirmation # {order.id} - Raw Stitch",
                body=text_content,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[order.customer_email]
            )
            msg.attach_alternative(html_content, "text/html")
            msg.send()
            logger.info(f"Order confirmation email sent to {order.customer_email} for order {order.id}")
        except Exception as e:
            logger.error(f"Failed to send customer email for order {order.id}: {str(e)}")

    except OnlinePreorder.DoesNotExist:
        logger.error(f"Order {order_id} not found for customer confirmation.")
    except Exception as e:
        logger.error(f"Unexpected error in send_customer_order_confirmation: {str(e)}")

def send_customer_order_received(order_id):
    """
    Sends a "received" notification email to the customer when a new order is created.
    """
    try:
        order = OnlinePreorder.objects.get(id=order_id)
        
        if not order.customer_email:
            logger.info(f"No customer email for order {order.id}, skipping received notification.")
            return

        # Get settings for contact info
        try:
            home_settings = HomePageSettings.load()
            support_email = home_settings.footer_email or "support@rawstitch.info"
        except Exception:
            support_email = "support@rawstitch.info"

        # Prepare context for templates
        context = {
            'order_id': order.id,
            'customer_name': order.customer_name,
            'customer_phone': order.customer_phone,
            'date': order.created_at.strftime('%Y-%m-%d %H:%M'),
            'items': order.items,
            'subtotal': float(order.total_amount) - float(order.delivery_charge),
            'delivery_charge': order.delivery_charge,
            'total_amount': order.total_amount,
            'shipping_address': order.shipping_address or {},
            'support_email': support_email,
            'item_count': len(order.items),
        }

        try:
            html_content = render_to_string('emails/customer_order_received.html', context)
            text_content = strip_tags(html_content)
            
            msg = EmailMultiAlternatives(
                subject=f"Order Received # {order.id} - Raw Stitch",
                body=text_content,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[order.customer_email]
            )
            msg.attach_alternative(html_content, "text/html")
            msg.send()
            logger.info(f"Order received email sent to {order.customer_email} for order {order.id}")
        except Exception as e:
            logger.error(f"Failed to send customer received email for order {order.id}: {str(e)}")

    except OnlinePreorder.DoesNotExist:
        logger.error(f"Order {order_id} not found for customer received notification.")
    except Exception as e:
        logger.error(f"Unexpected error in send_customer_order_received: {str(e)}")

def send_delivery_notification(order_id):
    """
    Sends a notification email to the customer when their order is marked as DELIVERED.
    """
    try:
        from django.utils import timezone
        order = OnlinePreorder.objects.get(id=order_id)
        
        if not order.customer_email:
            logger.info(f"No customer email for order {order.id}, skipping delivery notification.")
            return

        # Get settings for contact info
        try:
            home_settings = HomePageSettings.load()
            support_email = home_settings.footer_email or "support@rawstitch.info"
        except Exception:
            support_email = "support@rawstitch.info"

        # Prepare context for template
        context = {
            'order_id': order.id,
            'customer_name': order.customer_name,
            'date': timezone.now().strftime('%Y-%m-%d %H:%M'),
            'total_amount': order.total_amount,
            'support_email': support_email,
        }

        try:
            html_content = render_to_string('emails/customer_order_delivered.html', context)
            text_content = strip_tags(html_content)
            
            msg = EmailMultiAlternatives(
                subject=f"Your order # {order.id} has been delivered! - Raw Stitch",
                body=text_content,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[order.customer_email]
            )
            msg.attach_alternative(html_content, "text/html")
            msg.send()
            logger.info(f"Delivery notification email sent to {order.customer_email} for order {order.id}")
        except Exception as e:
            logger.error(f"Failed to send delivery notification for order {order.id}: {str(e)}")

    except OnlinePreorder.DoesNotExist:
        logger.error(f"Order {order_id} not found for delivery notification.")
    except Exception as e:
        logger.error(f"Unexpected error in send_delivery_notification: {str(e)}")

