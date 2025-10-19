import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { NewsletterSection } from "@/components/newsletter-section"
import { ProductGallery } from "@/components/product-gallery"
import { ProductInfo } from "@/components/product-info"
import { ProductTabs } from "@/components/product-tabs"
import { ProductRecommendations } from "@/components/product-recommendations"
import { Breadcrumb } from "@/components/breadcrumb"

export default function ProductPage() {
  const product = {
    id: "1",
    name: "ONE LIFE GRAPHIC T-SHIRT",
    price: 260,
    originalPrice: 300,
    discount: 40,
    rating: 4.5,
    reviewCount: 451,
    description:
      "This graphic t-shirt which is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.",
    images: ["/product-main.jpg", "/product-back.jpg", "/product-model.jpg"],
    colors: [
      { name: "Olive", value: "#4F4631" },
      { name: "Dark Green", value: "#314F4A" },
      { name: "Navy", value: "#31344F" },
    ],
    sizes: ["Small", "Medium", "Large", "X-Large"],
  }

  const recommendations = [
    {
      id: "9",
      name: "Polo with Contrast Trims",
      price: 212,
      originalPrice: 242,
      rating: 4.5,
      image: "/polo-blue.jpg",
      discount: 20,
    },
    {
      id: "10",
      name: "Gradient Graphic T-shirt",
      price: 145,
      rating: 3.5,
      image: "/gradient-tee.jpg",
    },
    {
      id: "11",
      name: "Polo with Tipping Details",
      price: 180,
      rating: 4.5,
      image: "/polo-pink.jpg",
    },
    {
      id: "12",
      name: "Black Striped T-shirt",
      price: 120,
      originalPrice: 160,
      rating: 5.0,
      image: "/striped-black-tee.jpg",
      discount: 30,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container px-4 py-4 lg:py-6">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Shop", href: "/shop" },
              { label: "Men", href: "/shop/men" },
              { label: "T-shirts", href: "/shop/men/t-shirts" },
            ]}
          />
        </div>

        <div className="container px-4 pb-12 lg:pb-16">
          <div className="grid gap-8 lg:gap-12 grid-cols-1 lg:grid-cols-2">
            <ProductGallery images={product.images} />
            <ProductInfo product={product} />
          </div>
        </div>

        <ProductTabs />

        <ProductRecommendations products={recommendations} />

        <NewsletterSection />
      </main>
      <SiteFooter />
    </div>
  )
}
