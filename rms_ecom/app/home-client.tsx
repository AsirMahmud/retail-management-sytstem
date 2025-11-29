"use client"

import { useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { PromoBanner } from "@/components/promo-banner"
import { HeroSection } from "@/components/hero-section"
import { BrandShowcase } from "@/components/brand-showcase"
import { ProductSection } from "@/components/product-section"
import { FeaturesSection } from "@/components/features-section"
import { NewsletterSection } from "@/components/newsletter-section"
import { SiteFooter } from "@/components/site-footer"
import { ecommerceApi, EcommerceProduct, ProductByColorEntry } from "@/lib/api"
import { StructuredData } from "@/components/structured-data"
import { generateOrganizationStructuredData, generateWebsiteStructuredData } from "@/lib/seo"
import { useLoading } from "@/hooks/useLoading"

export default function HomePageClient() {
  const [showcaseData, setShowcaseData] = useState<{
    new_arrivals: EcommerceProduct[];
    top_selling: EcommerceProduct[];
    featured: EcommerceProduct[];
    trending: EcommerceProduct[];
  } | null>(null);
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    const fetchShowcaseData = async () => {
      try {
        startLoading();
        const data = await ecommerceApi.getShowcase({
          new_arrivals_limit: 4,
          top_selling_limit: 4,
          featured_limit: 4,
          trending_limit: 4,
        });
        setShowcaseData({
          new_arrivals: data.new_arrivals.products,
          top_selling: data.top_selling.products,
          featured: data.featured.products,
          trending: data.trending.products,
        });
      } catch (error) {
        console.error('Failed to fetch showcase data:', error);
      } finally {
        stopLoading();
      }
    };

    fetchShowcaseData();
  }, [startLoading, stopLoading]);

  // Transform API data to match component interface
  const toCard = (entry: ProductByColorEntry) => ({
    id: `${entry.product_id}/${entry.color_slug}`,
    name: `${entry.product_name} - ${entry.color_name}`,
    price: Number(entry.product_price),
    rating: 4.5,
    image: entry.cover_image_url || "/placeholder.jpg",
  })

  return (
    <div className="flex min-h-screen flex-col">
      <StructuredData data={generateOrganizationStructuredData()} />
      <StructuredData data={generateWebsiteStructuredData()} />
      <PromoBanner />
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <BrandShowcase />
        {showcaseData && (
          <>
            {showcaseData.new_arrivals.length > 0 && (
              <ColorSection title="NEW ARRIVALS" baseProducts={showcaseData.new_arrivals} toCard={toCard} />
            )}
            {showcaseData.top_selling.length > 0 && (
              <>
                <div className="container px-4"><hr className="border-border" /></div>
                <ColorSection title="TOP SELLING" baseProducts={showcaseData.top_selling} toCard={toCard} />
              </>
            )}
            {showcaseData.trending.length > 0 && (
              <>
                <div className="container px-4"><hr className="border-border" /></div>
                <ColorSection title="TRENDING" baseProducts={showcaseData.trending} toCard={toCard} />
              </>
            )}
            {showcaseData.featured.length > 0 && (
              <>
                <div className="container px-4"><hr className="border-border" /></div>
                <ColorSection title="FEATURED" baseProducts={showcaseData.featured} toCard={toCard} />
              </>
            )}
          </>
        )}
        <FeaturesSection />
        <NewsletterSection />
      </main>
      <SiteFooter />
    </div>
  )
}

function ColorSection({ title, baseProducts, toCard }: { title: string; baseProducts: EcommerceProduct[]; toCard: (e: ProductByColorEntry)=>{id:string;name:string;price:number;rating:number;image:string} }) {
  const [entries, setEntries] = useState<ProductByColorEntry[]>([])
  useEffect(() => {
    const load = async () => {
      try {
        const ids = baseProducts.map(p => p.id)
        if (ids.length === 0) { setEntries([]); return }
        const data = await ecommerceApi.getProductsByColor({ product_ids: ids })
        setEntries(data)
      } catch (e) {
        setEntries([])
      }
    }
    load()
  }, [baseProducts])
  if (entries.length === 0) return null
  return (
    <ProductSection
      title={title}
      products={entries.slice(0, 8).map(toCard)}
      viewAllHref="/products"
    />
  )
}

