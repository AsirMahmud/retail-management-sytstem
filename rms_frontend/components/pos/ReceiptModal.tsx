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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Receipt</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Receipt Header */}
          <div className="text-center space-y-1">
            <h2 className="text-lg font-bold">Your Store Name</h2>
            <p className="text-sm text-muted-foreground">123 Store Street</p>
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
              <div className="flex justify-between text-sm">
                <span>Customer:</span>
                <span>{data.customer.name}</span>
              </div>
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
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => window.print()}
            >
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
