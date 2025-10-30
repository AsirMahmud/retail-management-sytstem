"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tag, ArrowRight } from "lucide-react"
import { useGlobalDiscount } from "@/lib/useGlobalDiscount"
import { useState } from "react"

export function OrderSummary() {
  const [promoCode, setPromoCode] = useState("")
  const globalDiscountValue = useGlobalDiscount((state) => state.discount?.value || 0)
  const subtotal = 565
  const discountPercent = globalDiscountValue
  const discount = (subtotal * discountPercent) / 100
  const deliveryFee = 15
  const total = subtotal - discount + deliveryFee

  return (
    <div className="border rounded-lg p-6 bg-card sticky top-24">
      <h2 className="text-xl font-bold mb-6">Order Summary</h2>

      <div className="space-y-4">
        {/* Subtotal */}
        <div className="flex justify-between text-base">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-semibold">${subtotal}</span>
        </div>

        {/* Discount */}
        <div className="flex justify-between text-base">
          <span className="text-muted-foreground">Discount (-{discountPercent}%)</span>
          <span className="font-semibold text-destructive">-${discount.toFixed(2)}</span>
        </div>

        {/* Delivery Fee */}
        <div className="flex justify-between text-base">
          <span className="text-muted-foreground">Delivery Fee</span>
          <span className="font-semibold">${deliveryFee}</span>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between text-lg">
            <span className="font-semibold">Total</span>
            <span className="font-bold text-xl">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Promo Code */}
        <div className="flex gap-2 pt-2">
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Add promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="default" className="px-6">
            Apply
          </Button>
        </div>

        {/* Checkout Button */}
        <Button size="lg" className="w-full mt-4 h-12 text-base">
          Go to Checkout
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
