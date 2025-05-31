import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreditCard,
  DollarSign,
  Smartphone,
  Gift,
  Zap,
  ChevronUp,
  ChevronDown,
  X,
  Plus,
} from "lucide-react";
import { PaymentMethod } from "@/types/sales";

interface PaymentSectionProps {
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  showSplitPayment: boolean;
  setShowSplitPayment: (show: boolean) => void;
  splitPayments: { method: PaymentMethod; amount: string }[];
  handleSplitPaymentChange: (
    index: number,
    field: string,
    value: string
  ) => void;
  removeSplitPaymentMethod: (index: number) => void;
  addSplitPaymentMethod: () => void;
  cashAmount: string;
  setCashAmount: (amount: string) => void;
  total: number;
  changeDue: number;
  cart: any[];
  handleCompletePayment: () => void;
  formatCurrency: (amount: number) => string;
}

export default function PaymentSection({
  paymentMethod,
  setPaymentMethod,
  showSplitPayment,
  setShowSplitPayment,
  splitPayments,
  handleSplitPaymentChange,
  removeSplitPaymentMethod,
  addSplitPaymentMethod,
  cashAmount,
  setCashAmount,
  total,
  changeDue,
  cart,
  handleCompletePayment,
  formatCurrency,
}: PaymentSectionProps) {
  const handlePaymentMethodChange = (value: PaymentMethod) => {
    if (value === "split") {
      setShowSplitPayment(true);
    } else {
      setShowSplitPayment(false);
    }
    setPaymentMethod(value);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-1.5">
        <Button
          variant={paymentMethod === "cash" ? "default" : "outline"}
          onClick={() => handlePaymentMethodChange("cash")}
          className="h-8 text-xs"
        >
          <DollarSign className="mr-1 h-3 w-3" />
          Cash
        </Button>
        <Button
          variant={paymentMethod === "card" ? "default" : "outline"}
          onClick={() => handlePaymentMethodChange("card")}
          className="h-8 text-xs"
        >
          <CreditCard className="mr-1 h-3 w-3" />
          Card
        </Button>
        <Button
          variant={paymentMethod === "mobile" ? "default" : "outline"}
          onClick={() => handlePaymentMethodChange("mobile")}
          className="h-8 text-xs"
        >
          <Smartphone className="mr-1 h-3 w-3" />
          Mobile
        </Button>
        <Button
          variant={paymentMethod === "gift" ? "default" : "outline"}
          onClick={() => handlePaymentMethodChange("gift")}
          className="h-8 text-xs"
        >
          <Gift className="mr-1 h-3 w-3" />
          Gift
        </Button>
        <Button
          variant={paymentMethod === "split" ? "default" : "outline"}
          onClick={() => handlePaymentMethodChange("split")}
          className="h-8 text-xs"
        >
          <Zap className="mr-1 h-3 w-3" />
          Split
        </Button>
      </div>

      {showSplitPayment && (
        <div className="space-y-2">
          {splitPayments.map((payment, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <Select
                value={payment.method}
                onValueChange={(value: PaymentMethod) =>
                  handleSplitPaymentChange(index, "method", value)
                }
              >
                <SelectTrigger className="w-[120px] h-8 text-xs">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="mobile">Mobile</SelectItem>
                  <SelectItem value="gift">Gift Card</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                value={payment.amount}
                onChange={(e) =>
                  handleSplitPaymentChange(index, "amount", e.target.value)
                }
                placeholder="Amount"
                className="flex-1 h-8 text-xs"
              />
              {splitPayments.length > 2 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSplitPaymentMethod(index)}
                  className="h-8 w-8"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="outline"
            onClick={addSplitPaymentMethod}
            className="w-full h-8 text-xs"
          >
            <Plus className="mr-1 h-3 w-3" />
            Add Payment Method
          </Button>
        </div>
      )}

      {paymentMethod === "cash" && !showSplitPayment && (
        <div className="space-y-1.5">
          <Label className="text-xs">Cash Amount</Label>
          <Input
            type="number"
            value={cashAmount}
            onChange={(e) => setCashAmount(e.target.value)}
            placeholder="Enter cash amount"
            className="h-8 text-xs"
          />
          {changeDue > 0 && (
            <div className="text-xs text-muted-foreground">
              Change Due: {formatCurrency(changeDue)}
            </div>
          )}
        </div>
      )}

      <Button
        onClick={handleCompletePayment}
        className="w-full h-8 text-xs"
        disabled={cart.length === 0}
      >
        Complete Payment
      </Button>
    </div>
  );
}
