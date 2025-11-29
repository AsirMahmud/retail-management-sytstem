"use client"

import Image from "next/image"
import { Trash2, Minus, Plus, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { useCartStore } from "@/hooks/useCartStore"
import { ecommerceApi } from "@/lib/api"
import { getImageUrl } from "@/lib/utils"
import { useLoading } from "@/hooks/useLoading"

interface PricedCartItem {
  productId: number
  name: string
  image_url?: string | null
  unit_price: number
  quantity: number
  line_total: number
  max_stock?: number
  variant?: { color?: string | null; size?: string | null }
}

export function CartItems() {
  const items = useCartStore((s) => s.items)
  const updateQty = useCartStore((s) => s.updateQuantity)
  const removeLine = useCartStore((s) => s.removeItem)
  const [pricedItems, setPricedItems] = useState<PricedCartItem[]>([])
  const { startLoading, stopLoading } = useLoading()

  useEffect(() => {
    const fetchPricedItems = async () => {
      if (items.length === 0) {
        setPricedItems([])
        return
      }

      try {
        startLoading()
        const response = await ecommerceApi.priceCart(items)
        setPricedItems(response.items)
      } catch (error) {
        console.error("Failed to fetch cart prices:", error)
      } finally {
        stopLoading()
      }
    }

    fetchPricedItems()
  }, [items, startLoading, stopLoading])

  if (items.length === 0) {
    return <div className="text-center text-muted-foreground py-8">Your cart is empty.</div>
  }

  return (
    <div className="space-y-4">
      {items.map((it) => {
        // Normalize variation values for comparison
        const normalizeValue = (val: string | null | undefined) => {
          if (!val) return null
          return String(val).trim() || null
        }

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
          <div key={`${it.productId}-${JSON.stringify(it.variations||{})}`} className="flex gap-4 p-4 border rounded-lg bg-card">
            <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
              <Image
                src={productImage}
                alt={productName}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-base md:text-lg mb-1">{productName}</h3>
                  <p className="text-xs text-muted-foreground mb-1">ID: {it.productId}</p>
                  {(color || size) && (
                    <div className="flex gap-2 text-sm text-muted-foreground mt-1">
                      {color && <span>Color: <span className="font-medium">{color}</span></span>}
                      {size && <span>Size: <span className="font-medium">{size}</span></span>}
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                  onClick={() => removeLine(String(it.productId), it.variations)}
                >
                  <Trash2 className="h-5 w-5" />
                  <span className="sr-only">Remove item</span>
                </Button>
              </div>
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-muted-foreground">Price shown at checkout</p>
                <div className="flex items-center gap-3 bg-muted rounded-full px-4 py-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full hover:bg-background"
                    onClick={() => updateQty(String(it.productId), it.quantity - 1, it.variations)}
                  >
                    <Minus className="h-3 w-3" />
                    <span className="sr-only">Decrease quantity</span>
                  </Button>
                  <span className="text-sm font-medium w-8 text-center">{it.quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full hover:bg-background"
                    disabled={pricedItem?.max_stock ? it.quantity >= pricedItem.max_stock : false}
                    onClick={() => {
                      const max = pricedItem?.max_stock
                      if (max && it.quantity >= max) return
                      updateQty(String(it.productId), it.quantity + 1, it.variations)
                    }}
                  >
                    <Plus className="h-3 w-3" />
                    <span className="sr-only">Increase quantity</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )
      })}

      {/* Coupon Code Section (placeholder) */}
      {/* <div className="pt-6">
        <h3 className="text-lg font-semibold mb-2">Have a coupon?</h3>
        <p className="text-sm text-muted-foreground mb-4">Add your code for an instant cart discount</p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input type="text" placeholder="Coupon Code" className="pl-10" />
          </div>
          <Button variant="default" className="px-8">
            Apply
          </Button>
        </div>
      </div> */}
    </div>
  )
}
