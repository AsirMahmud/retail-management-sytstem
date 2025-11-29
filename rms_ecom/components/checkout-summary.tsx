"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { useCartStore } from "@/hooks/useCartStore"
import { useCheckoutStore } from "@/hooks/useCheckoutStore"
import { ecommerceApi } from "@/lib/api"
import { getImageUrl } from "@/lib/utils"
import { getCheckoutItems, type CartItem } from "@/lib/cart"
import { useLoading } from "@/hooks/useLoading"

interface CartPricing {
  subtotal: number
  delivery: {
    inside_dhaka_charge: number
    inside_gazipur_charge: number
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
  const cartStoreItems = useCartStore((s) => s.items)
  const { deliveryMethod, setDeliveryMethod } = useCheckoutStore()
  const [cartPricing, setCartPricing] = useState<CartPricing | null>(null)
  const [pricedItems, setPricedItems] = useState<PricedCartItem[]>([])
  const [localLoading, setLocalLoading] = useState(false)
  const { startLoading, stopLoading } = useLoading()
  const [items, setItems] = useState<CartItem[]>([])

  // Get checkout items (direct checkout or cart)
  useEffect(() => {
    const checkoutItems = getCheckoutItems()
    setItems(checkoutItems)
  }, [cartStoreItems]) // Re-check when cart store changes or component mounts

  useEffect(() => {
    const fetchCartPricing = async () => {
      if (items.length === 0) {
        setCartPricing(null)
        setPricedItems([])
        return
      }

      try {
        startLoading()
        setLocalLoading(true)
        const response = await ecommerceApi.priceCart(items)
        setCartPricing({
          subtotal: response.subtotal,
          delivery: response.delivery
        })
        setPricedItems(response.items)
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

  const normalizeValue = (val: string | null | undefined) => {
    if (!val) return null
    return String(val).trim() || null
  }

  const subtotal = Number(cartPricing?.subtotal) || 0
  let deliveryCharge = 0
  if (deliveryMethod === 'inside') {
    deliveryCharge = Number(cartPricing?.delivery?.inside_dhaka_charge) || 0
  } else if (deliveryMethod === 'gazipur') {
    deliveryCharge = Number(cartPricing?.delivery?.inside_gazipur_charge) || 0
  } else {
    deliveryCharge = Number(cartPricing?.delivery?.outside_dhaka_charge) || 0
  }
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
          const productImage = getImageUrl(pricedItem?.image_url)
          const color = pricedItem?.variant?.color || it.variations?.color
          const size = pricedItem?.variant?.size || it.variations?.size

          return (
            <div key={`${it.productId}-${JSON.stringify(it.variations||{})}`} className="flex gap-3">
              <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                <Image 
                  src={productImage} 
                  alt={productName} 
                  fill 
                  className="object-cover"
                  sizes="64px"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
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
                onChange={(e) => setDeliveryMethod(e.target.value as 'inside' | 'gazipur' | 'outside')}
                className="h-4 w-4"
              />
              <span className="text-sm font-medium">Inside Dhaka</span>
            </div>
            {localLoading ? (
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
                value="gazipur"
                checked={deliveryMethod === 'gazipur'}
                onChange={(e) => setDeliveryMethod(e.target.value as 'inside' | 'gazipur' | 'outside')}
                className="h-4 w-4"
              />
              <span className="text-sm font-medium">Inside Gazipur</span>
            </div>
            {localLoading ? (
              <span className="text-sm font-semibold text-muted-foreground">—</span>
            ) : (
              <span className="text-sm font-semibold">৳{formatPrice(cartPricing?.delivery?.inside_gazipur_charge)}</span>
            )}
          </label>
          <label className="flex items-center justify-between border rounded-lg p-3 cursor-pointer hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="delivery-method"
                value="outside"
                checked={deliveryMethod === 'outside'}
                onChange={(e) => setDeliveryMethod(e.target.value as 'inside' | 'gazipur' | 'outside')}
                className="h-4 w-4"
              />
              <span className="text-sm font-medium">Outside Dhaka</span>
            </div>
            {localLoading ? (
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
    </div>
  )
}
