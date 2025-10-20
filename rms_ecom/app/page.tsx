"use client"

import { useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { PromoBanner } from "@/components/promo-banner"
import { HeroSection } from "@/components/hero-section"
import { BrandShowcase } from "@/components/brand-showcase"
import { ProductSection } from "@/components/product-section"
import { CategorySection } from "@/components/category-section"
import { FeaturesSection } from "@/components/features-section"
import { NewsletterSection } from "@/components/newsletter-section"
import { SiteFooter } from "@/components/site-footer"
import { ecommerceApi, EcommerceProduct } from "@/lib/api"

export default function HomePage() {
  const [showcaseData, setShowcaseData] = useState<{
    new_arrivals: EcommerceProduct[];
    top_selling: EcommerceProduct[];
    featured: EcommerceProduct[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShowcaseData = async () => {
      try {
        const data = await ecommerceApi.getShowcase({
          new_arrivals_limit: 4,
          top_selling_limit: 4,
          featured_limit: 4,
        });
        setShowcaseData({
          new_arrivals: data.new_arrivals.products,
          top_selling: data.top_selling.products,
          featured: data.featured.products,
        });
      } catch (error) {
        console.error('Failed to fetch showcase data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShowcaseData();
  }, []);

  // Transform API data to match component interface
  const transformProduct = (product: EcommerceProduct) => ({
    id: product.id.toString(),
    name: product.name,
    price: product.selling_price,
    rating: 4.5, // Default rating since not in API
    image: product.primary_image || product.image_url || product.image || "/placeholder.jpg",
  });

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <PromoBanner />
        <SiteHeader />
        <main className="flex-1">
          <HeroSection />
          <BrandShowcase />
          <div className="container px-4 py-8">
            <div className="text-center">Loading products...</div>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PromoBanner />
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <BrandShowcase />
        {showcaseData && (
          <>
            <ProductSection 
              title="NEW ARRIVALS" 
              products={showcaseData.new_arrivals.map(transformProduct)} 
            />
            <div className="container px-4">
              <hr className="border-border" />
            </div>
            <ProductSection 
              title="TOP SELLING" 
              products={showcaseData.top_selling.map(transformProduct)} 
            />
          </>
        )}
        <CategorySection />
        <FeaturesSection />
        <NewsletterSection />
      </main>
      <SiteFooter />
    </div>
  )
}
