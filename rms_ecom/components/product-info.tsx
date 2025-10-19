"use client"

import { useState } from "react"
import { Star, Minus, Plus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ProductInfoProps {
  product: {
    name: string
    price: number
    originalPrice?: number
    discount?: number
    rating: number
    reviewCount: number
    description: string
    colors: { name: string; value: string }[]
    sizes: string[]
  }
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [selectedColor, setSelectedColor] = useState(0)
  const [selectedSize, setSelectedSize] = useState(2)
  const [quantity, setQuantity] = useState(1)

  return (
    <div className="flex flex-col gap-4 lg:gap-5">
      <div>
        <h1 className="font-serif text-3xl lg:text-[40px] font-bold mb-3 leading-tight">{product.name}</h1>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-5 w-5",
                  i < Math.floor(product.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : i < product.rating
                      ? "fill-yellow-400/50 text-yellow-400"
                      : "fill-none text-gray-300",
                )}
              />
            ))}
          </div>
          <span className="text-sm font-medium">{product.rating}/5</span>
        </div>

        <div className="flex items-center gap-3 mb-5">
          <span className="text-3xl lg:text-[32px] font-bold">${product.price}</span>
          {product.originalPrice && (
            <>
              <span className="text-2xl lg:text-[28px] text-muted-foreground/60 line-through">
                ${product.originalPrice}
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
        <h3 className="mb-4 text-muted-foreground">Choose Size</h3>
        <div className="flex flex-wrap gap-3">
          {product.sizes.map((size, index) => (
            <button
              key={size}
              onClick={() => setSelectedSize(index)}
              className={cn(
                "rounded-full px-6 py-2.5 text-sm font-medium transition-all",
                selectedSize === index ? "bg-foreground text-background" : "bg-muted hover:bg-muted/80 text-foreground",
              )}
            >
              {size}
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
            onClick={() => setQuantity(quantity + 1)}
            className="p-4 hover:bg-muted/80 rounded-r-full transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        <Button size="lg" className="flex-1 rounded-full h-auto py-4 text-base font-medium">
          Add to Cart
        </Button>
      </div>
    </div>
  )
}
