"use client"

import { useState, useMemo, useEffect } from "react"
import { Minus, Plus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ProductVariant } from "@/lib/api"
import { Badge } from "@/components/ui/badge"

interface ProductInfoProps {
  product: {
    name: string
    price: number
    originalPrice?: number
    discount?: number
    description: string
    colors: { name: string; value: string }[]
    sizes: string[]
    variants: ProductVariant[]
  }
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [selectedColor, setSelectedColor] = useState(0)
  const [selectedSize, setSelectedSize] = useState(0)
  const [quantity, setQuantity] = useState(1)

  // Get current color
  const currentColor = product.colors[selectedColor]
  
  // Get available sizes for selected color with stock info
  const availableSizesWithStock = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      // Fallback to just sizes if no variant data
      return product.sizes.map((size, index) => ({
        size,
        index,
        stock: 999,
        inStock: true,
        variant: null,
      }))
    }
    
    return product.sizes.map((size, index) => {
      // Find variant for this specific size + color combination
      const variant = product.variants.find(
        v => v.size === size && v.color === currentColor.name
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
  }, [product.sizes, product.variants, currentColor.name])

  // Get stock for selected size
  const selectedSizeStock = availableSizesWithStock[selectedSize]?.stock || 0

  // When color changes, reset to first available size with stock
  useEffect(() => {
    const firstInStockSize = availableSizesWithStock.findIndex(size => size.inStock)
    if (firstInStockSize !== -1) {
      setSelectedSize(firstInStockSize)
    }
  }, [selectedColor, availableSizesWithStock])

  return (
    <div className="flex flex-col gap-4 lg:gap-5">
      <div>
        <h1 className="font-serif text-3xl lg:text-[40px] font-bold mb-3 leading-tight">{product.name}</h1>

        {/* Stock Information Badge */}
        {selectedSizeStock > 0 && (
          <div className="mb-4">
            <Badge 
              variant={selectedSizeStock < 10 ? "destructive" : selectedSizeStock < 20 ? "secondary" : "default"}
              className="text-sm px-3 py-1"
            >
              {selectedSizeStock < 10 
                ? `Only ${selectedSizeStock} left` 
                : `${selectedSizeStock} in stock`}
            </Badge>
          </div>
        )}
        
        {/* Show out of stock badge when no stock */}
        {selectedSizeStock === 0 && (
          <div className="mb-4">
            <Badge 
              variant="destructive"
              className="text-sm px-3 py-1"
            >
              Out of Stock
            </Badge>
          </div>
        )}

        <div className="flex items-center gap-3 mb-5">
          <span className="text-3xl lg:text-[32px] font-bold">৳{Math.round(product.price)}</span>
          {product.originalPrice && (
            <>
              <span className="text-2xl lg:text-[28px] text-muted-foreground/60 line-through">
                ৳{Math.round(product.originalPrice)}
              </span>
              <span className="rounded-full bg-red-100 px-3.5 py-1.5 text-xs font-medium text-red-600">
                -{product.discount}%
              </span>
            </>
          )}
        </div>

        <p className="text-muted-foreground leading-relaxed">{product.description}</p>
      </div>

      <div className="h-px bg-border" />

      <div>
        <h3 className="mb-4 text-muted-foreground">Select Colors</h3>
        <div className="flex gap-4">
          {product.colors.map((color, index) => (
            <button
              key={index}
              onClick={() => setSelectedColor(index)}
              className={cn(
                "relative h-10 w-10 rounded-full transition-all hover:scale-105",
                selectedColor === index && "ring-2 ring-foreground ring-offset-2",
              )}
              style={{ backgroundColor: color.value }}
              aria-label={color.name}
            >
              {selectedColor === index && (
                <Check className="absolute inset-0 m-auto h-5 w-5 text-white drop-shadow-md" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-border" />

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-muted-foreground">Choose Size</h3>
        </div>
        <div className="flex flex-wrap gap-3">
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
              title={sizeInfo.inStock ? `${currentColor.name} ${sizeInfo.size}: ${sizeInfo.stock} in stock` : "Out of stock"}
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

      <div className="h-px bg-border" />

      <div className="flex gap-4 pt-2">
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

        <Button 
          size="lg" 
          className="flex-1 rounded-full h-auto py-4 text-base font-medium"
          disabled={selectedSizeStock === 0}
        >
          {selectedSizeStock === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
      </div>
    </div>
  )
}
