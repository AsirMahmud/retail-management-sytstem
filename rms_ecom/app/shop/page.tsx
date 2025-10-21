"use client"

import { useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { ProductGrid } from "@/components/product-grid"
import { CategoryFilters } from "@/components/category-filters"
import { NewsletterSection } from "@/components/newsletter-section"
import { ecommerceApi, EcommerceProduct } from "@/lib/api"

export default function ShopPage() {
  const [products, setProducts] = useState<EcommerceProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const data = await ecommerceApi.getAllProducts()
        setProducts(data.products)
      } catch (e) {
        console.error('Failed to fetch products', e)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }]} />

          <div className="flex gap-6 mt-6">
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <CategoryFilters />
            </aside>

            <div className="flex-1">
              {loading ? (
                <div className="text-center py-8">Loading products...</div>
              ) : (
                <ProductGrid
                  category="All"
                  products={products.map(p => ({
                    id: p.id,
                    name: p.name,
                    price: p.selling_price,
                    rating: 4.5,
                    image: p.primary_image || p.image_url || p.image || "/placeholder.jpg",
                  }))}
                />
              )}
            </div>
          </div>
        </div>
        <NewsletterSection />
      </main>
      <SiteFooter />
    </div>
  )
}


