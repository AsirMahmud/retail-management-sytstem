"use client"

import { useEffect, useState } from "react"
import { ecommerceApi } from "@/lib/api"
import Image from "next/image"

interface Brand {
  id: number
  name: string
  logo_image?: string
  logo_image_url?: string
  logo_text?: string
  website_url?: string
}

export function BrandShowcase() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await ecommerceApi.getBrands()
        setBrands(data)
      } catch (error) {
        console.error('Failed to fetch brands:', error)
        // Fallback to default brands
        setBrands([
          { id: 1, name: "VERSACE", logo_text: "VERSACE" },
          { id: 2, name: "ZARA", logo_text: "ZARA" },
          { id: 3, name: "GUCCI", logo_text: "GUCCI" },
          { id: 4, name: "PRADA", logo_text: "PRADA" },
          { id: 5, name: "Calvin Klein", logo_text: "Calvin Klein" },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchBrands()
  }, [])

  if (loading) {
    return (
      <section className="w-full bg-primary py-8">
        <div className="container px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
            <div className="h-8 w-32 bg-white/20 animate-pulse rounded" />
            <div className="h-8 w-32 bg-white/20 animate-pulse rounded" />
            <div className="h-8 w-32 bg-white/20 animate-pulse rounded" />
          </div>
        </div>
      </section>
    )
  }

  if (brands.length === 0) {
    return null
  }

  return (
    <section className="w-full bg-primary py-8">
      <div className="container px-4">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
          {brands.map((brand) => (
            <div key={brand.id} className="text-2xl md:text-3xl font-bold text-primary-foreground tracking-wider">
              {brand.logo_image_url ? (
                <Image 
                  src={brand.logo_image_url} 
                  alt={brand.name}
                  width={160}
                  height={48}
                  className="h-8 md:h-12 w-auto object-contain"
                />
              ) : (
                brand.logo_text || brand.name
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
