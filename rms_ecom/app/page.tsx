import { SiteHeader } from "@/components/site-header"
import { PromoBanner } from "@/components/promo-banner"
import { HeroSection } from "@/components/hero-section"
import { BrandShowcase } from "@/components/brand-showcase"
import { ProductSection } from "@/components/product-section"
import { CategorySection } from "@/components/category-section"
import { FeaturesSection } from "@/components/features-section"
import { NewsletterSection } from "@/components/newsletter-section"
import { SiteFooter } from "@/components/site-footer"

const newArrivals = [
  {
    id: "1",
    name: "T-shirt with Tape Details",
    price: 120,
    rating: 4.5,
    image: "/black-t-shirt.png",
  },
  {
    id: "2",
    name: "Skinny Fit Jeans",
    price: 240,
    originalPrice: 260,
    rating: 3.5,
    image: "/classic-blue-jeans.png",
    discount: 20,
  },
  {
    id: "3",
    name: "Checkered Shirt",
    price: 180,
    rating: 4.5,
    image: "/checkered-shirt.png",
  },
  {
    id: "4",
    name: "Sleeve Striped T-shirt",
    price: 130,
    originalPrice: 160,
    rating: 4.5,
    image: "/striped-t-shirt.png",
    discount: 30,
  },
]

const topSelling = [
  {
    id: "5",
    name: "Vertical Striped Shirt",
    price: 212,
    originalPrice: 232,
    rating: 5.0,
    image: "/vertical-striped-shirt.jpg",
    discount: 20,
  },
  {
    id: "6",
    name: "Courage Graphic T-shirt",
    price: 145,
    rating: 4.0,
    image: "/orange-graphic-tee.png",
  },
  {
    id: "7",
    name: "Loose Fit Bermuda Shorts",
    price: 80,
    rating: 3.0,
    image: "/denim-shorts.png",
  },
  {
    id: "8",
    name: "Faded Skinny Jeans",
    price: 210,
    rating: 4.5,
    image: "/black-jeans.png",
  },
]

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PromoBanner />
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <BrandShowcase />
        <ProductSection title="NEW ARRIVALS" products={newArrivals} />
        <div className="container px-4">
          <hr className="border-border" />
        </div>
        <ProductSection title="TOP SELLING" products={topSelling} />
        <CategorySection />
        <FeaturesSection />
        <NewsletterSection />
      </main>
      <SiteFooter />
    </div>
  )
}
