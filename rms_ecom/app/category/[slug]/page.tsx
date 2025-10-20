"use client"

import { useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Breadcrumb } from "@/components/breadcrumb"
import { CategoryFilters } from "@/components/category-filters"
import { ProductGrid } from "@/components/product-grid"
import { NewsletterSection } from "@/components/newsletter-section"
import { SiteFooter } from "@/components/site-footer"
import { ecommerceApi, EcommerceProduct } from "@/lib/api"

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const categoryName = params.slug.charAt(0).toUpperCase() + params.slug.slice(1)
  const [products, setProducts] = useState<EcommerceProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryId, setCategoryId] = useState<number | null>(null)

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        // First, get online categories to find the category ID
        const categories = await ecommerceApi.getOnlineCategories()
        const category = categories.find(cat => 
          cat.name.toLowerCase() === categoryName.toLowerCase() || 
          cat.slug === params.slug
        )
        
        if (category) {
          setCategoryId(category.id)
          // Fetch products for this category
          const data = await ecommerceApi.getNewArrivals({
            limit: 20,
            online_category: category.id
          })
          setProducts(data.products)
        }
      } catch (error) {
        console.error('Failed to fetch category data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryData()
  }, [params.slug, categoryName])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-6">
            <div className="text-center">Loading category...</div>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: categoryName, href: `/category/${params.slug}` },
            ]}
          />

          <div className="flex gap-6 mt-6">
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <CategoryFilters />
            </aside>

            <div className="flex-1">
              <ProductGrid 
                category={categoryName} 
                products={products.map(product => ({
                  id: product.id,
                  name: product.name,
                  price: product.selling_price,
                  rating: 4.5,
                  image: product.primary_image || product.image_url || product.image || "/placeholder.jpg",
                }))}
              />
            </div>
          </div>
        </div>
        <NewsletterSection />
      </main>
      <SiteFooter />
    </div>
  )
}
