import { Metadata } from "next"
import { ecommerceApi } from "@/lib/api"
import { generateProductMetadata } from "@/lib/seo"

interface ProductLayoutProps {
  params: Promise<{ productId: string; colorSlug: string }>
  children: React.ReactNode
}

export async function generateMetadata(
  { params }: ProductLayoutProps
): Promise<Metadata> {
  const resolvedParams = await params
  const productId = Number(resolvedParams.productId)
  const colorSlug = resolvedParams.colorSlug

  try {
    const product = await ecommerceApi.getProductDetailByColor(productId, colorSlug)
    return generateProductMetadata(product)
  } catch (error) {
    // Fallback metadata if product not found
    return {
      title: "Product Not Found | Raw Stitch",
      description: "The product you're looking for is not available.",
      robots: {
        index: false,
        follow: false,
      },
    }
  }
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

