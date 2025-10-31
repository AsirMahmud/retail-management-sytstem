"use client"

import { useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { ProductGrid } from "@/components/product-grid"
import { CategoryFilters } from "@/components/category-filters"
import { NewsletterSection } from "@/components/newsletter-section"
import { ecommerceApi, EcommerceProduct } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, SlidersHorizontal } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function AllProductsPage() {
  const [products, setProducts] = useState<EcommerceProduct[]>([])
  const [filteredProducts, setFilteredProducts] = useState<EcommerceProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("popular")
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [activeFilters, setActiveFilters] = useState<{
    online_category?: number
    price_min?: number
    price_max?: number
    colors?: string[]
    sizes?: string[]
  }>({})

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await ecommerceApi.getAllProducts({ 
          online_category: selectedCategory || undefined 
        })
        setProducts(data.products)
        setFilteredProducts(data.products)
      } catch (e) {
        console.error('Failed to fetch products', e)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [selectedCategory])

  // Apply search + active filters + sort
  useEffect(() => {
    let filtered = products

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Category filter (defensive; backend may already filter by category)
    if (activeFilters.online_category) {
      filtered = filtered.filter(p => p.online_category_id === activeFilters.online_category)
    }

    // Price range
    if (typeof activeFilters.price_min === 'number') {
      filtered = filtered.filter(p => p.selling_price >= (activeFilters.price_min as number))
    }
    if (typeof activeFilters.price_max === 'number') {
      filtered = filtered.filter(p => p.selling_price <= (activeFilters.price_max as number))
    }

    // Colors
    if (activeFilters.colors && activeFilters.colors.length > 0) {
      filtered = filtered.filter(p => {
        const names = new Set((p.available_colors || []).map(c => (c.name || '').toLowerCase()))
        const variantColors = new Set((p.variants || []).map(v => (v.color || '').toLowerCase()))
        return activeFilters.colors!.some(c => names.has(c.toLowerCase()) || variantColors.has(c.toLowerCase()))
      })
    }

    // Sizes (normalize for matching e.g., "XX-Small" -> "xxs", "3X-Large" -> "3xl")
    const normalizeSize = (val: string) => {
      const raw = (val || '').toLowerCase().trim()
      const directMap: Record<string, string> = {
        'xx-small': 'xxs',
        'x-small': 'xs',
        'small': 's',
        'medium': 'm',
        'large': 'l',
        'x-large': 'xl',
        'xx-large': 'xxl',
        '3x-large': '3xl',
        '4x-large': '4xl',
        // common compact forms
        'xxs': 'xxs',
        'xs': 'xs',
        's': 's',
        'm': 'm',
        'l': 'l',
        'xl': 'xl',
        'xxl': 'xxl',
        'xxxl': '3xl',
        '3xl': '3xl',
        '4xl': '4xl',
      }
      if (directMap[raw]) return directMap[raw]
      const compact = raw.replace(/\s|-/g, '') // remove spaces and hyphens
      if (directMap[compact]) return directMap[compact]
      const match = compact.match(/^(\d+)x?large$/)
      if (match) return `${match[1]}xl`
      const match2 = compact.match(/^(\d+)xl$/)
      if (match2) return `${match2[1]}xl`
      return compact
    }

    if (activeFilters.sizes && activeFilters.sizes.length > 0) {
      const wanted = new Set(activeFilters.sizes.map(s => normalizeSize(s)))
      filtered = filtered.filter(p => {
        const sizeList = new Set((p.available_sizes || []).map(s => normalizeSize(s)))
        const variantSizes = new Set((p.variants || []).map(v => normalizeSize(v.size)))
        // match if any desired size appears in either list
        for (const w of wanted) {
          if (sizeList.has(w) || variantSizes.has(w)) return true
        }
        return false
      })
    }

    // Sort products
    switch (sortBy) {
      case "newest":
        filtered = [...filtered].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        break
      case "price-low":
        filtered = [...filtered].sort((a, b) => a.selling_price - b.selling_price)
        break
      case "price-high":
        filtered = [...filtered].sort((a, b) => b.selling_price - a.selling_price)
        break
      case "name":
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name))
        break
      default: // popular - keep original order
        break
    }

    setFilteredProducts(filtered)
  }, [products, searchTerm, sortBy, activeFilters])

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId)
  }

  const handleFiltersChange = (filters: {
    online_category?: number
    price_min?: number
    price_max?: number
    colors?: string[]
    sizes?: string[]
    dress_styles?: string[]
  }) => {
    // Keep category in sync with left sidebar category selection
    if (typeof filters.online_category !== 'undefined') {
      setSelectedCategory(filters.online_category ?? null)
    }
    setActiveFilters({
      online_category: filters.online_category,
      price_min: filters.price_min,
      price_max: filters.price_max,
      colors: filters.colors,
      sizes: filters.sizes,
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumb items={[
            { label: "Home", href: "/" }, 
            { label: "All Products", href: "/products" }
          ]} />

          {/* Page Header */}
          <div className="mt-6 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">All Products</h1>
            <p className="text-muted-foreground">
              Discover our complete collection of products
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Sort Dropdown */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>

            {/* Mobile Filters */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:w-[400px] overflow-y-auto">
                <CategoryFilters onCategoryChange={handleCategoryChange} onFiltersChange={handleFiltersChange} />
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex gap-6">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <CategoryFilters onCategoryChange={handleCategoryChange} onFiltersChange={handleFiltersChange} />
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading products...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    {searchTerm ? "No products found matching your search." : "No products available."}
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
                  category={`${filteredProducts.length} Products`}
                  products={filteredProducts.map(p => ({
                    id: p.id,
                    name: p.name,
                    price: p.selling_price,
                    rating: 4.5, // Default rating since it's not provided by API
                    image: p.primary_image || p.image_url || p.image || "/placeholder.jpg",
                  }))}
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
