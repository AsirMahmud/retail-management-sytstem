"use client"

import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useMemo, useEffect, useState } from "react"
import Link from "next/link"
import { useCartStore } from "@/hooks/useCartStore"
import { ecommerceApi } from "@/lib/api"

interface CartPricing {
  subtotal: number
  delivery: {
    inside_dhaka_charge: number
    outside_dhaka_charge: number
    updated_at: string
  }
}

export function CartSummary() {
  const items = useCartStore((s) => s.items)
  const [shippingMethod, setShippingMethod] = useState<'inside' | 'outside'>('inside')
  const [cartPricing, setCartPricing] = useState<CartPricing | null>(null)
  const [loading, setLoading] = useState(false)

  const itemCount = useMemo(() => items.reduce((n, it) => n + it.quantity, 0), [items])

  useEffect(() => {
    const fetchCartPricing = async () => {
      if (items.length === 0) {
        setCartPricing(null)
        return
      }

      try {
        setLoading(true)
        const response = await ecommerceApi.priceCart(items)
        // Convert all values to numbers to ensure proper type handling
        setCartPricing({
          subtotal: Number(response.subtotal) || 0,
          delivery: {
            inside_dhaka_charge: Number(response.delivery.inside_dhaka_charge) || 0,
            outside_dhaka_charge: Number(response.delivery.outside_dhaka_charge) || 0,
            updated_at: response.delivery.updated_at || ""
          }
        })
      } catch (error) {
        console.error("Failed to fetch cart pricing:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCartPricing()
  }, [items])

  // Helper function to safely format numbers
  const formatPrice = (value: number | string | null | undefined): string => {
    const num = Number(value)
    if (isNaN(num)) return "0.00"
    return num.toFixed(2)
  }

  const subtotal = Number(cartPricing?.subtotal) || 0
  const deliveryCharge = shippingMethod === 'inside' 
    ? (Number(cartPricing?.delivery?.inside_dhaka_charge) || 0)
    : (Number(cartPricing?.delivery?.outside_dhaka_charge) || 0)
  const total = subtotal + deliveryCharge

  if (items.length === 0) {
    return (
      <div className="border rounded-lg p-6 bg-card">
        <h2 className="text-xl font-bold mb-6">Cart summary</h2>
        <p className="text-center text-muted-foreground py-8">Your cart is empty.</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg p-6 bg-card">
      <h2 className="text-xl font-bold mb-6">Cart summary</h2>

      {/* Delivery Options */}
      <div className="mb-6">
        <Label className="text-base font-semibold mb-3 block">Delivery Method</Label>
        <RadioGroup value={shippingMethod} onValueChange={(value) => setShippingMethod(value as 'inside' | 'outside')} className="space-y-3">
          <div className="flex items-center justify-between border rounded-lg p-4 cursor-pointer hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-3">
              <RadioGroupItem value="inside" id="inside" />
              <Label htmlFor="inside" className="cursor-pointer font-medium">
                Inside Dhaka
              </Label>
            </div>
            {loading ? (
              <span className="font-semibold text-muted-foreground">—</span>
            ) : (
              <span className="font-semibold">৳{formatPrice(cartPricing?.delivery?.inside_dhaka_charge)}</span>
            )}
          </div>

          <div className="flex items-center justify-between border rounded-lg p-4 cursor-pointer hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-3">
              <RadioGroupItem value="outside" id="outside" />
              <Label htmlFor="outside" className="cursor-pointer font-medium">
                Outside Dhaka
              </Label>
            </div>
            {loading ? (
              <span className="font-semibold text-muted-foreground">—</span>
            ) : (
              <span className="font-semibold">৳{formatPrice(cartPricing?.delivery?.outside_dhaka_charge)}</span>
            )}
          </div>
        </RadioGroup>
      </div>

      {/* Price Summary */}
      <div className="space-y-3 pt-4 border-t">
        <div className="flex justify-between text-base">
          <span className="text-muted-foreground">Subtotal</span>
          {loading ? (
            <span className="font-semibold text-muted-foreground">—</span>
          ) : (
            <span className="font-semibold">৳{formatPrice(subtotal)}</span>
          )}
        </div>

        <div className="flex justify-between text-base">
          <span className="text-muted-foreground">Delivery</span>
          {loading ? (
            <span className="font-semibold text-muted-foreground">—</span>
          ) : (
            <span className="font-semibold">৳{formatPrice(deliveryCharge)}</span>
          )}
        </div>

        <div className="flex justify-between text-lg font-bold pt-2 border-t">
          <span>Total</span>
          {loading ? (
            <span className="text-muted-foreground">—</span>
          ) : (
            <span>৳{formatPrice(total)}</span>
          )}
        </div>
      </div>

      {/* Checkout Button */}
      <Link href="/checkout">
        <Button size="lg" className="w-full mt-6 h-12 text-base" disabled={loading || items.length === 0}>
          Checkout
        </Button>
      </Link>
    </div>
  )
}
