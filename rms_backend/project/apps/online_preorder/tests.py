from django.test import TestCase, Client
from rest_framework import status
from apps.online_preorder.models import OnlinePreorder, MetaEventLog
from apps.online_preorder.services.fraud_scoring import calculate_fraud_score
from apps.online_preorder.services.meta_capi import dispatch_meta_purchase_event


class OrderTrackingFraudMetaTest(TestCase):
    def setUp(self):
        self.client = Client()
        from apps.inventory.models import Product, ProductVariation
        self.product = Product.objects.create(
            id=1,
            name="Test T-Shirt",
            sku="TST-001",
            selling_price=1500,
            cost_price=1000,
            stock_quantity=100,
            is_active=True,
            assign_to_online=True
        )
        ProductVariation.objects.create(
            product=self.product,
            size="M",
            color="Black",
            stock=50
        )
        ProductVariation.objects.create(
            product=self.product,
            size="L",
            color="White",
            stock=50
        )

    def test_create_order_with_attribution_and_fraud_signals(self):
        payload = {
            "customer_name": "Test Customer",
            "customer_phone": "01700000001",
            "customer_email": "test@example.com",
            "shipping_address": {"address": "House 12, Road 4, Sector 3, Uttara", "city": "Dhaka"},
            "delivery_charge": 80,
            "delivery_method": "Inside Dhaka",
            "items": [
                {
                    "product_id": 1,
                    "size": "M",
                    "color": "Black",
                    "quantity": 1,
                    "unit_price": 1500,
                    "discount": 0
                }
            ],
            "fbp": "fb.1.1680000000.123456789",
            "fbclid": "IwAR0123456789abcdef",
            "fbc": "fb.1.1680000000.IwAR0123456789abcdef",
            "utm_source": "facebook",
            "utm_medium": "cpc",
            "utm_campaign": "summer_sale",
            "utm_content": "ad_variant_a",
            "utm_term": "tshirt",
            "session_id": "sess_12345678"
        }

        response = self.client.post(
            '/api/ecommerce/orders/create/',
            data=payload,
            content_type='application/json',
            HTTP_X_FORWARDED_FOR='103.14.23.10',
            HTTP_USER_AGENT='Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        order_id = response.data['id']

        order = OnlinePreorder.objects.get(pk=order_id)
        self.assertEqual(order.fbp, "fb.1.1680000000.123456789")
        self.assertEqual(order.fbclid, "IwAR0123456789abcdef")
        self.assertTrue(order.fbc.startswith("fb.1."))
        self.assertEqual(order.utm_source, "facebook")
        self.assertEqual(order.utm_campaign, "summer_sale")
        self.assertEqual(order.ip_address, "103.14.23.10")
        self.assertEqual(order.event_id, f"purchase_{order_id}")
        self.assertFalse(order.purchase_event_sent)
        self.assertIsNotNone(order.risk_level)

    def test_fbc_null_when_no_fbclid(self):
        payload = {
            "customer_name": "No Click Customer",
            "customer_phone": "01700000002",
            "items": [
                {
                    "product_id": 1,
                    "size": "L",
                    "color": "White",
                    "quantity": 1,
                    "unit_price": 1200,
                    "discount": 0
                }
            ],
            "fbp": "fb.1.1680000000.987654321",
            "utm_source": "google"
        }

        response = self.client.post(
            '/api/ecommerce/orders/create/',
            data=payload,
            content_type='application/json'
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        order_id = response.data['id']
        order = OnlinePreorder.objects.get(pk=order_id)

        self.assertIsNone(order.fbc)
        self.assertIsNone(order.fbclid)
        self.assertEqual(order.fbp, "fb.1.1680000000.987654321")

    def test_fraud_scoring_logic(self):
        phone = "01700000003"
        # Create 2 fake cancelled orders
        OnlinePreorder.objects.create(
            customer_name="Refused User",
            customer_phone=phone,
            status="CANCELLED",
            cancel_reason="Fake Customer / Fake Order",
            is_fake=True,
            total_amount=2000
        )
        OnlinePreorder.objects.create(
            customer_name="Refused User",
            customer_phone=phone,
            status="CANCELLED",
            cancel_reason="Refused delivery at doorstep",
            total_amount=2000
        )

        result = calculate_fraud_score(
            customer_phone=phone,
            current_order_amount=30000.0,
            fbp="fb.1.shared.123"
        )

        self.assertGreater(result['risk_score'], 50)
        self.assertIn(result['risk_level'], ['MEDIUM', 'HIGH'])
        self.assertEqual(result['stats']['returned_refused_count'], 2)

    def test_meta_purchase_event_on_confirm_idempotent(self):
        order = OnlinePreorder.objects.create(
            customer_name="Confirm Customer",
            customer_phone="01700000004",
            total_amount=3500,
            status="PENDING",
            fbp="fb.1.168.111",
            fbclid="click_123",
            fbc="fb.1.168.click_123"
        )
        self.assertFalse(order.purchase_event_sent)

        # Confirm order via patch request
        patch_resp = self.client.patch(
            f'/api/online-preorder/orders/{order.id}/',
            data={"status": "CONFIRMED"},
            content_type='application/json'
        )
        self.assertEqual(patch_resp.status_code, status.HTTP_200_OK)

        order.refresh_from_db()
        self.assertTrue(order.purchase_event_sent)
        self.assertIsNotNone(order.purchase_event_sent_at)
        self.assertEqual(MetaEventLog.objects.filter(online_preorder=order, event_name='Purchase').count(), 1)

        # Confirm second time (idempotency check)
        second_patch = self.client.patch(
            f'/api/online-preorder/orders/{order.id}/',
            data={"status": "CONFIRMED"},
            content_type='application/json'
        )
        self.assertEqual(second_patch.status_code, status.HTTP_200_OK)
        self.assertEqual(MetaEventLog.objects.filter(online_preorder=order, event_name='Purchase').count(), 1)

    def test_backward_compatibility_old_orders(self):
        old_order = OnlinePreorder.objects.create(
            customer_name="Old Customer",
            customer_phone="01700000005",
            total_amount=1000,
            status="PENDING"
        )

        resp = self.client.get(f'/api/online-preorder/orders/{old_order.id}/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn('fraud_summary', resp.data)

        # Confirm old order without attribution data
        res = dispatch_meta_purchase_event(old_order)
        self.assertEqual(res['status'], 'SUCCESS')
