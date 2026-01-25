"use client"

import { useState, useMemo, useEffect } from "react"
import { Minus, Plus, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { ProductVariant, ecommerceApi } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { useCartStore } from "@/hooks/useCartStore"
import { useGlobalDiscount } from "@/lib/useGlobalDiscount"
import { useRouter } from "next/navigation"
import { setDirectCheckoutItems, type CartItem } from "@/lib/cart"
import Image from "next/image"

interface ProductSizeModalProps {
  isOpen: boolean
  onClose: () => void
  productId: string | number
  productName: string
  productImage?: string
  productPrice: number
  productOriginalPrice?: number
  productDiscount?: number
  actionType: "addToCart" | "shopNow"
}

export function ProductSizeModal({
  isOpen,
  onClose,
  productId,
  productName,
  productImage,
  productPrice,
  productOriginalPrice,
  productDiscount,
  actionType,
}: ProductSizeModalProps) {
  const [loading, setLoading] = useState(false)
  const [productData, setProductData] = useState<{
    colors: { name: string; value: string }[]
    sizes: string[]
    variants: ProductVariant[]
  } | null>(null)
  const [selectedColor, setSelectedColor] = useState(0)
  const [selectedSize, setSelectedSize] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const addToCart = useCartStore((s) => s.addItem)
  const router = useRouter()

  // Strict Discount Priority Logic:
  // 1. Backend Discount Info (passed as productDiscount which should contain the backend value if valid)
  // 2. Global Discount (frontend fallback only if backend info is strictly N/A)
  // Note: For ProductSizeModal, we rely on the passed props. If productDiscount is passed, we assume it's the correct final discount.
  // However, to be safe and consistent with other components, we should check if we have explicit backend info.
  // Since ProductSizeModal props are simpler, we assume if productDiscount is provided > 0, it MIGHT be from backend or global.
  // Ideally, this component should also receive a full discountInfo object, but for now we'll enforce that 
  // if specific discount is passed, use it over global unless necessary. 

  // Actually, to be strictly consistent, we should use the same pattern. 
  // Let's assume productDiscount PASSED IN effectively acts as "backend/calculated discount".
  // If we want to support global fallback correctly, we need to know if productDiscount is "real".

  const globalDiscountValue = useGlobalDiscount((state) => state.discount?.value || 0)

  // Logic: productDiscount prop usually comes from the card/page which already did the calc.
  // So we should trust it primarily.
  const finalDiscount = productDiscount !== undefined
    ? productDiscount
    : globalDiscountValue

  const showDiscount = finalDiscount > 0
  const basePrice = productOriginalPrice !== undefined ? Number(productOriginalPrice) : Number(productPrice)

  // Use passed price as discounted price if available (it should already be calculated)
  // Otherwise calculate it
  const discounted = productPrice !== undefined ? Number(productPrice) : (showDiscount ? basePrice * (1 - finalDiscount / 100) : basePrice)

  // Extract numeric product ID from string (handles formats like "123" or "123/blue")
  const getNumericProductId = (id: string | number): number | null => {
    if (typeof id === 'number') {
      return isNaN(id) ? null : id
    }
    const str = String(id)
    // If it contains a slash, extract the part before the slash
    const numericPart = str.includes('/') ? str.split('/')[0] : str
    const numId = Number(numericPart)
    return isNaN(numId) ? null : numId
  }

  // Fetch product details when modal opens
  useEffect(() => {
    if (isOpen && productId) {
      const numericId = getNumericProductId(productId)
      if (!numericId) {
        console.error("Invalid product ID:", productId)
        setLoading(false)
        return
      }

      setLoading(true)
      ecommerceApi
        .getProductDetail(numericId)
        .then((response) => {
          const product = response.product
          setProductData({
            colors: product.available_colors.map((c) => ({ name: c.name, value: c.hex })),
            sizes: product.available_sizes || [],
            variants: product.variants || [],
          })
          setLoading(false)
        })
        .catch((error) => {
          console.error("Failed to fetch product details:", error)
          setLoading(false)
        })
    }
  }, [isOpen, productId])

  // Reset selections when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedColor(0)
      setSelectedSize(0)
      setQuantity(1)
    }
  }, [isOpen])

  // Get current color
  const currentColor = productData?.colors[selectedColor]

  // Get available sizes for selected color with stock info
  const availableSizesWithStock = useMemo(() => {
    if (!productData) return []

    if (!productData.variants || productData.variants.length === 0) {
      // Fallback to just sizes if no variant data
      return productData.sizes.map((size, index) => ({
        size,
        index,
        stock: 999,
        inStock: true,
        variant: null,
      }))
    }

    return productData.sizes.map((size, index) => {
      // Find variant for this specific size + color combination
      const variant = productData.variants.find(
        (v) => v.size === size && v.color === currentColor?.name
      )

      const stock = variant?.stock || 0
      return {
        size,
        index,
        stock,
        inStock: stock > 0,
        variant: variant || null,
      }
    })
  }, [productData, currentColor?.name])

  // Get stock for selected size
  const selectedSizeStock = availableSizesWithStock[selectedSize]?.stock || 0

  // When color changes, reset to first available size with stock
  useEffect(() => {
    if (availableSizesWithStock.length > 0) {
      const firstInStockSize = availableSizesWithStock.findIndex((size) => size.inStock)
      if (firstInStockSize !== -1) {
        setSelectedSize(firstInStockSize)
      }
    }
  }, [selectedColor, availableSizesWithStock])

  const handleAddToCart = () => {
    if (selectedSizeStock === 0 || !productData) return

    const numericId = getNumericProductId(productId)
    if (!numericId) {
      console.error("Invalid product ID:", productId)
      return
    }

    const sizeName = availableSizesWithStock[selectedSize]?.size
    const colorName = productData.colors[selectedColor]?.name

    addToCart({
      productId: String(numericId),
      quantity,
      variations: {
        color: colorName,
        size: sizeName,
      },
      productDetails: {
        name: productName,
        price: discounted,
        discount: finalDiscount,
      },
    })

    onClose()
  }

  const handleShopNow = () => {
    if (selectedSizeStock === 0 || !productData) return

    const numericId = getNumericProductId(productId)
    if (!numericId) {
      console.error("Invalid product ID:", productId)
      return
    }

    const sizeName = availableSizesWithStock[selectedSize]?.size
    const colorName = productData.colors[selectedColor]?.name

    const directCheckoutItem: CartItem = {
      productId: String(numericId),
      quantity,
      variations: {
        color: colorName,
        size: sizeName,
      },
      addedAt: Date.now(),
    }

    setDirectCheckoutItems([directCheckoutItem])
    onClose()
    router.push("/checkout")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{toTitleCase(productName)}</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : !productData ? (
          <div className="py-12 text-center text-muted-foreground">
            Failed to load product details
          </div>
        ) : (
          <div className="space-y-6">
            {/* Product Image */}
            {productImage && (
              <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
                <Image
                  src={productImage}
                  alt={productName}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
                />
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold">৳{Math.round(discounted)}</span>
              {showDiscount && (
                <>
                  <span className="text-xl text-muted-foreground/60 line-through">
                    ৳{Math.round(basePrice)}
                  </span>
                  <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-600">
                    -{finalDiscount}%
                  </span>
                </>
              )}
            </div>

            {/* Stock Information */}
            {selectedSizeStock === 0 && (
              <Badge variant="destructive" className="text-sm px-3 py-1">
                Out of Stock
              </Badge>
            )}

            {/* Color Selection */}
            {productData.colors.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-medium text-muted-foreground">Select Color</h3>
                <div className="flex gap-2 flex-wrap">
                  {productData.colors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedColor(index)}
                      aria-label={color.name}
                      className={cn(
                        "relative h-10 w-10 rounded-full transition-all",
                        selectedColor === index && "ring-2 ring-foreground ring-offset-2"
                      )}
                      style={{ backgroundColor: color.value }}
                    >
                      {selectedColor === index && (
                        <Check className="absolute inset-0 m-auto h-5 w-5 text-white drop-shadow-md" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {productData.sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-muted-foreground">Choose Size</h3>
                </div>
                {selectedSizeStock > 0 && (
                  <div className="mb-3">
                    <Badge
                      variant={
                        selectedSizeStock < 10
                          ? "destructive"
                          : selectedSizeStock < 20
                            ? "secondary"
                            : "default"
                      }
                      className="text-sm px-3 py-1 rounded-full"
                    >
                      {selectedSizeStock < 10
                        ? `Only ${selectedSizeStock} left`
                        : `${selectedSizeStock} in stock`}
                    </Badge>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {availableSizesWithStock.map((sizeInfo) => (
                    <button
                      key={sizeInfo.size}
                      onClick={() => {
                        if (sizeInfo.inStock) {
                          setSelectedSize(sizeInfo.index)
                          setQuantity(1)
                        }
                      }}
                      disabled={!sizeInfo.inStock}
                      className={cn(
                        "rounded-full px-6 py-2.5 text-sm font-medium transition-all relative group",
                        !sizeInfo.inStock && "opacity-50 cursor-not-allowed",
                        selectedSize === sizeInfo.index
                          ? "bg-foreground text-background"
                          : sizeInfo.inStock
                            ? "bg-muted hover:bg-muted/80 text-foreground"
                            : "bg-muted/50 text-muted-foreground"
                      )}
                      title={
                        sizeInfo.inStock
                          ? `${currentColor?.name} ${sizeInfo.size}: ${sizeInfo.stock} in stock`
                          : "Out of stock"
                      }
                    >
                      {sizeInfo.size}
                      {sizeInfo.inStock && (
                        <span className="absolute -top-1 -right-1 bg-foreground text-background text-[10px] px-1.5 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          {sizeInfo.stock}
                        </span>
                      )}
                      {!sizeInfo.inStock && " (OOS)"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selection */}
            <div className="flex items-center gap-4">
              <div className="flex items-center rounded-full bg-muted">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-4 hover:bg-muted/80 rounded-l-full transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-5 w-5" />
                </button>
                <span className="px-6 font-medium min-w-[3rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(selectedSizeStock, quantity + 1))}
                  disabled={quantity >= selectedSizeStock}
                  className="p-4 hover:bg-muted/80 rounded-r-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-2">
              {actionType === "addToCart" ? (
                <Button
                  size="lg"
                  className="w-full rounded-full h-auto py-4 text-base font-medium"
                  disabled={selectedSizeStock === 0}
                  onClick={handleAddToCart}
                >
                  {selectedSizeStock === 0 ? "Out of Stock" : "Add to Cart"}
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="w-full rounded-full h-auto py-4 text-base font-medium bg-white text-black border-2 border-black hover:bg-black hover:text-white transition-colors"
                  disabled={selectedSizeStock === 0}
                  onClick={handleShopNow}
                >
                  {selectedSizeStock === 0 ? "Out of Stock" : "Shop Now"}
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// Capitalize each word for product titles
function toTitleCase(input: string): string {
  return (input || "")
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

