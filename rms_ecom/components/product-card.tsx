import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface ProductCardProps {
  id: string
  name: string
  price: number
  originalPrice?: number
  rating: number
  image: string
  discount?: number
}

export function ProductCard({ id, name, price, originalPrice, rating, image, discount }: ProductCardProps) {
  return (
    <Link href={`/product/${id}`}>
      <Card className="group cursor-pointer border-0 shadow-none">
        <CardContent className="p-0">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted mb-4">
            <img
              src={image || "/placeholder.svg"}
              alt={name}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-base lg:text-lg line-clamp-1">{name}</h3>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
                  }`}
                />
              ))}
              <span className="text-sm text-muted-foreground ml-1">{rating}/5</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl lg:text-2xl font-bold">${price}</span>
              {originalPrice && (
                <>
                  <span className="text-lg lg:text-xl text-muted-foreground/60 line-through">${originalPrice}</span>
                  {discount && (
                    <Badge variant="destructive" className="rounded-full text-xs px-2.5 py-0.5">
                      -{discount}%
                    </Badge>
                  )}
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
