"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Printer, Mail, ShoppingCart } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptData: any;
  onNewSale: () => void;
}

export function ReceiptModal({
  isOpen,
  onClose,
  receiptData,
  onNewSale,
}: ReceiptModalProps) {
  const handlePrint = () => {
    // TODO: Implement thermal printer integration
    window.print();
  };

  const handleEmail = () => {
    // TODO: Implement email receipt functionality
    console.log("Email receipt:", receiptData);
  };

  if (!receiptData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Receipt</DialogTitle>
          <DialogDescription>
            Transaction completed successfully.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-gray-50 p-4 rounded-md space-y-4">
            {/* Store Info */}
            <div className="text-center">
              <h3 className="font-bold text-lg">RETAIL STORE</h3>
              <p className="text-sm text-muted-foreground">
                123 Main Street, City
              </p>
              <p className="text-sm text-muted-foreground">
                Tel: (555) 123-4567
              </p>
              <p className="text-xs mt-2">
                {new Date(receiptData.date).toLocaleDateString()}{" "}
                {new Date(receiptData.date).toLocaleTimeString()}
              </p>
              <p className="text-xs font-medium">Receipt #{receiptData.id}</p>
            </div>

            <Separator />

            {/* Items List */}
            <div>
              <h4 className="font-medium mb-2">Items</h4>
              <div className="space-y-2">
                {receiptData.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div>
                      <p>
                        {item.name} ({item.size})
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} x {formatCurrency(item.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p>{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Price Breakdown */}
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatCurrency(receiptData.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>{formatCurrency(receiptData.tax)}</span>
              </div>
              <div className="flex justify-between font-bold mt-2">
                <span>Total</span>
                <span>{formatCurrency(receiptData.total)}</span>
              </div>
            </div>

            <Separator />

            {/* Payment Details */}
            <div>
              <h4 className="font-medium mb-1">Payment Method</h4>
              {receiptData.paymentMethod === "split" ? (
                <div className="space-y-1">
                  {receiptData.splitPayments.map(
                    (payment: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>
                          {payment.method === "card"
                            ? "Card"
                            : payment.method === "cash"
                            ? "Cash"
                            : payment.method === "mobile"
                            ? "Mobile Pay"
                            : "Gift Card"}
                        </span>
                        <span>
                          {formatCurrency(Number.parseFloat(payment.amount))}
                        </span>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p className="text-sm">
                  {receiptData.paymentMethod === "card"
                    ? "Card"
                    : receiptData.paymentMethod === "cash"
                    ? "Cash"
                    : receiptData.paymentMethod === "mobile"
                    ? "Mobile Pay"
                    : "Gift Card"}
                </p>
              )}

              {receiptData.paymentMethod === "cash" && (
                <div className="space-y-1 mt-2 text-sm">
                  <div className="flex justify-between">
                    <span>Cash Tendered</span>
                    <span>{formatCurrency(receiptData.cashAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Change</span>
                    <span>{formatCurrency(receiptData.changeDue)}</span>
                  </div>
                </div>
              )}
            </div>

            {receiptData.customer && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium mb-1">Customer</h4>
                  <p className="text-sm">{receiptData.customer.name}</p>
                  {receiptData.customer.email && (
                    <p className="text-xs text-muted-foreground">
                      {receiptData.customer.email}
                    </p>
                  )}
                  {receiptData.customer.loyaltyPoints !== undefined && (
                    <div className="mt-1">
                      <Badge variant="outline" className="text-xs">
                        Loyalty Points: {receiptData.customer.loyaltyPoints} (+
                        {Math.floor(receiptData.total)})
                      </Badge>
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="text-center text-xs text-muted-foreground mt-4">
              <p>Thank you for your purchase!</p>
              <p>
                Return policy: Items can be returned within 30 days with receipt
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="sm:flex-1" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print Receipt
          </Button>
          <Button variant="outline" className="sm:flex-1" onClick={handleEmail}>
            <Mail className="h-4 w-4 mr-2" />
            Email Receipt
          </Button>
          <Button className="sm:flex-1" onClick={onNewSale}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            New Sale
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
