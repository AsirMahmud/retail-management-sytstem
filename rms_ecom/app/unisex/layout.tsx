import { Metadata } from "next"
import { generateMetadata as generateSEOMetadata } from "@/lib/seo"

export const metadata: Metadata = generateSEOMetadata({
  title: "Unisex Collection - Fashion for Everyone",
  description: "Browse our unisex fashion collection at Raw Stitch. Discover versatile clothing and apparel designed for everyone. Style that transcends gender boundaries.",
  url: "/unisex",
  keywords: ["unisex fashion", "unisex clothing", "unisex apparel", "gender-neutral fashion", "Raw Stitch", "unisex online shopping"],
})

export default function UnisexLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

