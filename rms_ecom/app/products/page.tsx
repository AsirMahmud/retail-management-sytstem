"use client"

import { useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { ProductGrid } from "@/components/product-grid"
import { CategoryFilters } from "@/components/category-filters"
import { NewsletterSection } from "@/components/newsletter-section"
import { ecommerceApi, EcommerceProduct, ProductByColorEntry } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, SlidersHorizontal } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function AllProductsPage() {
  const [products, setProducts] = useState<ProductByColorEntry[]>([])
  const [filteredProducts, setFilteredProducts] = useState<ProductByColorEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("popular")
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [activeFilters, setActiveFilters] = useState<{
    colors?: string[]
  }>({})

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Use public per-color endpoint
        const data = await ecommerceApi.getProductsByColor({})
        setProducts(data)
        setFilteredProducts(data)
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
      filtered = filtered.filter(item =>
        item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.color_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Category filter (defensive; backend may already filter by category)
    // Not applicable directly for public endpoint; skipping online_category filter client-side

    // Price range
    // Price filtering is not directly available; skipping here (could be added server-side)

    // Colors
    if (activeFilters.colors && activeFilters.colors.length > 0) {
      const wanted = new Set(activeFilters.colors.map(c => c.toLowerCase()))
      filtered = filtered.filter(p => wanted.has(p.color_name.toLowerCase()))
    }

    // Size filtering skipped for per-color list

    // Sort products
    switch (sortBy) {
      case "newest":
        // No created_at in flat list; keep order
        break
      case "price-low":
        filtered = [...filtered].sort((a, b) => Number(a.product_price) - Number(b.product_price))
        break
      case "price-high":
        filtered = [...filtered].sort((a, b) => Number(b.product_price) - Number(a.product_price))
        break
      case "name":
        filtered = [...filtered].sort((a, b) => a.product_name.localeCompare(b.product_name))
        break
      default: // popular - keep original order
        break
    }

    setFilteredProducts(filtered)
  }, [products, searchTerm, sortBy, activeFilters])

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId)
  }

  // Filters UI is local-only in CategoryFilters; we only honor category here

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
                <CategoryFilters onCategoryChange={handleCategoryChange} />
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex gap-6">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <CategoryFilters onCategoryChange={handleCategoryChange} />
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
                  products={filteredProducts.map(item => ({
                    id: `${item.product_id}/${item.color_slug}`,
                    name: `${item.product_name} - ${item.color_name}`,
                    price: Number(item.product_price),
                    rating: 4.5,
                    image: item.cover_image_url || "/placeholder.jpg",
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
