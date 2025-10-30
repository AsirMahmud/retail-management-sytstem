import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useGlobalDiscount } from "@/lib/useGlobalDiscount"

interface ProductCardProps {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  discount?: number
}

export function ProductCard({ id, name, price, originalPrice, image, discount }: ProductCardProps) {
  const globalDiscountValue = useGlobalDiscount((state) => state.discount?.value || 0)
  const finalDiscount = Math.max(globalDiscountValue, discount || 0)
  const showDiscount = !!finalDiscount && finalDiscount > 0
  const newPrice = showDiscount && originalPrice
    ? originalPrice * (1 - finalDiscount / 100)
    : price

  const numericDiscounted = Number(newPrice) || 0
  const numericOriginal = originalPrice !== undefined ? Number(originalPrice) : undefined

  return (
    <Link href={`/product/${id}`}>
      <Card className="group cursor-pointer border-0 shadow-none">
        <CardContent className="p-0">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted mb-4">
            {showDiscount && (
              <div className="absolute left-3 top-3 z-10">
                <span className="inline-flex items-center rounded-full bg-black/90 px-3 py-1 text-[11px] font-semibold text-white shadow-sm">
                  SAVE {finalDiscount}%
                </span>
              </div>
            )}
            <img
              src={image || "/placeholder.svg"}
              alt={name}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="space-y-3">
            <h3 className="font-bold text-sm lg:text-base leading-snug line-clamp-2">{name}</h3>
            <div className="flex items-center gap-3">
              <span className="text-xl lg:text-2xl font-bold">${numericDiscounted.toFixed(0)}</span>
              {numericOriginal !== undefined && (
                <span className="text-lg lg:text-xl text-muted-foreground/60 line-through">${numericOriginal.toFixed(0)}</span>
              )}
            </div>
            <div className="pt-1">
              <Button
                className="w-full rounded-full bg-black text-white hover:bg-black/90"
                onClick={(e) => { e.preventDefault() }}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
