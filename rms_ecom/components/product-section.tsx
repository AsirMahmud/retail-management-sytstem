import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import Link from "next/link"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  rating: number
  image: string
  discount?: number
}

interface ProductSectionProps {
  title: string
  products: Product[]
  viewAllHref?: string
}

export function ProductSection({ title, products, viewAllHref = "/products" }: ProductSectionProps) {
  return (
    <section className="w-full py-16">
      <div className="container px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 tracking-tight">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
        <div className="flex justify-center mt-10">
          <Link href={viewAllHref}>
            <Button variant="outline" size="lg" className="rounded-full px-12 bg-transparent">
              View All
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
