"use client"

import { useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { ProductGrid } from "@/components/product-grid"
import { NewsletterSection } from "@/components/newsletter-section"
import { ecommerceApi, ProductByColorEntry } from "@/lib/api"

export default function WomenCollectionPage() {
  const [products, setProducts] = useState<ProductByColorEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(24)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      try {
        // Filter by gender: 'women' or 'FEMALE' - shows FEMALE and UNISEX products
        const resp = await ecommerceApi.getProductsByColorPaginated({ 
          gender: 'women', 
          page, 
          page_size: pageSize 
        })
        setProducts(resp.results)
        setTotalCount(resp.count)
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [page, pageSize])

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Women", href: "/women" }]} />

          <div className="mt-6 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Women</h1>
            <p className="text-muted-foreground">Explore products for women</p>
          </div>

          {loading ? (
            <div className="text-center py-12">Loading products...</div>
          ) : (
            <ProductGrid
              category={`Women`}
              products={products.map((item) => ({
                id: `${item.product_id}/${item.color_slug}`,
                name: `${item.product_name} - ${item.color_name}`,
                price: Number(item.product_price),
                rating: 4.5,
                image: item.cover_image_url || "/placeholder.jpg",
              }))}
              totalCount={totalCount}
              page={page}
              pageSize={pageSize}
              onPageChange={setPage}
            />
          )}
        </div>
        <NewsletterSection />
      </main>
      <SiteFooter />
    </div>
  )
}


