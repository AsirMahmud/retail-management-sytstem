import { Metadata } from "next"
import { generateMetadata as generateSEOMetadata } from "@/lib/seo"

export const metadata: Metadata = generateSEOMetadata({
  title: "Men's Collection - Premium Men's Fashion",
  description: "Discover our premium men's fashion collection at Raw Stitch. Shop the latest trends in men's clothing, apparel, and accessories. Quality fashion for the modern man.",
  url: "/men",
  keywords: ["men's fashion", "men's clothing", "men's apparel", "men's collection", "Raw Stitch", "men's online shopping"],
})

export default function MenLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}


