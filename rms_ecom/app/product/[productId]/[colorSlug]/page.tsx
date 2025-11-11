"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { NewsletterSection } from "@/components/newsletter-section"
import { ProductGallery } from "@/components/product-gallery"
import { ProductInfo } from "@/components/product-info"
import { Breadcrumb } from "@/components/breadcrumb"
import { ecommerceApi, ProductDetailByColorResponse, EcommerceProduct, ProductByColorEntry } from "@/lib/api"
import { ProductRecommendations } from "@/components/product-recommendations"
import { ProductTabs } from "@/components/product-tabs"

export default function ProductByColorPage() {
  const params = useParams()
  const router = useRouter()
  const productIdParam = params.productId as string
  const colorSlug = params.colorSlug as string

  const [data, setData] = useState<ProductDetailByColorResponse | null>(null)
  const [suggested, setSuggested] = useState<ProductByColorEntry[]>([])
  const [detailExtras, setDetailExtras] = useState<null | {
    size_chart?: { size: string; chest: string; waist: string; height: string }[]
    material_composition?: { name: string; percentage: string }[]
    who_is_this_for?: { title: string; description: string }[]
    features?: { title: string; description: string }[]
  }>(null)
  const [loading, setLoading] = useState(true)
  const productId = Number(productIdParam)

  useEffect(() => {
    const run = async () => {
      try {
        if (!productId || !colorSlug) return
        const response = await ecommerceApi.getProductDetailByColor(productId, colorSlug)
        setData(response)
        // Fetch related/suggested products and get color-wise entries
        const showcase = await ecommerceApi.getProductDetail(productId)
        const relatedProducts = showcase.related_products || []
        setDetailExtras({
          size_chart: showcase.product.size_chart,
          material_composition: showcase.product.material_composition,
          who_is_this_for: showcase.product.who_is_this_for,
          features: showcase.product.features,
        })
        
        if (relatedProducts.length > 0) {
          // Get product IDs from related products
          const relatedProductIds = relatedProducts.map(p => p.id)
          // Fetch color-wise entries for related products
          const colorWiseEntries = await ecommerceApi.getProductsByColor({ 
            product_ids: relatedProductIds 
          })
          setSuggested(colorWiseEntries)
        } else {
          setSuggested([])
        }
      } catch (e) {
        console.error(e)
        // Redirect to Not Available page if the color/product is not found
        router.replace('/product/not-available')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [productId, colorSlug, router])

  // Compute external color toggler links consistently to keep hook order stable
  const colorToggler = useMemo(() => {
    const available = data?.available_colors ?? []
    const currentSlug = data?.color.slug ?? colorSlug
    const pid = data?.product.id ?? productId
    return available.map(c => ({
      name: c.color_name,
      slug: c.color_slug,
      href: `/product/${pid}/${c.color_slug}`,
      active: c.color_slug === currentSlug,
      oos: (c.total_stock || 0) <= 0,
      hex: c.color_hex || '#000000',
    }))
  }, [data, colorSlug, productId])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">
          <div className="container px-4 py-8">
            <div className="text-center">Loading product...</div>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  if (!data) return null

  const galleryImages = data.images.length > 0
    ? data.images.map(i => i.url)
    : []

  // Prepare ProductInfo props (use current color only to drive size stock)
  const productInfo = {
    name: `${data.product.name} - ${data.color.name}`,
    price: Math.round(Number(data.product.price)),
    originalPrice: undefined as number | undefined,
    discount: undefined as number | undefined,
    description: "", // optional
    colors: [{ name: data.color.name, value: "#000000" }],
    sizes: data.sizes.map(s => s.size),
    variants: data.sizes.map(s => ({
      size: s.size,
      color: data.color.name,
      color_hex: "#000000",
      stock: s.stock_qty,
      variant_id: 0,
    }))
  }

  // colorToggler is computed above via useMemo

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container px-4 py-4 lg:py-6">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "All Products", href: "/products" },
              { label: `${data.product.name} - ${data.color.name}`, href: `/product/${data.product.id}/${data.color.slug}` },
            ]}
          />
        </div>

        <div className="container px-4 pb-12 lg:pb-16">
          <div className="grid gap-8 lg:gap-12 grid-cols-1 lg:grid-cols-2">
            <ProductGallery images={galleryImages} />
            <div className="flex flex-col gap-4 lg:gap-5">
              <ProductInfo 
                productId={data.product.id}
                product={productInfo} 
                colorLinks={colorToggler.map(c => ({ name: c.name, value: c.hex, href: c.href, active: c.active, oos: c.oos }))} 
              />
            </div>
          </div>
        </div>

        {/* Product details tabs (size chart, materials, audience, features) */}
        <div className="container px-4 pb-12 lg:pb-16">
          <ProductTabs
            sizeChart={detailExtras?.size_chart || []}
            materials={detailExtras?.material_composition || []}
            whoIsThisFor={detailExtras?.who_is_this_for || []}
            features={detailExtras?.features || []}
          />
        </div>

        {/* Suggested products */}
        {suggested.length > 0 && (
          <div className="container px-4 pb-12">
            <ProductRecommendations
              products={suggested.map(entry => ({
                id: `${entry.product_id}/${entry.color_slug}`,
                name: `${entry.product_name} - ${entry.color_name}`,
                price: Number(entry.product_price),
                originalPrice: undefined,
                image: entry.cover_image_url || "/placeholder.jpg",
                discount: undefined,
              }))}
            />
          </div>
        )}

        <NewsletterSection />
      </main>
      <SiteFooter />
    </div>
  )
}


