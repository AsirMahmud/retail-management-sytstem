"use client"

import { useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { ProductGrid } from "@/components/product-grid"
import { NewsletterSection } from "@/components/newsletter-section"
import { ecommerceApi, ProductByColorEntry } from "@/lib/api"
import { StructuredData } from "@/components/structured-data"
import { generateBreadcrumbStructuredData } from "@/lib/seo"
import { useLoading } from "@/hooks/useLoading"

export default function MenCollectionPage() {
  const [products, setProducts] = useState<ProductByColorEntry[]>([])
  const { startLoading, stopLoading } = useLoading()
  const [page, setPage] = useState(1)
  const [pageSize] = useState(24)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    const run = async () => {
      startLoading()
      try {
        // Filter by gender: 'men' or 'MALE' - shows MALE and UNISEX products
        const resp = await ecommerceApi.getProductsByColorPaginated({ 
          gender: 'men', 
          page, 
          page_size: pageSize 
        })
        setProducts(resp.results)
        setTotalCount(resp.count)
      } finally {
        stopLoading()
      }
    }
    run()
  }, [page, pageSize, startLoading, stopLoading])

  const breadcrumbItems = [
    { label: "Home", href: "/" }, 
    { label: "Men", href: "/men" }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <StructuredData data={generateBreadcrumbStructuredData(breadcrumbItems)} />
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumb items={breadcrumbItems} />

          <div className="mt-6 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Men</h1>
            <p className="text-muted-foreground">Explore products for men</p>
          </div>

          <ProductGrid
              category={`Men`}
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
        </div>
        <NewsletterSection />
      </main>
      <SiteFooter />
    </div>
  )
}


