import { Metadata } from "next"
import { generateMetadata as generateSEOMetadata } from "@/lib/seo"

export const metadata: Metadata = generateSEOMetadata({
  title: "All Products - Shop Complete Collection",
  description: "Browse our complete collection of premium fashion and clothing at Raw Stitch. Discover men's, women's, and unisex apparel. Shop the latest trends and styles.",
  url: "/products",
  keywords: ["all products", "fashion collection", "clothing", "apparel", "Raw Stitch", "online shopping"],
})

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

