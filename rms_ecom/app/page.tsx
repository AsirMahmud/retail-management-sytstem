import { Metadata } from "next"
import HomePageClient from "./home-client"
import { generateMetadata as generateSEOMetadata } from "@/lib/seo"

export const metadata: Metadata = generateSEOMetadata({
  title: "Raw Stitch - Premium Fashion & Clothing Store",
  description: "Your premier destination for premium fashion and clothing. Discover the latest trends in men's, women's, and unisex fashion. Shop quality apparel with style and confidence.",
  keywords: ["Raw Stitch", "fashion", "clothing", "apparel", "men's fashion", "women's fashion", "online shopping", "fashion store", "premium clothing", "Bangladesh fashion"],
})

export default function HomePage() {
  return <HomePageClient />
}
