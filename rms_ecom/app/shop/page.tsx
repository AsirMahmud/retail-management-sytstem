"use client"

import { useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { ProductGrid } from "@/components/product-grid"
import { CategoryFilters } from "@/components/category-filters"
import { NewsletterSection } from "@/components/newsletter-section"
import { ecommerceApi, EcommerceProduct } from "@/lib/api"
import { useLoading } from "@/hooks/useLoading"

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([])
  const { startLoading, stopLoading } = useLoading()
  const [page, setPage] = useState(1)
  const [pageSize] = useState(24)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        startLoading()
        const data = await ecommerceApi.getProductsByColorPaginated({
          page,
          page_size: pageSize
        })
        setProducts(data.results)
        setTotalCount(data.count)
      } catch (e) {
        console.error('Failed to fetch products', e)
      } finally {
        stopLoading()
      }
    }
    fetchAll()
  }, [page, pageSize, startLoading, stopLoading])

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
              <ProductGrid
                category="All"
                products={products.map(p => ({
                  id: `${p.product_id}/${p.color_slug}`,
                  name: `${p.product_name} - ${p.color_name}`,
                  price: Number(p.product_price),
                  rating: 4.5,
                  image: p.cover_image_url || "/placeholder.jpg",
                }))}
                totalCount={totalCount}
                page={page}
                pageSize={pageSize}
                onPageChange={setPage}
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


