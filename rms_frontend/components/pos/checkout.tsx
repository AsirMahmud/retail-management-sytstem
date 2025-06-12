"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CustomDiscount } from "@/components/pos/custom-discount";
import {
  Trash2,
  Plus,
  Minus,
  CreditCard,
  DollarSign,
  Smartphone,
  User,
} from "lucide-react";

interface CheckoutProps {
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    discount?: number;
  }>;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
  onCustomerSelect: () => void;
}

export function Checkout({
  items,
  onQuantityChange,
  onRemoveItem,
  onCheckout,
  onCustomerSelect,
}: CheckoutProps) {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [customerCredit, setCustomerCredit] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [cartDiscount, setCartDiscount] = useState(0);

  // Calculate totals
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const itemDiscounts = items.reduce(
    (sum, item) => sum + (item.discount || 0),
    0
  );
  const totalDiscount = itemDiscounts + cartDiscount;
  const total = subtotal - totalDiscount;
  const grandTotal = total;

  const handleApplyDiscount = (discountData: {
    type: "percentage" | "fixed";
    value: number;
    scope: "cart" | "item";
    itemId?: string;
    reason?: string;
  }) => {
    if (discountData.scope === "cart") {
      // Apply cart-wide discount
      if (discountData.type === "percentage") {
        setCartDiscount(subtotal * (discountData.value / 100));
      } else {
        setCartDiscount(discountData.value);
      }
    } else {
      // Item-specific discount would be handled by the parent component
      console.log("Item discount:", discountData);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Checkout</CardTitle>
          <Button variant="outline" size="sm" onClick={onCustomerSelect}>
            <User className="mr-2 h-4 w-4" />
            {selectedCustomer ? "Change Customer" : "Add Customer"}
          </Button>
        </div>
        {selectedCustomer && (
          <div className="flex items-center justify-between mt-2 text-sm">
            <span>Customer: John Doe</span>
            {customerCredit > 0 && (
              <Badge variant="outline" className="ml-2">
                Credit: ${customerCredit.toFixed(2)}
              </Badge>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.name}
                      {item.discount && item.discount > 0 && (
                        <Badge variant="outline" className="ml-2">
                          -{item.discount.toFixed(2)}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      ${item.price.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() =>
                            onQuantityChange(
                              item.id,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            onQuantityChange(
                              item.id,
                              Number.parseInt(e.target.value) || 1
                            )
                          }
                          className="h-8 w-12 mx-1 text-center"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() =>
                            onQuantityChange(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      ${(item.price * item.quantity).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-red-500"
                        onClick={() => onRemoveItem(item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No items in cart. Add products to begin checkout.
            </div>
          )}

          <div className="space-y-2 pt-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {totalDiscount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-${totalDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Payment Method</span>
              <CustomDiscount
                onApplyDiscount={handleApplyDiscount}
                items={items.map((item) => ({
                  id: item.id,
                  name: item.name,
                  price: item.price,
                }))}
              />
            </div>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">
                  <div className="flex items-center">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Cash
                  </div>
                </SelectItem>
                <SelectItem value="card">
                  <div className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Card
                  </div>
                </SelectItem>
                <SelectItem value="mobile">
                  <div className="flex items-center">
                    <Smartphone className="mr-2 h-4 w-4" />
                    Mobile Payment
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          size="lg"
          onClick={onCheckout}
          disabled={items.length === 0}
        >
          Complete Checkout
        </Button>
      </CardFooter>
    </Card>
  );
}
