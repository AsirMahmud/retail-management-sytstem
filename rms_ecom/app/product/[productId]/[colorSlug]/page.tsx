import { Metadata, ResolvingMetadata } from "next"
import { ecommerceApi } from "@/lib/api"
import ProductByColorPage from "./client"

type Props = {
  params: Promise<{ productId: string; colorSlug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params
  const productId = Number(resolvedParams.productId)
  const product = await ecommerceApi.getProductDetailByColor(productId, resolvedParams.colorSlug)

  const previousImages = (await parent).openGraph?.images || []

  const images = product.images.length > 0
    ? product.images.map(img => img.url)
    : previousImages

  return {
    title: `${product.product.name} - ${product.color.name}`,
    description: `Shop ${product.product.name} in ${product.color.name} at Raw Stitch. Premium quality fashion.`,
    openGraph: {
      title: `${product.product.name} - ${product.color.name}`,
      description: `Shop ${product.product.name} in ${product.color.name} at Raw Stitch. Premium quality fashion.`,
      images: images,
    },
    other: {
      "og:type": "product",
      "product:price:amount": product.product.price,
      "product:price:currency": "BDT",
    },
  }
}

export default function Page() {
  return <ProductByColorPage />
}
