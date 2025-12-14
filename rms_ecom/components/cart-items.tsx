"use client"

import Image from "next/image"
import { Trash2, Minus, Plus, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { useCartStore } from "@/hooks/useCartStore"
import { ecommerceApi } from "@/lib/api"
import { getImageUrl } from "@/lib/utils"

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

interface ProductInfo {
  id: number
  name: string
  sku: string
  description?: string
  selling_price: string
  original_price?: string | null
  discount?: number | null
  stock_quantity: number
  image?: string
  image_url?: string
  online_category_name?: string
  online_category_id?: number
  available_colors: Array<{ name: string; hex: string }>
  available_sizes: string[]
  variants: Array<any>
  primary_image?: string
  images_ordered: string[]
  created_at: string
  updated_at: string
}

export function CartItems() {
  const items = useCartStore((s) => s.items)
  const updateQty = useCartStore((s) => s.updateQuantity)
  const removeLine = useCartStore((s) => s.removeItem)
  const [pricedItems, setPricedItems] = useState<PricedCartItem[]>([])
  const [products, setProducts] = useState<ProductInfo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPricedItems = async () => {
      if (items.length === 0) {
        setPricedItems([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)

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
        setPricedItems(response.items)
        setProducts(response.products || [])
      } catch (error) {
        console.error("Failed to fetch cart prices:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPricedItems()
  }, [items])

  if (items.length === 0) {
    return (
      <div className="border border-dashed rounded-lg p-8 text-center">
        <p className="text-muted-foreground mb-4">Your cart is empty.</p>
        <Button asChild>
          <a href="/">Continue Shopping</a>
        </Button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    )
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

        // Extract numeric product ID from string (handle cases like "141/blue")
        let numericProductId: number
        if (typeof it.productId === 'string' && it.productId.includes('/')) {
          const parts = it.productId.split('/')
          numericProductId = Number(parts[0]) || 0
        } else {
          numericProductId = Number(it.productId) || 0
        }

        const pricedItem = pricedItems.find((pi) => {
          if (pi.productId !== numericProductId) return false

          const piColor = normalizeValue(pi.variant?.color)
          const piSize = normalizeValue(pi.variant?.size)

          // Match colors (both null/empty is considered a match)
          const colorMatch = (piColor === itemColor) || (!piColor && !itemColor)

          // Match sizes (both null/empty is considered a match)
          const sizeMatch = (piSize === itemSize) || (!piSize && !itemSize)

          return colorMatch && sizeMatch
        })

        // Get full product information from products array
        const productInfo = products.find((p) => p.id === numericProductId)

        // Use product info for full details, fallback to pricedItem, then item data
        const productName = productInfo?.name || (pricedItem?.name && pricedItem.name.trim()) || `Product ${numericProductId}`
        const productSku = productInfo?.sku || ''
        const productCategory = productInfo?.online_category_name || ''

        // Prioritize primary_image from product info, then fallback to other image sources
        const productImage = productInfo?.primary_image ? productInfo.primary_image : "/placeholder.svg"

        const color = pricedItem?.variant?.color || itemColor // Use normalized color
        const size = pricedItem?.variant?.size || itemSize   // Use normalized size
        const originalPrice = productInfo?.original_price ? Number(productInfo.original_price) : null
        const discount = productInfo?.discount || null

        // Calculate unit price with discount applied
        let unitPrice = pricedItem?.unit_price || Number(productInfo?.selling_price) || 0

        // If we have original price and discount, calculate discounted price
        if (originalPrice && discount && discount > 0) {
          const discountedPrice = originalPrice * (1 - discount / 100)
          unitPrice = discountedPrice
        } else if (originalPrice && originalPrice > unitPrice) {
          unitPrice = unitPrice > 0 ? unitPrice : originalPrice
        }

        return (
          <div key={`${it.productId}-${JSON.stringify(it.variations || {})}`} className="flex gap-4 p-4 border rounded-lg bg-card">
            <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
              <Image
                src={productImage}
                alt={productName}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-base md:text-lg mb-1">{productName}</h3>
                  {productSku && (
                    <p className="text-xs text-muted-foreground mb-1">SKU: {productSku}</p>
                  )}
                  {productCategory && (
                    <p className="text-xs text-muted-foreground mb-1">{productCategory}</p>
                  )}
                  {(color || size) && (
                    <div className="flex gap-2 text-sm text-muted-foreground mt-1">
                      {color && <span>Color: <span className="font-medium">{color}</span></span>}
                      {size && <span>Size: <span className="font-medium">{size}</span></span>}
                    </div>
                  )}
                  {originalPrice && originalPrice > unitPrice && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground line-through">৳{originalPrice.toFixed(2)}</span>
                      {discount && <span className="text-xs text-destructive font-medium">-{discount}%</span>}
                    </div>
                  )}
                  <div className="font-semibold mt-1">৳{unitPrice.toFixed(2)}</div>
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
                <div className="font-bold text-lg">৳{(unitPrice * it.quantity).toFixed(2)}</div>
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
