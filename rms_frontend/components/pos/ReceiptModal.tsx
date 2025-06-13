import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ReceiptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: {
    id: string;
    date: string;
    items: any[];
    subtotal: number;
    discount?: { type: "percentage" | "fixed"; value: number } | null;
    discountedSubtotal: number;
    tax: number;
    total: number;
    paymentMethod: string;
    cashAmount: number | null;
    changeDue: number | null;
    customer: any;
    splitPayments: { method: string; amount: string }[] | null;
    storeCredit: number;
    isPaid: boolean;
  } | null;
  onNewSale: () => void;
  formatCurrency: (amount: number) => string;
}

export default function ReceiptModal({
  open,
  onOpenChange,
  data,
  onNewSale,
  formatCurrency,
}: ReceiptModalProps) {
  if (!data) return null;

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const receiptContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt</title>
          <style>
            @page {
              size: 58mm auto;
              margin: 0;
            }
            body {
              width: 58mm;
              margin: 0;
              padding: 5mm;
              font-family: 'Courier New', monospace;
              font-size: 15px;
              line-height: 1.4;
              color: #000;
              font-weight: 600;
            }
            .header {
              text-align: center;
              margin-bottom: 15px;
            }
            .store-name {
              font-size: 18px;
              font-weight: 800;
              margin-bottom: 8px;
            }
            .store-info {
              font-size: 14px;
              font-weight: 600;
              margin-bottom: 8px;
            }
            .receipt-details {
              margin-bottom: 15px;
              border-bottom: 2px dashed #000;
              padding-bottom: 8px;
              font-size: 15px;
              font-weight: 600;
            }
            .items {
              margin-bottom: 15px;
            }
            .item {
              margin-bottom: 8px;
            }
            .item-name {
              font-weight: 700;
              font-size: 15px;
            }
            .item-details {
              font-size: 14px;
              color: #000;
              font-weight: 600;
            }
            .item-total {
              font-weight: 700;
              text-align: right;
              font-size: 14px;
            }
            .totals {
              border-top: 2px dashed #000;
              padding-top: 8px;
              margin-bottom: 15px;
              font-size: 15px;
              font-weight: 600;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 5px;
              font-weight: 600;
            }
            .payment-details {
              border-top: 2px dashed #000;
              padding-top: 8px;
              margin-bottom: 15px;
              font-size: 15px;
              font-weight: 600;
            }
            .footer {
              text-align: center;
              font-size: 14px;
              margin-top: 15px;
              border-top: 2px dashed #000;
              padding-top: 8px;
              font-weight: 600;
            }
            .status {
              text-align: center;
              font-weight: 800;
              margin: 15px 0;
              font-size: 16px;
            }
            .discount {
              color: #000;
              font-weight: 700;
            }
            .store-credit {
              color: #000;
              font-weight: 700;
            }
            .change-due {
              color: #000;
              font-weight: 700;
            }
            .total-amount {
              font-size: 16px;
              font-weight: 800;
            }
            .split-payment-header {
              font-weight: 700;
              font-size: 15px;
              margin-bottom: 5px;
            }
            @media print {
              body {
                width: 58mm;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="store-name">RAW STITCH</div>
            <div class="store-info">Kapasia, Gazipur</div>
            <div class="store-info">Phone: 01338869901</div>
          </div>

          <div class="receipt-details">
            <div>Receipt #: ${data.id}</div>
            <div>Date: ${new Date(data.date).toLocaleString()}</div>
            ${
              data.customer
                ? `
             
              <div>Customer #: ${data.customer.id || "N/A"}</div>
              <div>Phone: ${data.customer.phone || "N/A"}</div>
            `
                : ""
            }
          </div>

          <div class="items">
            ${data.items
              .map(
                (item) => `
              <div class="item">
                <div class="item-name">${item.name}</div>
                <div class="item-details">
                  ${item.quantity} x ${formatCurrency(item.price)}
                  ${
                    item.discount
                      ? `
                    <span class="discount">
                      (-${
                        item.discount.type === "percentage"
                          ? `${item.discount.value}%`
                          : formatCurrency(item.discount.value)
                      })
                    </span>
                  `
                      : ""
                  }
                </div>
                <div class="item-total">
                  ${formatCurrency(item.price * item.quantity)}
                  ${
                    item.discount
                      ? `
                    <span class="discount">
                      -${formatCurrency(
                        item.discount.type === "percentage"
                          ? (item.price * item.quantity * item.discount.value) /
                              100
                          : item.discount.value
                      )}
                    </span>
                  `
                      : ""
                  }
                </div>
              </div>
            `
              )
              .join("")}
          </div>

          <div class="totals">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>${formatCurrency(data.subtotal)}</span>
            </div>
            ${
              data.discount
                ? `
              <div class="total-row">
                <span>Discount:</span>
                <span class="discount">
                  -${formatCurrency(
                    data.discount.type === "percentage"
                      ? (data.subtotal * data.discount.value) / 100
                      : data.discount.value
                  )}
                </span>
              </div>
            `
                : ""
            }
            <div class="total-row">
              <span>Tax:</span>
              <span>${formatCurrency(data.tax)}</span>
            </div>
            ${
              data.storeCredit > 0
                ? `
              <div class="total-row">
                <span>Store Credit:</span>
                <span class="store-credit">-${formatCurrency(
                  data.storeCredit
                )}</span>
              </div>
            `
                : ""
            }
            <div class="total-row total-amount">
              <span>Total:</span>
              <span>${formatCurrency(data.total)}</span>
            </div>
          </div>

          <div class="payment-details">
            <div class="total-row">
              <span>Payment Method:</span>
              <span>${data.paymentMethod}</span>
            </div>
            ${
              data.paymentMethod === "cash" && data.cashAmount
                ? `
              <div class="total-row">
                <span>Cash Tendered:</span>
                <span>${formatCurrency(data.cashAmount)}</span>
              </div>
              <div class="total-row">
                <span>Change Due:</span>
                <span class="change-due">${formatCurrency(
                  data.changeDue || 0
                )}</span>
              </div>
            `
                : ""
            }
            ${
              data.splitPayments
                ? `
              <div style="margin-top: 8px;">
                <div class="split-payment-header">Split Payments:</div>
                ${data.splitPayments
                  .map(
                    (payment) => `
                  <div class="total-row">
                    <span>${payment.method}:</span>
                    <span>${formatCurrency(Number(payment.amount))}</span>
                  </div>
                `
                  )
                  .join("")}
              </div>
            `
                : ""
            }
          </div>

          <div class="status" style="color: ${data.isPaid ? "#000" : "#000"}">
            ${data.isPaid ? "PAID" : "DUE"}
          </div>

          <div class="footer">
            <div>Thanks for your purchase!</div>
            <div style=>Return policy:3 days with receipt before wash </div>
          </div>

          <div class="no-print" style="margin-top: 20px; text-align: center;">
            <button onclick="window.print()">Print Receipt</button>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(receiptContent);
    printWindow.document.close();

    // Auto print after a short delay
    setTimeout(() => {
      printWindow.print();
      // Close the window after printing
      setTimeout(() => {
        printWindow.close();
      }, 1000);
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Receipt</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Receipt Header */}
          <div className="text-center space-y-1">
            <h2 className="text-lg font-bold">RAW STITCH</h2>
            <p className="text-sm text-muted-foreground">Kapasia, Gazipur</p>
            <p className="text-sm text-muted-foreground">
              Phone: (555) 123-4567
            </p>
          </div>

          {/* Receipt Details */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Receipt #:</span>
              <span>{data.id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Date:</span>
              <span>{new Date(data.date).toLocaleString()}</span>
            </div>
            {data.customer && (
              <>
                <div className="flex justify-between text-sm">
                  <span>Customer:</span>
                  <span>{data.customer.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Customer #:</span>
                  <span>{data.customer.id || "N/A"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Phone:</span>
                  <span>{data.customer.phone || "N/A"}</span>
                </div>
              </>
            )}
          </div>

          {/* Items */}
          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              {data.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div>
                    <p>{item.name}</p>
                    <p className="text-muted-foreground">
                      {item.quantity} x {formatCurrency(item.price)}
                      {item.discount && (
                        <span className="text-red-600 ml-1">
                          (-
                          {item.discount.type === "percentage"
                            ? `${item.discount.value}%`
                            : formatCurrency(item.discount.value)}
                          )
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p>{formatCurrency(item.price * item.quantity)}</p>
                    {item.discount && (
                      <p className="text-red-600">
                        -
                        {formatCurrency(
                          item.discount.type === "percentage"
                            ? (item.price *
                                item.quantity *
                                item.discount.value) /
                                100
                            : item.discount.value
                        )}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Totals */}
          <div className="space-y-2 border-t pt-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatCurrency(data.subtotal)}</span>
            </div>
            {data.discount && (
              <div className="flex justify-between text-red-600">
                <span>Discount:</span>
                <span>
                  -
                  {formatCurrency(
                    data.discount.type === "percentage"
                      ? (data.subtotal * data.discount.value) / 100
                      : data.discount.value
                  )}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>{formatCurrency(data.tax)}</span>
            </div>
            {data.storeCredit > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Store Credit:</span>
                <span>-{formatCurrency(data.storeCredit)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold border-t pt-2">
              <span>Total:</span>
              <span>{formatCurrency(data.total)}</span>
            </div>
          </div>

          {/* Payment Details */}
          <div className="space-y-2 border-t pt-2">
            <div className="flex justify-between">
              <span>Payment Method:</span>
              <span className="capitalize">{data.paymentMethod}</span>
            </div>
            {data.paymentMethod === "cash" && data.cashAmount && (
              <>
                <div className="flex justify-between">
                  <span>Cash Tendered:</span>
                  <span>{formatCurrency(data.cashAmount)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Change Due:</span>
                  <span>{formatCurrency(data.changeDue || 0)}</span>
                </div>
              </>
            )}
            {data.splitPayments && (
              <div className="space-y-1">
                <p className="font-medium">Split Payments:</p>
                {data.splitPayments.map((payment, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="capitalize">{payment.method}:</span>
                    <span>{formatCurrency(Number(payment.amount))}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status */}
          <div className="text-center text-sm">
            <p className={data.isPaid ? "text-green-600" : "text-red-600"}>
              {data.isPaid ? "PAID" : "DUE"}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={handlePrint}>
              Print Receipt
            </Button>
            <Button className="flex-1" onClick={onNewSale}>
              New Sale
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
