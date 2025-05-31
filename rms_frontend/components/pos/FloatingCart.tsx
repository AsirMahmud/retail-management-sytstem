import React from "react";
import { ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePOSStore } from "@/store/pos-store";
import { motion, AnimatePresence } from "framer-motion";

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export default function FloatingCart() {
  const { cart, handleCompletePayment } = usePOSStore();

  // Calculate total
  const total = cart.reduce((sum, item) => {
    const itemTotal = item.price * item.quantity;
    if (item.discount) {
      return item.discount.type === "percentage"
        ? sum + itemTotal * (1 - item.discount.value / 100)
        : sum + itemTotal - item.discount.value;
    }
    return sum + itemTotal;
  }, 0);

  return (
    <AnimatePresence>
      {cart.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
          className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50"
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <ShoppingCart className="h-6 w-6 text-primary" />
                  <Badge className="ml-2">{cart.length} items</Badge>
                </div>
                <div className="text-lg font-semibold">
                  Total: {formatCurrency(total)}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // TODO: Implement view cart functionality
                  }}
                >
                  View Cart
                </Button>
                <Button size="sm" onClick={handleCompletePayment}>
                  Checkout
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
