"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useGlobalDiscount } from "@/lib/useGlobalDiscount"
import { ProductSizeModal } from "@/components/product-size-modal"
import { DiscountInfo } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

interface ProductCardProps {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  discount?: number
  discountInfo?: DiscountInfo | null  // Priority-based discount from backend
}

export function ProductCard({ id, name, price, originalPrice, image, discount, discountInfo }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalActionType, setModalActionType] = useState<"addToCart" | "shopNow">("addToCart")

  // Global discount as fallback
  const globalDiscountValue = useGlobalDiscount((state) => state.discount?.value || 0)

  // Priority: Use backend discount_info if available (it handles all priorities)
  // Only fallback to global hook if discountInfo is completely missing (legacy fallback)
  const hasBackendInfo = discountInfo !== null && discountInfo !== undefined

  const finalDiscount = hasBackendInfo
    ? discountInfo!.discount_value
    : Math.max(globalDiscountValue, discount || 0)

  const showDiscount = finalDiscount > 0

  // Calculate prices - use backend final_price if available
  const basePrice = originalPrice !== undefined ? Number(originalPrice) : Number(price)
  const discountedPrice = hasBackendInfo
    ? discountInfo!.final_price
    : (showDiscount ? basePrice * (1 - finalDiscount / 100) : basePrice)

  const numericDiscounted = Number.isFinite(discountedPrice) ? Math.round(discountedPrice) : 0
  const numericOriginal = showDiscount ? basePrice : (originalPrice !== undefined ? Number(originalPrice) : undefined)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setModalActionType("addToCart")
    setIsModalOpen(true)
  }

  const handleShopNow = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setModalActionType("shopNow")
    setIsModalOpen(true)
  }

  return (
    <>
      <Link href={`/product/${id}`} className="block w-full ">
        <Card className="group cursor-pointer border-0 shadow-none lg:min-h-[420px] w-full">
          <CardContent className="p-0 w-full">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted mb-4">
              {showDiscount && (
                <div className="absolute left-3 top-3 z-10">
                  <span className="inline-flex items-center rounded-full bg-black/90 px-3 py-1 text-[11px] font-semibold text-white shadow-sm">
                    SAVE {Math.round(finalDiscount)}%
                  </span>
                </div>
              )}
              <Image
                src={image || "/placeholder.svg"}
                alt={name}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-sm lg:text-base leading-snug line-clamp-2">{toTitleCase(name)}</h3>
              <div className="flex items-center gap-3">
                <span className="text-xl lg:text-2xl font-bold">৳{numericDiscounted.toFixed(0)}</span>
                {showDiscount && numericOriginal !== undefined && (
                  <span className="text-lg lg:text-xl text-muted-foreground/60 line-through">৳{Math.round(numericOriginal).toFixed(0)}</span>
                )}
              </div>
              <div className="pt-1 space-y-2">
                <Button
                  className="w-full rounded-full bg-black text-white hover:bg-black/90"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
                <Button
                  className="w-full rounded-full bg-white text-black border-2 border-black hover:bg-black hover:text-white transition-colors"
                  onClick={handleShopNow}
                >
                  Shop Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
      <ProductSizeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productId={id}
        productName={name}
        productImage={image}
        productPrice={numericDiscounted}
        productOriginalPrice={numericOriginal}
        productDiscount={finalDiscount}
        actionType={modalActionType}
      />
    </>
  )
}

// Capitalize each word for product titles
function toTitleCase(input: string): string {
  return (input || "")
    .toLowerCase()
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

export function ProductCardSkeleton() {
  return (
    <Card className="border-0 shadow-none lg:min-h-[420px] w-full">
      <CardContent className="p-0 w-full">
        <div className="relative aspect-square overflow-hidden rounded-2xl mb-4">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>
          <div className="pt-1 space-y-2">
            <Skeleton className="h-10 w-full rounded-full" />
            <Skeleton className="h-10 w-full rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
