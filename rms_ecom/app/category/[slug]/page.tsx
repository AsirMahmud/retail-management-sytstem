"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter, useParams } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { Breadcrumb } from "@/components/breadcrumb"
import { CategoryFilters } from "@/components/category-filters"
import { ProductGrid } from "@/components/product-grid"
import { NewsletterSection } from "@/components/newsletter-section"
import { SiteFooter } from "@/components/site-footer"
import { ecommerceApi, ProductByColorEntry } from "@/lib/api"
import { sendGTMEvent } from "@/lib/gtm"
import { StructuredData } from "@/components/structured-data"
import { generateBreadcrumbStructuredData } from "@/lib/seo"
import { useLoading } from "@/hooks/useLoading"

export default function CategoryPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const params = useParams<{ slug: string }>()
  const slug = (params?.slug as string) || ""
  const genderParam = searchParams.get("gender")
  const [products, setProducts] = useState<ProductByColorEntry[]>([])
  const { startLoading, stopLoading } = useLoading()
  const [page, setPage] = useState(1)
  const [pageSize] = useState(24)
  const [totalCount, setTotalCount] = useState(0)

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedGender, setSelectedGender] = useState<string | null>(genderParam)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])

  // Use selectedCategory from filter if set, otherwise use URL slug
  const activeCategorySlug = selectedCategory || slug
  // Use selectedGender from filter if set, otherwise use URL param
  const activeGender = selectedGender || genderParam
  const categoryName = activeCategorySlug.charAt(0).toUpperCase() + activeCategorySlug.slice(1)

  useEffect(() => {
    const fetchCategoryData = async () => {
      startLoading()
      try {
        // Fetch products for this category with all filters
        // Use activeCategorySlug which can be from filter (child category) or URL (parent category)
        const resp = await ecommerceApi.getProductsByColorPaginated({
          online_category: activeCategorySlug,
          gender: activeGender as "men" | "women" | "MALE" | "FEMALE" | "UNISEX" | undefined,
          colors: selectedColor ? [selectedColor] : undefined,
          sizes: selectedSize ? [selectedSize] : undefined,
          price_min: priceRange[0] > 0 ? priceRange[0] : undefined,
          price_max: priceRange[1] < 1000 ? priceRange[1] : undefined,
          page,
          page_size: pageSize,
        })
        setProducts(resp.results)
        setTotalCount(resp.count)
      } catch (error) {
        console.error('Failed to fetch category data:', error)
      } finally {
        stopLoading()
      }
    }

    fetchCategoryData()
  }, [activeCategorySlug, activeGender, selectedColor, selectedSize, priceRange, page, pageSize, startLoading, stopLoading])

  // GTM View Item List
  useEffect(() => {
    if (products.length > 0) {
      sendGTMEvent('view_item_list', {
        currency: 'BDT',
        items: products.map((p, index) => ({
          item_id: `${p.product_id}`,
          item_name: p.product_name,
          price: parseFloat(p.product_price),
          item_list_name: categoryName,
          index: index + 1,
          quantity: 1,
          item_variant: p.color_name
        }))
      })
    }
  }, [products, categoryName])

  const handleCategoryChange = (categorySlug: string | null) => {
    setSelectedCategory(categorySlug)
    setPage(1) // Reset to first page when category changes
  }

  const handleGenderChange = (gender: string | null) => {
    setSelectedGender(gender)
    setPage(1) // Reset to first page when gender changes
    // Update URL with gender parameter
    if (gender) {
      router.push(`/category/${slug}?gender=${gender}`, { scroll: false })
    } else {
      router.push(`/category/${slug}`, { scroll: false })
    }
  }

  const handleApplyFilters = () => {
    // Reset to first page when filters are applied
    setPage(1)
    // The useEffect will automatically refetch with new filters
  }

  // Reset selected category when URL slug changes (user navigated to different category page)
  useEffect(() => {
    setSelectedCategory(null)
  }, [slug])

  // Sync URL gender param with state
  useEffect(() => {
    setSelectedGender(genderParam)
  }, [genderParam])

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: categoryName, href: `/category/${activeCategorySlug}` },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <StructuredData data={generateBreadcrumbStructuredData(breadcrumbItems)} />
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumb
            items={breadcrumbItems}
          />

          <div className="flex gap-6 mt-6">
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <CategoryFilters
                selectedCategory={selectedCategory}
                selectedColor={selectedColor}
                selectedSize={selectedSize}
                selectedGender={selectedGender}
                priceRange={priceRange}
                onCategoryChange={handleCategoryChange}
                onColorChange={setSelectedColor}
                onSizeChange={setSelectedSize}
                onGenderChange={handleGenderChange}
                onPriceChange={setPriceRange}
                onApplyFilters={handleApplyFilters}
              />
            </aside>

            <div className="flex-1">
              <ProductGrid
                category={categoryName}
                products={products.map(product => ({
                  id: `${product.product_id}/${product.color_slug}`,
                  name: `${product.product_name} - ${product.color_name}`,
                  price: parseFloat(product.product_price),
                  rating: 4.5,
                  image: product.cover_image_url || "/placeholder.jpg",
                }))}
              />
            </div>
          </div>
        </div>
        <NewsletterSection />
      </main>
      <SiteFooter />
    </div>
  )
}
