import { Metadata } from "next"
import { generateMetadata as generateSEOMetadata } from "@/lib/seo"

export const metadata: Metadata = generateSEOMetadata({
  title: "Women's Collection - Premium Women's Fashion",
  description: "Explore our premium women's fashion collection at Raw Stitch. Shop the latest trends in women's clothing, apparel, and accessories. Style and quality for every occasion.",
  url: "/women",
  keywords: ["women's fashion", "women's clothing", "women's apparel", "women's collection", "Raw Stitch", "women's online shopping"],
})

export default function WomenLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}


