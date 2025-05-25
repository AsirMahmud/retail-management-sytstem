"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Printer, Mail, Download, Share2 } from "lucide-react"

interface ReceiptModalProps {
  open: boolean
  onClose?: () => void
  onNewSale: () => void
  data: any
}

export function ReceiptModal({ open, onClose, onNewSale, data }: ReceiptModalProps) {
  const [isPrinting, setIsPrinting] = useState(false)

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date)
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    if (amount === undefined || amount === null) return "$0.00"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const handlePrint = () => {
    setIsPrinting(true)
    setTimeout(() => {
      window.print()
      setIsPrinting(false)
    }, 500)
  }

  if (!data) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Receipt</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 my-2 print:text-black" id="receipt-to-print">
          {/* Receipt Header */}
          <div className="text-center space-y-1">
            <h2 className="font-bold text-lg">RETAIL MANAGEMENT SYSTEM</h2>
            <p className="text-sm text-muted-foreground">123 Main Street, Anytown, USA</p>
            <p className="text-sm text-muted-foreground">Tel: (555) 123-4567</p>
            <div className="flex justify-between text-sm mt-2">
              <span>Receipt #: {data.id || "N/A"}</span>
              <span>{formatDate(data.date)}</span>
            </div>
          </div>

          <Separator />

          {/* Customer Info */}
          {data.customer && (
            <div className="text-sm">
              <p className="font-medium">Customer:</p>
              <p>{data.customer.name}</p>
              {data.customer.email && <p>{data.customer.email}</p>}
              {data.customer.phone && <p>{data.customer.phone}</p>}
              {data.customer.loyaltyPoints > 0 && <p className="mt-1">Loyalty Points: {data.customer.loyaltyPoints}</p>}
            </div>
          )}

          {/* Items */}
          <div>
            <h3 className="font-medium mb-2">Items:</h3>
            <div className="space-y-2">
              {data.items &&
                data.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <div>
                      <span>
                        {item.quantity} x {item.name}
                      </span>
                      <div className="text-xs text-muted-foreground">
                        Size: {item.size}, Color: {item.color}
                      </div>
                      {item.discount && (
                        <div className="text-xs text-green-600">
                          {item.discount.type === "percentage"
                            ? `${item.discount.value}% OFF`
                            : `${formatCurrency(item.discount.value)} OFF`}
                        </div>
                      )}
                    </div>
                    <span className="font-medium">
                      {formatCurrency(
                        item.discount
                          ? item.discount.type === "percentage"
                            ? item.price * item.quantity * (1 - item.discount.value / 100)
                            : item.price * item.quantity - item.discount.value
                          : item.price * item.quantity,
                      )}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          <Separator />

          {/* Totals */}
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>{formatCurrency(data.subtotal)}</span>
            </div>

            {data.discount && (
              <div className="flex justify-between text-sm text-green-600">
                <span>
                  Discount
                  {data.discount.type === "percentage" ? ` (${data.discount.value}%)` : ""}:
                </span>
                <span>-{formatCurrency(data.subtotal - data.discountedSubtotal)}</span>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span>Tax (8.25%):</span>
              <span>{formatCurrency(data.tax)}</span>
            </div>

            {data.storeCredit > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Store Credit Applied:</span>
                <span>-{formatCurrency(data.storeCredit)}</span>
              </div>
            )}

            <div className="flex justify-between font-bold mt-2">
              <span>Total:</span>
              <span>{formatCurrency(data.total)}</span>
            </div>
          </div>

          {/* Payment Info */}
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Payment Method:</span>
              <span className="capitalize">{data.paymentMethod}</span>
            </div>

            {data.paymentMethod === "cash" && data.cashAmount !== null && (
              <>
                <div className="flex justify-between text-sm">
                  <span>Cash Tendered:</span>
                  <span>{formatCurrency(data.cashAmount || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Change:</span>
                  <span>{formatCurrency(data.changeDue || 0)}</span>
                </div>
              </>
            )}

            {data.paymentMethod === "split" && data.splitPayments && (
              <div className="space-y-1">
                {data.splitPayments.map((payment, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="capitalize">{payment.method}:</span>
                    <span>{formatCurrency(Number(payment.amount))}</span>
                  </div>
                ))}
              </div>
            )}

            {data.isPaid === false && (
              <div className="mt-2">
                <Badge variant="destructive">PAYMENT DUE</Badge>
              </div>
            )}
          </div>

          <Separator />

          {/* Footer */}
          <div className="text-center space-y-1 text-sm">
            <p>Thank you for your purchase!</p>
            <p className="text-xs text-muted-foreground">
              Return policy: Items can be returned within 30 days with receipt
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 print:hidden">
          <div className="grid grid-cols-2 gap-2 w-full">
            <Button variant="outline" onClick={handlePrint} disabled={isPrinting}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Email
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="outline">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
          <Button className="w-full" onClick={onNewSale}>
            Start New Sale
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
