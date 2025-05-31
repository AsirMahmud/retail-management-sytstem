import React from "react";
import { ShoppingCart, Percent, Trash2, X, Plus, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePOSStore } from "@/store/pos-store";

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export default function CartAndCheckout() {
  const {
    cart,
    cartDiscount,
    selectedCustomer,
    handleUpdateQuantity,
    handleRemoveItem,
    handleClearCart,
    handleItemDiscount,
    handleRemoveItemDiscount,
    setShowNewCustomerForm,
    setShowCustomerSearch,
    setShowDiscountModal,
    handleCompletePayment,
  } = usePOSStore();

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => {
    const itemTotal = item.price * item.quantity;
    if (item.discount) {
      return item.discount.type === "percentage"
        ? sum + itemTotal * (1 - item.discount.value / 100)
        : sum + itemTotal - item.discount.value;
    }
    return sum + itemTotal;
  }, 0);

  const taxRate = 0.1; // 10% tax rate
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const closeDialog = (dialogElement: HTMLElement) => {
    const closeButton = dialogElement.querySelector(
      'button[data-state="closed"]'
    ) as HTMLButtonElement;
    if (closeButton) {
      closeButton.click();
    }
  };

  return (
    <div className="w-96 bg-white border-l flex flex-col">
      {/* Cart Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold flex items-center">
          <ShoppingCart className="h-5 w-5 mr-2" />
          Cart
          {cart.length > 0 && <Badge className="ml-2">{cart.length}</Badge>}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDiscountModal(true)}
            disabled={cart.length === 0}
          >
            <Percent className="h-4 w-4 mr-1" />
            Discount
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600"
            onClick={handleClearCart}
            disabled={cart.length === 0}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </div>
      </div>

      {/* Cart Items */}
      <ScrollArea className="flex-1">
        {cart.length > 0 ? (
          <div className="p-4 space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="border rounded-md p-2">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-gray-100 rounded mr-3 flex-shrink-0">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.name}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span>Size: {item.size}</span>
                      <div
                        className="h-3 w-3 rounded-full mx-2"
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{formatCurrency(item.price)}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleUpdateQuantity(item.id, -1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-6 text-center">{item.quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleUpdateQuantity(item.id, 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-600"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Item discount section */}
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex-1">
                    {item.discount ? (
                      <div className="flex items-center">
                        <Badge
                          variant="outline"
                          className="bg-red-50 text-red-600 mr-2"
                        >
                          {item.discount.type === "percentage"
                            ? `${item.discount.value}% OFF`
                            : `$${item.discount.value} OFF`}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs text-red-600 p-0"
                          onClick={() => handleRemoveItemDiscount(item.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs p-0"
                          >
                            <Percent className="h-3 w-3 mr-1" />
                            Add Discount
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Apply Item Discount</DialogTitle>
                            <DialogDescription>
                              Apply a discount to this specific item.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <Tabs defaultValue="percentage">
                              <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="percentage">
                                  Percentage (%)
                                </TabsTrigger>
                                <TabsTrigger value="fixed">
                                  Fixed Amount ($)
                                </TabsTrigger>
                              </TabsList>
                              <TabsContent
                                value="percentage"
                                className="space-y-4 mt-4"
                              >
                                <div className="space-y-2">
                                  <Label htmlFor="percentage">
                                    Discount Percentage
                                  </Label>
                                  <div className="flex items-center">
                                    <Input
                                      id="percentage"
                                      type="number"
                                      min="0"
                                      max="100"
                                      defaultValue="10"
                                    />
                                    <span className="ml-2">%</span>
                                  </div>
                                </div>
                                <Button
                                  className="w-full"
                                  onClick={(e) => {
                                    const input = document.getElementById(
                                      "percentage"
                                    ) as HTMLInputElement;
                                    handleItemDiscount(
                                      item.id,
                                      "percentage",
                                      Number(input.value)
                                    );
                                    const dialogElement = (
                                      e.target as HTMLElement
                                    ).closest("dialog");
                                    if (dialogElement) {
                                      closeDialog(dialogElement);
                                    }
                                  }}
                                >
                                  Apply Percentage Discount
                                </Button>
                              </TabsContent>
                              <TabsContent
                                value="fixed"
                                className="space-y-4 mt-4"
                              >
                                <div className="space-y-2">
                                  <Label htmlFor="fixed">Discount Amount</Label>
                                  <div className="flex items-center">
                                    <span className="mr-2">$</span>
                                    <Input
                                      id="fixed"
                                      type="number"
                                      min="0"
                                      max={item.price * item.quantity}
                                      defaultValue="5"
                                    />
                                  </div>
                                </div>
                                <Button
                                  className="w-full"
                                  onClick={(e) => {
                                    const input = document.getElementById(
                                      "fixed"
                                    ) as HTMLInputElement;
                                    handleItemDiscount(
                                      item.id,
                                      "fixed",
                                      Number(input.value)
                                    );
                                    const dialogElement = (
                                      e.target as HTMLElement
                                    ).closest("dialog");
                                    if (dialogElement) {
                                      closeDialog(dialogElement);
                                    }
                                  }}
                                >
                                  Apply Fixed Discount
                                </Button>
                              </TabsContent>
                            </Tabs>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                  <div className="text-sm font-medium">
                    {formatCurrency(
                      item.discount
                        ? item.discount.type === "percentage"
                          ? item.price *
                            item.quantity *
                            (1 - item.discount.value / 100)
                          : item.price * item.quantity - item.discount.value
                        : item.price * item.quantity
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-4 text-center">
            <ShoppingCart className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium">Your cart is empty</h3>
            <p className="text-muted-foreground">
              Add items to start a new order
            </p>
          </div>
        )}
      </ScrollArea>

      {/* Cart Footer - Subtotal, Tax, Total, and Checkout */}
      <div className="p-4 border-t">
        {/* Customer Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="customer">Customer</Label>
            <Button
              variant="link"
              size="sm"
              onClick={() => setShowCustomerSearch(true)}
            >
              {selectedCustomer ? "Change" : "Select Customer"}
            </Button>
          </div>
          {selectedCustomer ? (
            <div className="flex items-center">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {selectedCustomer.first_name} {selectedCustomer.last_name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {selectedCustomer.email || selectedCustomer.phone}
                </p>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNewCustomerForm(true)}
            >
              Add New Customer
            </Button>
          )}
        </div>

        {/* Totals Display */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <Label>Subtotal:</Label>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {cartDiscount && (
            <div className="flex justify-between">
              <Label>Discount:</Label>
              <span>
                {cartDiscount.type === "percentage"
                  ? `${cartDiscount.value}%`
                  : formatCurrency(cartDiscount.value)}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <Label>Tax ({taxRate * 100}%):</Label>
            <span>{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold">
            <Label>Total:</Label>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        {/* Complete Checkout Button */}
        <Button
          className="w-full"
          size="lg"
          onClick={handleCompletePayment}
          disabled={cart.length === 0}
        >
          Complete Checkout
        </Button>
      </div>
    </div>
  );
}
