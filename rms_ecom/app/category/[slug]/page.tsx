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
import { sendGTMEvent, normalizeProductId } from "@/lib/gtm"
import { StructuredData } from "@/components/structured-data"
import { generateBreadcrumbStructuredData } from "@/lib/seo"
import { useLoading } from "@/hooks/useLoading"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, SlidersHorizontal } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ActiveFilters } from "@/components/active-filters"

export default function CategoryPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const params = useParams<{ slug: string }>()
  const slug = (params?.slug as string) || ""
  const genderParam = searchParams.get("gender")

  const [products, setProducts] = useState<ProductByColorEntry[]>([])
  const { isLoading, startLoading, stopLoading } = useLoading()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("popular")
  const [page, setPage] = useState(1)
  const [pageSize] = useState(24)
  const [totalCount, setTotalCount] = useState(0)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedGender, setSelectedGender] = useState<string | null>(genderParam)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])

  // Use selectedCategory from filter if set, otherwise use URL slug
  const activeCategorySlug = selectedCategory || slug
  // Use selectedGender from filter if set, otherwise use URL param
  const activeGender = selectedGender || genderParam

  const formatSlug = (s: string) => s.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  const categoryName = formatSlug(activeCategorySlug)

  useEffect(() => {
    const fetchCategoryData = async () => {
      startLoading()
      try {
        const resp = await ecommerceApi.getProductsByColorPaginated({
          online_category: activeCategorySlug,
          gender: activeGender as "men" | "women" | "MALE" | "FEMALE" | "UNISEX" | undefined,
          search: searchTerm || undefined,
          sort: (sortBy === 'price-low' ? 'price_asc' : sortBy === 'price-high' ? 'price_desc' : sortBy === 'name' ? 'name' : undefined) as any,
          colors: selectedColor ? [selectedColor] : undefined,
          sizes: selectedSize ? [selectedSize] : undefined,
          price_min: priceRange[0],
          price_max: priceRange[1],
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
  }, [activeCategorySlug, activeGender, selectedColor, selectedSize, priceRange, page, pageSize, searchTerm, sortBy, startLoading, stopLoading])

  // Reset to first page on key changes
  useEffect(() => {
    setPage(1)
  }, [searchTerm, sortBy, activeCategorySlug, activeGender, selectedColor, selectedSize, priceRange])

  // GTM View Item List
  useEffect(() => {
    if (products.length > 0) {
      sendGTMEvent('view_item_list', {
        currency: 'BDT',
        items: products.map((p, index) => ({
          item_id: normalizeProductId(`${p.product_id}/${p.color_slug}`),
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
  }

  const handleGenderChange = (gender: string | null) => {
    setSelectedGender(gender)
    if (gender) {
      router.push(`/category/${slug}?gender=${gender}`, { scroll: false })
    } else {
      router.push(`/category/${slug}`, { scroll: false })
    }
  }

  const handleResetFilters = () => {
    setSelectedCategory(null)
    setSelectedGender(null)
    setSelectedColor(null)
    setSelectedSize(null)
    setPriceRange([0, 10000])
  }

  // Sync URL slug and gender param
  useEffect(() => {
    setSelectedCategory(null)
  }, [slug])

  useEffect(() => {
    setSelectedGender(genderParam)
  }, [genderParam])

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: categoryName, href: `/category/${activeCategorySlug}` },
  ]

  const activeFiltersCount = [
    selectedCategory,
    selectedGender,
    selectedColor,
    selectedSize,
    (priceRange[0] > 0 || priceRange[1] < 10000)
  ].filter(Boolean).length

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FBFC]">
      <StructuredData data={generateBreadcrumbStructuredData(breadcrumbItems)} />
      <SiteHeader />
      <main className="flex-1 pb-20">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumb items={breadcrumbItems} />

          {/* Page Header */}
          <div className="mt-8 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight mb-2 uppercase">SHOP {categoryName}</h1>
              <p className="text-muted-foreground font-medium">
                {totalCount} premium products found
              </p>
            </div>
          </div>

          {/* Search and Sort Toolbar */}
          <div className="sticky top-16 z-40 bg-background/80 backdrop-blur-md -mx-4 px-4 py-4 md:static md:bg-transparent md:backdrop-blur-none mb-8 border-b md:border-none">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative w-full sm:flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search in this category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 bg-white border-none shadow-sm rounded-xl focus-visible:ring-primary"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="flex-1 sm:w-[200px] h-12 bg-background border border-border shadow-sm rounded-xl font-bold uppercase text-[10px] tracking-widest px-6">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground font-medium">SORT:</span>
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-none shadow-xl">
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                  </SelectContent>
                </Select>

                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden h-12 px-6 bg-white border-none shadow-sm rounded-xl font-bold uppercase text-[10px] tracking-widest relative">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filter
                      {activeFiltersCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px]">
                          {activeFiltersCount}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-full sm:w-[450px] overflow-y-auto p-6">
                    <CategoryFilters
                      onCategoryChange={handleCategoryChange}
                      onGenderChange={handleGenderChange}
                      onColorChange={setSelectedColor}
                      onSizeChange={setSelectedSize}
                      onPriceChange={setPriceRange}
                      onResetFilters={handleResetFilters}
                      selectedCategory={selectedCategory}
                      selectedGender={selectedGender}
                      selectedColor={selectedColor}
                      selectedSize={selectedSize}
                      priceRange={priceRange}
                      onClose={() => setIsFilterOpen(false)}
                    />
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-28 border rounded-2xl p-8 bg-white shadow-sm max-h-[calc(100vh-140px)] overflow-y-auto scrollbar-hide">
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
                  onResetFilters={handleResetFilters}
                />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <ActiveFilters
                selectedCategory={selectedCategory}
                selectedGender={selectedGender}
                selectedColor={selectedColor}
                selectedSize={selectedSize}
                priceRange={priceRange}
                onRemoveFilter={(type) => {
                  if (type === 'category') setSelectedCategory(null)
                  if (type === 'gender') setSelectedGender(null)
                  if (type === 'color') setSelectedColor(null)
                  if (type === 'size') setSelectedSize(null)
                  if (type === 'price') setPriceRange([0, 10000])
                }}
                onClearAll={handleResetFilters}
              />
              {isLoading ? (
                <ProductGrid
                  category={categoryName}
                  products={[]}
                  totalCount={0}
                  page={page}
                  pageSize={pageSize}
                  onPageChange={setPage}
                  isLoading={true}
                />
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    {searchTerm ? "No products found matching your search." : "No products available in this category."}
                  </p>
                  {searchTerm && (
                    <Button
                      variant="outline"
                      onClick={() => setSearchTerm("")}
                      className="mt-4"
                    >
                      Clear Search
                    </Button>
                  )}
                </div>
              ) : (
                <ProductGrid
                  category={categoryName}
                  products={products.map(item => ({
                    id: `${item.product_id}/${item.color_slug}`,
                    name: `${item.product_name} - ${item.color_name}`,
                    price: Number(item.product_price),
                    rating: 4.5,
                    image: item.cover_image_url || "/placeholder.jpg",
                    discountInfo: item.discount_info,
                  }))}
                  totalCount={totalCount}
                  page={page}
                  pageSize={pageSize}
                  onPageChange={setPage}
                  isLoading={false}
                />
              )}
            </div>
          </div>
        </div>
        <NewsletterSection />
      </main>
      <SiteFooter />
    </div>
  )
}
