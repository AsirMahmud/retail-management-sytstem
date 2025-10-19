"use client"

import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import Link from "next/link"

export function CartSummary() {
  const [promoCode, setPromoCode] = useState("")
  const [shippingMethod, setShippingMethod] = useState("free")

  const subtotal = 1234.0
  const shippingCosts = {
    free: 0,
    express: 15.0,
    pickup: 21.0,
  }

  const shippingFee = shippingCosts[shippingMethod as keyof typeof shippingCosts]
  const total = subtotal + shippingFee

  return (
    <div className="border rounded-lg p-6 bg-card">
      <h2 className="text-xl font-bold mb-6">Cart summary</h2>

      {/* Shipping Options */}
      <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="space-y-3 mb-6">
        <div className="flex items-center justify-between border rounded-lg p-4 cursor-pointer hover:bg-accent/50 transition-colors">
          <div className="flex items-center gap-3">
            <RadioGroupItem value="free" id="free" />
            <Label htmlFor="free" className="cursor-pointer font-medium">
              Free shipping
            </Label>
          </div>
          <span className="font-semibold">${shippingCosts.free.toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between border rounded-lg p-4 cursor-pointer hover:bg-accent/50 transition-colors">
          <div className="flex items-center gap-3">
            <RadioGroupItem value="express" id="express" />
            <Label htmlFor="express" className="cursor-pointer font-medium">
              Express shipping
            </Label>
          </div>
          <span className="font-semibold">+${shippingCosts.express.toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between border rounded-lg p-4 cursor-pointer hover:bg-accent/50 transition-colors">
          <div className="flex items-center gap-3">
            <RadioGroupItem value="pickup" id="pickup" />
            <Label htmlFor="pickup" className="cursor-pointer font-medium">
              Pick Up
            </Label>
          </div>
          <span className="font-semibold">%{shippingCosts.pickup.toFixed(2)}</span>
        </div>
      </RadioGroup>

      {/* Price Summary */}
      <div className="space-y-3 pt-4 border-t">
        <div className="flex justify-between text-base">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-semibold">${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-lg font-bold pt-2">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <Link href="/checkout">
        <Button size="lg" className="w-full mt-6 h-12 text-base">
          Checkout
        </Button>
      </Link>
    </div>
  )
}
