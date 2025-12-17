"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { ecommerceApi } from "@/lib/api"
import Image from "next/image"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { HeroSlide } from "./hero-slide"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

// Helper to ensure image URLs are absolute
const getAbsoluteImageUrl = (url: string | null | undefined, fallback: string = "/fashion-models-wearing-modern-streetwear.jpg"): string => {
  if (!url) return fallback

  // If already absolute URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  // If relative URL starting with /media/, make it absolute
  if (url.startsWith('/media/')) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000'
    return `${baseUrl}${url}`
  }

  // For other relative paths, assume they're in /media/
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000'
  return `${baseUrl}/media/${url.startsWith('/') ? url.slice(1) : url}`
}

interface HomePageSettings {
  logo_image_url?: string
  logo_text?: string
  footer_tagline?: string
  footer_address?: string
  footer_phone?: string
  footer_email?: string
  footer_facebook_url?: string
  footer_instagram_url?: string
  footer_twitter_url?: string
  footer_github_url?: string
  footer_map_embed_url?: string
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
  const [heroSlides, setHeroSlides] = useState<any[]>([])
  const [onlineCategories, setOnlineCategories] = useState<Array<{ id: number; name: string; slug: string; parent: number | null; parent_name?: string; children_count?: number }>>([])
  const [loadingCategories, setLoadingCategories] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsData, slidesData] = await Promise.all([
          ecommerceApi.getHomePageSettings(),
          ecommerceApi.getHeroSlides().catch(() => []) // Handle error gracefully
        ])
        setSettings(settingsData)
        // Filter active slides and sort by display_order
        const activeSlides = slidesData
          .filter((s: any) => s.is_active)
          .sort((a: any, b: any) => a.display_order - b.display_order)
        setHeroSlides(activeSlides)
      } catch (error) {
        console.error('Failed to fetch home page data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true)
      try {
        const allCategories = await ecommerceApi.getOnlineCategories()
        setOnlineCategories(allCategories)
      } catch (error) {
        console.error('Failed to fetch categories:', error)
        setOnlineCategories([])
      } finally {
        setLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [])

  // Organize categories into hierarchical structure
  const organizedCategories = onlineCategories
    .filter(cat => !cat.parent) // Get only root categories
    .map(category => {
      const children = onlineCategories.filter(c => c.parent === category.id)
      return {
        ...category,
        children
      }
    })

  if (loading) {
    return <div className="w-full h-96 bg-gray-200 animate-pulse" />
  }

  // Render Dynamic Hero Slides if available
  if (heroSlides.length > 0) {
    return (
      <section className="relative w-full overflow-hidden">
        <Carousel
          className="w-full"
          opts={{ loop: true }}
          plugins={[
            Autoplay({
              delay: 5000,
              stopOnInteraction: false,
              stopOnMouseEnter: true,
            }),
          ]}
        >
          <CarouselContent>
            {heroSlides.map((slide) => (
              <CarouselItem key={slide.id} className="pl-0">
                <HeroSlide slide={slide} />
              </CarouselItem>
            ))}
          </CarouselContent>
          {heroSlides.length > 1 && (
            <>
              <CarouselPrevious className="left-4 z-20 bg-white/20 hover:bg-white/40 border-none text-white hidden sm:flex" />
              <CarouselNext className="right-4 z-20 bg-white/20 hover:bg-white/40 border-none text-white hidden sm:flex" />
            </>
          )}
        </Carousel>
      </section>
    )
  }

  // Fallback to Static Settings based layout
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
                  <Link href="/products">
                    <Button size="lg" className="rounded-full px-8 h-12 group">
                      Shop Now
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="lg" variant="outline" className="rounded-full px-8 h-12 bg-transparent">
                        Explore Collections
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      {loadingCategories ? (
                        <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
                      ) : organizedCategories.length === 0 ? (
                        <DropdownMenuItem disabled>No categories available</DropdownMenuItem>
                      ) : (
                        organizedCategories.map((category) => {
                          const hasChildren = category.children && category.children.length > 0

                          if (hasChildren) {
                            return (
                              <DropdownMenuSub key={category.id}>
                                <DropdownMenuSubTrigger>
                                  {category.name}
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent className="w-48">
                                  {/* Parent category link */}
                                  <DropdownMenuItem asChild>
                                    <Link href={`/category/${category.slug}`} className="font-medium">
                                      All {category.name}
                                    </Link>
                                  </DropdownMenuItem>
                                  {category.children.length > 0 && (
                                    <>
                                      <DropdownMenuSeparator />
                                      {/* Subcategories */}
                                      {category.children.map((child) => (
                                        <DropdownMenuItem key={child.id} asChild>
                                          <Link href={`/category/${child.slug}`}>{child.name}</Link>
                                        </DropdownMenuItem>
                                      ))}
                                    </>
                                  )}
                                </DropdownMenuSubContent>
                              </DropdownMenuSub>
                            )
                          } else {
                            return (
                              <DropdownMenuItem key={category.id} asChild>
                                <Link href={`/category/${category.slug}`}>{category.name}</Link>
                              </DropdownMenuItem>
                            )
                          }
                        })
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Right Images - Takes 5 columns, overlapping layout */}
            <div className="lg:col-span-5 relative h-[400px] sm:h-[500px] lg:h-[600px]">
              {/* Main Image */}
              <div className="absolute top-0 right-0 w-[70%] h-[75%] rounded-3xl overflow-hidden shadow-2xl border-4 border-background">
                <Image
                  src={getAbsoluteImageUrl(settings.hero_primary_image_url)}
                  alt="Fashion model"
                  fill
                  sizes="(max-width: 768px) 70vw, 40vw"
                  className="object-cover w-full h-full"
                  unoptimized
                />
              </div>

              {/* Secondary Image - Overlapping */}
              <div className="absolute bottom-0 left-0 w-[60%] h-[50%] rounded-3xl overflow-hidden shadow-2xl border-4 border-background">
                <Image
                  src={getAbsoluteImageUrl(settings.hero_secondary_image_url, "/product-model.jpg")}
                  alt="Fashion style"
                  fill
                  sizes="(max-width: 768px) 60vw, 30vw"
                  className="object-cover w-full h-full"
                  unoptimized
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
