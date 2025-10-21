#!/usr/bin/env python
import os
import sys
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')
django.setup()

from apps.sales.serializers import SaleSerializer
from apps.sales.models import Sale, SalePayment
from apps.expenses.models import Expense
from decimal import Decimal

def test_gift_payment():
    print("Testing Gift Payment Functionality...")
    
    # Test data for a gift payment sale
    sale_data = {
        'customer_phone': '01816295343',
        'customer_name': 'Test Customer',
        'items': [
            {
                'product_id': 1,  # Assuming product with ID 1 exists
                'size': '54',
                'color': 'Brown',
                'quantity': 1,
                'unit_price': '1222.00',
                'discount': '0.00'
            }
        ],
        'subtotal': '1222.00',
        'tax': '0.00',
        'discount': '0.00',
        'total': '1222.00',
        'payment_method': 'gift',
        'status': 'pending',
        'notes': 'Test gift payment'
    }
    
    print("Creating sale with gift payment...")
    serializer = SaleSerializer(data=sale_data)
    
    if serializer.is_valid():
        sale = serializer.save()
        print(f"✅ Sale created: {sale.invoice_number}")
        print(f"   Status: {sale.status}")
        print(f"   Payment Method: {sale.payment_method}")
        print(f"   Amount Paid: {sale.amount_paid}")
        print(f"   Amount Due: {sale.amount_due}")
        print(f"   Gift Amount: {sale.gift_amount}")
        print(f"   Is Fully Paid: {sale.is_fully_paid}")
        
        # Check sale payments
        sale_payments = sale.sale_payments.all()
        print(f"   Sale Payments Count: {sale_payments.count()}")
        for payment in sale_payments:
            print(f"     - {payment.payment_method}: {payment.amount} ({payment.status})")
        
        # Check if expense was created
        expenses = Expense.objects.filter(reference_number=sale.invoice_number)
        print(f"   Expenses Created: {expenses.count()}")
        for expense in expenses:
            print(f"     - {expense.description}: {expense.amount}")
        
        return sale
    else:
        print("❌ Sale creation failed:")
        print(serializer.errors)
        return None

if __name__ == "__main__":
    test_gift_payment() 