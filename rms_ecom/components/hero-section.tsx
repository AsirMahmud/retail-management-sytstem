"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { ecommerceApi } from "@/lib/api"

interface HomePageSettings {
  logo_image_url?: string
  logo_text?: string
  hero_badge_text?: string
  hero_heading_line1?: string
  hero_heading_line2?: string
  hero_heading_line3?: string
  hero_heading_line4?: string
  hero_heading_line5?: string
  hero_description?: string
  hero_primary_image_url?: string
  hero_secondary_image_url?: string
  stat_brands?: string
  stat_products?: string
  stat_customers?: string
}

export function HeroSection() {
  const [settings, setSettings] = useState<HomePageSettings>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await ecommerceApi.getHomePageSettings()
        setSettings(data)
      } catch (error) {
        console.error('Failed to fetch home page settings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  if (loading) {
    return <div className="w-full h-96 bg-gray-200 animate-pulse" />
  }

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-secondary via-background to-secondary/50">
      <div className="container px-4 py-12 md:py-20 lg:py-24">
        <div className="relative">
          {/* Large Typography Background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            <h2 className="text-[20vw] font-bold leading-none">STYLE</h2>
          </div>

          {/* Main Content Grid */}
          <div className="relative grid lg:grid-cols-12 gap-8 items-center">
            {/* Left Content - Takes 7 columns on large screens */}
            <div className="lg:col-span-7 z-10">
              <div className="flex flex-col gap-6 max-w-2xl">
                {/* Small Badge */}
                <div className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-full w-fit text-sm font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-background opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-background"></span>
                  </span>
                  {settings.hero_badge_text || "New Collection 2024"}
                </div>

                {/* Main Heading with Creative Layout */}
                <div className="space-y-2">
                  <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9]">
                    <span className="block">{settings.hero_heading_line1 || "FIND"}</span>
                    <span className="block text-muted-foreground/40">
                      {settings.hero_heading_line2 || "CLOTHES"}
                    </span>
                    <span className="block">{settings.hero_heading_line3 || "THAT"}</span>
                    <span className="block italic font-serif">
                      {settings.hero_heading_line4 || "Matches"}
                    </span>
                    <span className="block">{settings.hero_heading_line5 || "YOUR STYLE"}</span>
                  </h1>
                </div>

                <p className="text-base md:text-lg text-muted-foreground max-w-md text-pretty leading-relaxed">
                  {settings.hero_description || "Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style."}
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <Button size="lg" className="rounded-full px-8 h-12 group">
                    Shop Now
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <Button size="lg" variant="outline" className="rounded-full px-8 h-12 bg-transparent">
                    Explore Collections
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Images - Takes 5 columns, overlapping layout */}
            <div className="lg:col-span-5 relative h-[400px] sm:h-[500px] lg:h-[600px]">
              {/* Main Image */}
              <div className="absolute top-0 right-0 w-[70%] h-[75%] rounded-3xl overflow-hidden shadow-2xl border-4 border-background">
                <img
                  src={settings.hero_primary_image_url || "/fashion-models-wearing-modern-streetwear.jpg"}
                  alt="Fashion model"
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.currentTarget.src = "/fashion-models-wearing-modern-streetwear.jpg"
                  }}
                />
              </div>

              {/* Secondary Image - Overlapping */}
              <div className="absolute bottom-0 left-0 w-[60%] h-[50%] rounded-3xl overflow-hidden shadow-2xl border-4 border-background">
                <img 
                  src={settings.hero_secondary_image_url || "/product-model.jpg"} 
                  alt="Fashion style" 
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.currentTarget.src = "/product-model.jpg"
                  }}
                />
              </div>

              {/* Decorative Circle */}
              <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-foreground/5 backdrop-blur-sm border border-foreground/10 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold">2K+</div>
                  <div className="text-xs text-muted-foreground">Styles</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Bar - Creative Positioning */}
          <div className="mt-12 lg:mt-16">
            <div className="flex flex-wrap justify-center lg:justify-start gap-8 lg:gap-12 p-6 rounded-2xl bg-foreground/5 backdrop-blur-sm border border-foreground/10 w-fit mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="text-3xl lg:text-4xl font-bold">{settings.stat_brands || "200+"}</div>
                <div className="text-sm text-muted-foreground mt-1">International Brands</div>
              </div>
              <div className="h-16 w-px bg-border hidden sm:block" />
              <div className="text-center lg:text-left">
                <div className="text-3xl lg:text-4xl font-bold">{settings.stat_products || "2,000+"}</div>
                <div className="text-sm text-muted-foreground mt-1">High-Quality Products</div>
              </div>
              <div className="h-16 w-px bg-border hidden sm:block" />
              <div className="text-center lg:text-left">
                <div className="text-3xl lg:text-4xl font-bold">{settings.stat_customers || "30,000+"}</div>
                <div className="text-sm text-muted-foreground mt-1">Happy Customers</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-20 h-20 rounded-full bg-foreground/5 blur-3xl" />
      <div className="absolute bottom-20 left-10 w-32 h-32 rounded-full bg-foreground/5 blur-3xl" />
    </section>
  )
}
