import { ProductCard } from "@/components/product-card"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  rating: number
  image: string
  discount?: number
}

interface ProductRecommendationsProps {
  products: Product[]
}

export function ProductRecommendations({ products }: ProductRecommendationsProps) {
  return (
    <section className="container px-4 py-12 lg:py-16">
      <h2 className="font-serif text-3xl lg:text-5xl font-bold text-center mb-10 lg:mb-14">YOU MIGHT ALSO LIKE</h2>

      <div className="grid grid-cols-2 gap-4 lg:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  )
}
