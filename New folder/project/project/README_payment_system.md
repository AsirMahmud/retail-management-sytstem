# Enhanced Payment System Documentation

## Overview

The retail management system now includes a comprehensive payment functionality that supports:

- **Multiple Payment Methods**: Cash, Card, Mobile, Gift Cards
- **Split Payments**: Combination of payment methods for a single sale
- **Partial Payments**: Allow customers to pay partial amounts with due tracking
- **Gift Card Expense Integration**: Automatically records gift payments as expenses
- **Due Management**: Track and manage outstanding balances
- **Payment Analytics**: Detailed reporting on payment methods and due amounts

## API Endpoints

### Sales Endpoints

#### Create Sale with Payment
```http
POST /sales/sales/
Content-Type: application/json

{
  "customer_phone": "+1234567890",
  "customer_name": "John Doe",
  "items": [
    {
      "product_id": 1,
      "size": "M",
      "color": "Red",
      "quantity": 2,
      "unit_price": "25.00",
      "discount": "0.00"
    }
  ],
  "subtotal": "50.00",
  "tax": "5.00",
  "discount": "0.00",
  "total": "55.00",
  "payment_data": [
    {
      "method": "cash",
      "amount": "30.00",
      "notes": "Cash payment"
    },
    {
      "method": "card",
      "amount": "25.00",
      "transaction_id": "TXN123456"
    }
  ]
}
```

#### Add Payment to Existing Sale
```http
POST /sales/sales/{sale_id}/add_payment/
Content-Type: application/json

{
  "payment_data": [
    {
      "method": "cash",
      "amount": "20.00",
      "notes": "Partial payment"
    }
  ]
}
```

#### Process Split Payment
```http
POST /sales/sales/{sale_id}/split_payment/
Content-Type: application/json

{
  "payment_data": [
    {
      "method": "cash",
      "amount": "30.00"
    },
    {
      "method": "gift",
      "amount": "20.00",
      "notes": "Gift card payment"
    },
    {
      "method": "card",
      "amount": "5.00",
      "transaction_id": "CARD789"
    }
  ]
}
```

#### Get Payment Status
```http
GET /sales/sales/{sale_id}/payment_status/
```

Response:
```json
{
  "invoice_number": "INV-ABC123",
  "total": "55.00",
  "amount_paid": "45.00",
  "amount_due": "10.00",
  "gift_amount": "20.00",
  "payment_status": "partially_paid",
  "is_fully_paid": false,
  "payments": [...],
  "due_payments": [...]
}
```

#### Get Sales with Due Amounts
```http
GET /sales/sales/due_sales/
```

#### Payment Analytics
```http
GET /sales/sales/payment_analytics/
```

Response:
```json
{
  "payment_methods": [
    {
      "payment_method": "cash",
      "count": 25,
      "total_amount": "1250.00"
    }
  ],
  "due_summary": {
    "total_due": "500.00",
    "count_due_sales": 5
  },
  "gift_payments": {
    "total_gift_amount": "200.00",
    "gift_transactions": 8
  },
  "overdue_payments": {
    "overdue_amount": "150.00",
    "overdue_count": 2
  }
}
```

### Sale Payment Endpoints

#### List Sale Payments
```http
GET /sales/sale-payments/
GET /sales/sale-payments/?sale_id=123
GET /sales/sale-payments/?payment_method=gift
GET /sales/sale-payments/?gift_only=true
```

#### Create Individual Payment
```http
POST /sales/sale-payments/
Content-Type: application/json

{
  "sale": 123,
  "amount": "25.00",
  "payment_method": "card",
  "transaction_id": "TXN456789",
  "notes": "Card payment"
}
```

### Due Payment Endpoints

#### List Due Payments
```http
GET /sales/due-payments/
GET /sales/due-payments/?status=pending
GET /sales/due-payments/?overdue=true
GET /sales/due-payments/?customer_phone=+1234567890
```

#### Make Payment on Due Amount
```http
POST /sales/due-payments/{due_payment_id}/make_payment/
Content-Type: application/json

{
  "amount": "15.00",
  "payment_method": "cash",
  "notes": "Partial payment on due amount",
  "transaction_id": "CASH123"
}
```

#### Due Payments Summary
```http
GET /sales/due-payments/summary/
```

Response:
```json
{
  "total_due": "500.00",
  "overdue_amount": "150.00",
  "due_this_week": "75.00",
  "pending_count": 10,
  "overdue_count": 3
}
```

## Models

### Enhanced Sale Model
- `amount_paid`: Total amount paid for the sale
- `amount_due`: Remaining amount due
- `gift_amount`: Total gift card amount used
- `is_fully_paid`: Property indicating if sale is fully paid
- `payment_status`: Returns 'fully_paid', 'partially_paid', or 'unpaid'

### SalePayment Model
- Tracks individual payments for a sale
- Supports all payment methods including gift cards
- Automatically marks gift payments and creates expense records
- Links to sale and updates payment status

### DuePayment Model
- Tracks outstanding balances
- Supports partial payments over time
- Includes due dates and status tracking
- Provides methods to add payments and calculate remaining amounts

## Payment Processing Flow

### 1. Full Payment at Sale
```
Sale Created → Payment Processed → Sale Status: Completed
```

### 2. Split Payment
```
Sale Created → Multiple Payments Processed → Sale Status: Completed/Partially Paid
```

### 3. Partial Payment with Due
```
Sale Created → Partial Payment → Due Payment Record Created → Sale Status: Partially Paid
```

### 4. Gift Card Payment
```
Gift Payment Processed → Expense Record Created → Revenue Not Counted
```

### 5. Due Payment Collection
```
Due Payment Exists → Partial/Full Payment Made → Due Status Updated → Sale Status Updated
```

## Gift Card Expense Integration

When a gift card payment is processed:

1. **Payment Record**: Created in `SalePayment` with `is_gift_payment=True`
2. **Expense Creation**: Automatically creates expense record in expenses app
3. **Category**: Uses "Gift Card Payments" expense category (auto-created)
4. **Revenue Impact**: Gift amounts are NOT counted as revenue
5. **Tracking**: Gift amounts are tracked separately for reporting

## Usage Examples

### Frontend Integration

The enhanced `PaymentSection` component now supports:

- **Visual Payment Summary**: Shows total paid, remaining, and payment status
- **Split Payment UI**: Add/remove multiple payment methods
- **Gift Card Warnings**: Alerts users about expense recording
- **Partial Payment Options**: Checkbox to allow partial payments
- **Quick Amount Buttons**: Exact, percentage, and rounded amounts
- **Real-time Calculations**: Updates payment status as amounts change

### Backend Usage

```python
# Create sale with split payment
sale_data = {
    'items': [...],
    'total': 100.00,
    'payment_data': [
        {'method': 'cash', 'amount': 60.00},
        {'method': 'gift', 'amount': 40.00}
    ]
}
serializer = SaleSerializer(data=sale_data)
sale = serializer.save()

# Check payment status
print(f"Paid: {sale.amount_paid}")  # 100.00
print(f"Gift: {sale.gift_amount}")  # 40.00
print(f"Status: {sale.payment_status}")  # fully_paid

# Add payment to existing sale
sale.sale_payments.create(
    amount=25.00,
    payment_method='card',
    status='completed'
)
sale.update_payment_status()
```

## Benefits

1. **Flexibility**: Support for any combination of payment methods
2. **Accuracy**: Proper expense tracking for gift cards
3. **Customer Service**: Ability to accept partial payments
4. **Reporting**: Detailed analytics on payment methods and due amounts
5. **Compliance**: Proper financial record keeping
6. **User Experience**: Intuitive interface for complex payment scenarios

## Migration Notes

- Existing sales continue to work with legacy payment model
- New payment features are additive and backward compatible
- Gift payment expense integration requires expenses app
- Database migrations needed for new models

## Security Considerations

- Payment amounts validated on both frontend and backend
- Transaction IDs logged for audit trails
- Gift card expense tracking prevents revenue inflation
- Due payment status changes are atomic operations 