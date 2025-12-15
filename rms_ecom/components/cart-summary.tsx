"use client"

import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useMemo, useEffect, useState } from "react"
import Link from "next/link"
import { useCartStore } from "@/hooks/useCartStore"
import { ecommerceApi } from "@/lib/api"
import { useLoading } from "@/hooks/useLoading"
import { sendGTMEvent } from "@/lib/gtm"

interface CartPricing {
  subtotal: number
  delivery: {
    inside_dhaka_charge: number
    inside_gazipur_charge: number
    outside_dhaka_charge: number
    updated_at: string
  }
  items: Array<{
    productId: number;
    name: string;
    unit_price: number;
    quantity: number;
    variant?: { color?: string | null; size?: string | null };
  }>
}

export function CartSummary() {
  const items = useCartStore((s) => s.items)
  const [shippingMethod, setShippingMethod] = useState<'inside' | 'gazipur' | 'outside'>('inside')
  const [cartPricing, setCartPricing] = useState<CartPricing | null>(null)
  const [localLoading, setLocalLoading] = useState(false)
  const { startLoading, stopLoading } = useLoading()

  const itemCount = useMemo(() => items.reduce((n, it) => n + it.quantity, 0), [items])

  useEffect(() => {
    const fetchCartPricing = async () => {
      if (items.length === 0) {
        setCartPricing(null)
        return
      }

      try {
        startLoading()
        setLocalLoading(true)

        // Normalize items: extract numeric productId and ensure variations are properly set
        const normalizedItems = items.map((item) => {
          let productId: string | number = item.productId
          let variations = item.variations ? { ...item.variations } : {}

          // If productId contains a slash (e.g., "141/blue"), extract the numeric ID and color
          if (typeof item.productId === 'string' && item.productId.includes('/')) {
            const parts = item.productId.split('/')
            productId = parts[0] // Get the numeric part
            // If color is not already in variations, extract it from productId
            if (!variations.color && parts.length > 1) {
              variations.color = parts.slice(1).join('/') // Handle multi-part colors
            }
          }

          return {
            productId: productId,
            quantity: item.quantity,
            variations: Object.keys(variations).length > 0 ? variations : undefined
          }
        })

        const response = await ecommerceApi.priceCart(normalizedItems)
        // Convert all values to numbers to ensure proper type handling
        setCartPricing({
          subtotal: Number(response.subtotal) || 0,
          delivery: {
            inside_dhaka_charge: Number(response.delivery.inside_dhaka_charge) || 0,
            inside_gazipur_charge: Number(response.delivery.inside_gazipur_charge) || 0,
            outside_dhaka_charge: Number(response.delivery.outside_dhaka_charge) || 0,
            updated_at: response.delivery.updated_at || ""
          },
          items: response.items
        })
      } catch (error) {
        console.error("Failed to fetch cart pricing:", error)
      } finally {
        stopLoading()
        setLocalLoading(false)
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
  let deliveryCharge = 0
  if (shippingMethod === 'inside') {
    deliveryCharge = Number(cartPricing?.delivery?.inside_dhaka_charge) || 0
  } else if (shippingMethod === 'gazipur') {
    deliveryCharge = Number(cartPricing?.delivery?.inside_gazipur_charge) || 0
  } else {
    deliveryCharge = Number(cartPricing?.delivery?.outside_dhaka_charge) || 0
  }
  const total = subtotal + deliveryCharge

  const handleCheckout = () => {
    if (!items.length || !cartPricing) return

    // FB InitiateCheckout
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq('track', 'InitiateCheckout', {
        content_ids: cartPricing.items.map(i => String(i.productId)),
        content_type: 'product',
        currency: 'BDT',
        value: total,
        contents: cartPricing.items.map(i => ({
          id: String(i.productId),
          quantity: i.quantity,
          item_price: i.unit_price,
          color: i.variant?.color,
          size: i.variant?.size,
        })),
        num_items: itemCount
      })
    }

    // GA4 begin_checkout
    sendGTMEvent('begin_checkout', {
      currency: 'BDT',
      value: total,
      items: cartPricing.items.map(i => ({
        item_id: String(i.productId),
        item_name: i.name,
        price: i.unit_price,
        quantity: i.quantity,
        item_variant: `${i.variant?.color || ''} ${i.variant?.size || ''}`.trim()
      }))
    })
  }

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
        <RadioGroup value={shippingMethod} onValueChange={(value) => setShippingMethod(value as 'inside' | 'gazipur' | 'outside')} className="space-y-3">
          <div className="flex items-center justify-between border rounded-lg p-4 cursor-pointer hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-3">
              <RadioGroupItem value="inside" id="inside" />
              <Label htmlFor="inside" className="cursor-pointer font-medium">
                Inside Dhaka
              </Label>
            </div>
            {localLoading ? (
              <span className="font-semibold text-muted-foreground">—</span>
            ) : (
              <span className="font-semibold">৳{formatPrice(cartPricing?.delivery?.inside_dhaka_charge)}</span>
            )}
          </div>

          <div className="flex items-center justify-between border rounded-lg p-4 cursor-pointer hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-3">
              <RadioGroupItem value="gazipur" id="gazipur" />
              <Label htmlFor="gazipur" className="cursor-pointer font-medium">
                Inside Gazipur
              </Label>
            </div>
            {localLoading ? (
              <span className="font-semibold text-muted-foreground">—</span>
            ) : (
              <span className="font-semibold">৳{formatPrice(cartPricing?.delivery?.inside_gazipur_charge)}</span>
            )}
          </div>

          <div className="flex items-center justify-between border rounded-lg p-4 cursor-pointer hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-3">
              <RadioGroupItem value="outside" id="outside" />
              <Label htmlFor="outside" className="cursor-pointer font-medium">
                Outside Dhaka
              </Label>
            </div>
            {localLoading ? (
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
          {localLoading ? (
            <span className="font-semibold text-muted-foreground">—</span>
          ) : (
            <span className="font-semibold">৳{formatPrice(subtotal)}</span>
          )}
        </div>

        <div className="flex justify-between text-base">
          <span className="text-muted-foreground">Delivery</span>
          {localLoading ? (
            <span className="font-semibold text-muted-foreground">—</span>
          ) : (
            <span className="font-semibold">৳{formatPrice(deliveryCharge)}</span>
          )}
        </div>

        <div className="flex justify-between text-lg font-bold pt-2 border-t">
          <span>Total</span>
          {localLoading ? (
            <span className="text-muted-foreground">—</span>
          ) : (
            <span>৳{formatPrice(total)}</span>
          )}
        </div>
      </div>

      {/* Checkout Button */}
      <Link href="/checkout">
        <Button size="lg" className="w-full mt-6 h-12 text-base" disabled={localLoading || items.length === 0} onClick={handleCheckout}>
          Checkout
        </Button>
      </Link>
    </div>
  )
}
