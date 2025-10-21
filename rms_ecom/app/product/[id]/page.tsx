"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { NewsletterSection } from "@/components/newsletter-section"
import { ProductGallery } from "@/components/product-gallery"
import { ProductInfo } from "@/components/product-info"
import { ProductTabs } from "@/components/product-tabs"
import { ProductRecommendations } from "@/components/product-recommendations"
import { Breadcrumb } from "@/components/breadcrumb"
import { ecommerceApi, EcommerceProductDetail, EcommerceProduct } from "@/lib/api"

export default function ProductPage() {
  const params = useParams()
  const productId = params.id as string
  const [productData, setProductData] = useState<{
    product: EcommerceProductDetail;
    related_products: EcommerceProduct[];
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const data = await ecommerceApi.getProductDetail(parseInt(productId))
        setProductData(data)
      } catch (error) {
        console.error('Failed to fetch product data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProductData()
    }
  }, [productId])

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

  if (!productData) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">
          <div className="container px-4 py-8">
            <div className="text-center">Product not found</div>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  const { product, related_products } = productData

  // Transform product data to match component interface
  const transformedProduct = {
    id: product.id.toString(),
    name: product.name,
    price: product.selling_price,
    originalPrice: product.selling_price * 1.15, // Add some original price for discount calculation
    discount: 15,
    rating: 4.5, // Default rating
    reviewCount: 451, // Default review count
    description: product.description || "This product offers superior comfort and style.",
    images: (product.images_ordered && product.images_ordered.length > 0)
      ? product.images_ordered
      : [product.primary_image || product.image_url || product.image || "/placeholder.jpg"],
    colors: (product.available_colors || []).map(color => ({
      name: color.name,
      value: (color as any).hex || (color as any).value || '#000000'
    })),
    sizes: product.available_sizes,
  }

  const recommendations = related_products.map(relatedProduct => ({
    id: relatedProduct.id.toString(),
    name: relatedProduct.name,
    price: relatedProduct.selling_price,
    originalPrice: relatedProduct.selling_price * 1.1,
    rating: 4.5,
    image: relatedProduct.primary_image || relatedProduct.image_url || relatedProduct.image || "/placeholder.jpg",
    discount: 10,
  }))

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container px-4 py-4 lg:py-6">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Shop", href: "/shop" },
              { label: product.online_category_name || "Category", href: `/category/${product.online_category_name?.toLowerCase()}` },
              { label: product.name, href: `/product/${product.id}` },
            ]}
          />
        </div>

        <div className="container px-4 pb-12 lg:pb-16">
          <div className="grid gap-8 lg:gap-12 grid-cols-1 lg:grid-cols-2">
            <ProductGallery images={transformedProduct.images} />
            <ProductInfo product={transformedProduct} />
          </div>
        </div>

        <ProductTabs 
          sizeChart={product.size_chart || []}
          materials={product.material_composition || []}
          whoIsThisFor={product.who_is_this_for || []}
          features={product.features || []}
        />

        <ProductRecommendations products={recommendations} />

        <NewsletterSection />
      </main>
      <SiteFooter />
    </div>
  )
}
