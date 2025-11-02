"use client"

import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useMemo } from "react"
import Link from "next/link"
import { useCartStore } from "@/hooks/useCartStore"

export function CartSummary() {
  const items = useCartStore((s) => s.items)
  const itemCount = useMemo(() => items.reduce((n, it) => n + it.quantity, 0), [items])
  const shippingMethod: 'inside' | 'outside' = 'inside'
  const shippingFee = 0
  const subtotal = 0
  const total = 0

  return (
    <div className="border rounded-lg p-6 bg-card">
      <h2 className="text-xl font-bold mb-6">Cart summary</h2>

      {/* Delivery Options (prices shown at checkout) */}
      <RadioGroup value={shippingMethod} className="space-y-3 mb-6">
        <div className="flex items-center justify-between border rounded-lg p-4 cursor-pointer hover:bg-accent/50 transition-colors">
          <div className="flex items-center gap-3">
            <RadioGroupItem value="inside" id="inside" />
            <Label htmlFor="inside" className="cursor-pointer font-medium">
              Inside Dhaka
            </Label>
          </div>
          <span className="font-semibold">—</span>
        </div>

        <div className="flex items-center justify-between border rounded-lg p-4 cursor-pointer hover:bg-accent/50 transition-colors">
          <div className="flex items-center gap-3">
            <RadioGroupItem value="outside" id="outside" />
            <Label htmlFor="outside" className="cursor-pointer font-medium">
              Outside Dhaka
            </Label>
          </div>
          <span className="font-semibold">—</span>
        </div>
      </RadioGroup>

      {/* Price Summary */}
      <div className="space-y-3 pt-4 border-t">
        <div className="flex justify-between text-base">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-semibold">—</span>
        </div>

        <div className="flex justify-between text-base">
          <span className="text-muted-foreground">Delivery</span>
          <span className="font-semibold">—</span>
        </div>

        <div className="flex justify-between text-lg font-bold pt-2">
          <span>Total</span>
          <span>—</span>
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
