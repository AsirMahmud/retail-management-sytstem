"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { useCartStore } from "@/hooks/useCartStore"
import { useCheckoutStore } from "@/hooks/useCheckoutStore"
import { ecommerceApi } from "@/lib/api"

interface CartPricing {
  subtotal: number
  delivery: {
    inside_dhaka_charge: number
    outside_dhaka_charge: number
    updated_at: string
  }
}

interface PricedCartItem {
  productId: number
  name: string
  image_url?: string | null
  unit_price: number
  quantity: number
  line_total: number
  variant?: { color?: string | null; size?: string | null }
}

export function CheckoutSummary() {
  const items = useCartStore((s) => s.items)
  const { deliveryMethod, setDeliveryMethod } = useCheckoutStore()
  const [cartPricing, setCartPricing] = useState<CartPricing | null>(null)
  const [pricedItems, setPricedItems] = useState<PricedCartItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchCartPricing = async () => {
      if (items.length === 0) {
        setCartPricing(null)
        setPricedItems([])
        return
      }

      try {
        setLoading(true)
        const response = await ecommerceApi.priceCart(items)
        setCartPricing({
          subtotal: response.subtotal,
          delivery: response.delivery
        })
        setPricedItems(response.items)
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

  const normalizeValue = (val: string | null | undefined) => {
    if (!val) return null
    return String(val).trim() || null
  }

  const subtotal = Number(cartPricing?.subtotal) || 0
  const deliveryCharge = deliveryMethod === 'inside' 
    ? (Number(cartPricing?.delivery?.inside_dhaka_charge) || 0)
    : (Number(cartPricing?.delivery?.outside_dhaka_charge) || 0)
  const total = subtotal + deliveryCharge

  if (items.length === 0) {
    return (
      <div className="border rounded-lg p-6 bg-card sticky top-24">
        <h2 className="text-xl font-bold mb-6">Order Summary</h2>
        <p className="text-center text-muted-foreground py-8">Your cart is empty.</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg p-6 bg-card sticky top-24">
      <h2 className="text-xl font-bold mb-6">Order Summary</h2>

      {/* Cart Items */}
      <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
        {items.map((it) => {
          const itemColor = normalizeValue(it.variations?.color)
          const itemSize = normalizeValue(it.variations?.size)

          const pricedItem = pricedItems.find((pi) => {
            if (pi.productId !== Number(it.productId)) return false
            
            const piColor = normalizeValue(pi.variant?.color)
            const piSize = normalizeValue(pi.variant?.size)
            
            return piColor === itemColor && piSize === itemSize
          })

          const productName = (pricedItem?.name && pricedItem.name.trim()) || `Product ${it.productId}`
          const productImage = pricedItem?.image_url || "/placeholder.svg"
          const color = pricedItem?.variant?.color || it.variations?.color
          const size = pricedItem?.variant?.size || it.variations?.size

          return (
            <div key={`${it.productId}-${JSON.stringify(it.variations||{})}`} className="flex gap-3">
              <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                <Image src={productImage} alt={productName} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm line-clamp-1">{productName}</h3>
                {(color || size) && (
                  <p className="text-xs text-muted-foreground">
                    {size && `${size}`}{size && color ? " / " : ""}{color && `${color}`}
                  </p>
                )}
                <p className="text-sm font-semibold mt-1">৳{formatPrice(pricedItem?.unit_price || 0)}</p>
              </div>
              <div className="text-sm text-muted-foreground">x{it.quantity}</div>
            </div>
          )
        })}
      </div>

      {/* Delivery Method Selection */}
      <div className="mb-6 pb-6 border-b">
        <label className="text-sm font-semibold mb-2 block">Delivery Method</label>
        <div className="space-y-2">
          <label className="flex items-center justify-between border rounded-lg p-3 cursor-pointer hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="delivery-method"
                value="inside"
                checked={deliveryMethod === 'inside'}
                onChange={(e) => setDeliveryMethod(e.target.value as 'inside' | 'outside')}
                className="h-4 w-4"
              />
              <span className="text-sm font-medium">Inside Dhaka</span>
            </div>
            {loading ? (
              <span className="text-sm font-semibold text-muted-foreground">—</span>
            ) : (
              <span className="text-sm font-semibold">৳{formatPrice(cartPricing?.delivery?.inside_dhaka_charge)}</span>
            )}
          </label>
          <label className="flex items-center justify-between border rounded-lg p-3 cursor-pointer hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="delivery-method"
                value="outside"
                checked={deliveryMethod === 'outside'}
                onChange={(e) => setDeliveryMethod(e.target.value as 'outside' | 'inside')}
                className="h-4 w-4"
              />
              <span className="text-sm font-medium">Outside Dhaka</span>
            </div>
            {loading ? (
              <span className="text-sm font-semibold text-muted-foreground">—</span>
            ) : (
              <span className="text-sm font-semibold">৳{formatPrice(cartPricing?.delivery?.outside_dhaka_charge)}</span>
            )}
          </label>
        </div>
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
    </div>
  )
}
