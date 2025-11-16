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
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("popular")
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null)
  const [selectedGender, setSelectedGender] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(24)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const res = await ecommerceApi.getProductsByColorPaginated({
          page,
          page_size: pageSize,
          search: searchTerm || undefined,
          sort: sortBy === 'price-low' ? 'price_asc' : sortBy === 'price-high' ? 'price_desc' : sortBy === 'name' ? 'name' : undefined,
          online_category: selectedCategorySlug || undefined,
          gender: selectedGender as 'men' | 'women' | 'unisex' | 'MALE' | 'FEMALE' | 'UNISEX' | undefined,
        })
        setProducts(res.results)
        setTotalCount(res.count)
      } catch (e) {
        console.error('Failed to fetch products', e)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [page, pageSize, searchTerm, sortBy, selectedCategorySlug, selectedGender])

  // Reset to first page on key changes
  useEffect(() => {
    setPage(1)
  }, [searchTerm, sortBy, selectedCategorySlug, selectedGender])

  const handleCategoryChange = (categorySlug: string | null) => {
    setSelectedCategorySlug(categorySlug)
  }

  const handleGenderChange = (gender: string | null) => {
    setSelectedGender(gender)
  }

  const handleApplyFilters = () => {
    setPage(1)
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
                <CategoryFilters 
                  onCategoryChange={handleCategoryChange}
                  onGenderChange={handleGenderChange}
                  selectedGender={selectedGender}
                  onApplyFilters={handleApplyFilters}
                />
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex gap-6">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <CategoryFilters 
                onCategoryChange={handleCategoryChange}
                onGenderChange={handleGenderChange}
                selectedGender={selectedGender}
                onApplyFilters={handleApplyFilters}
              />
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading products...</p>
                </div>
              ) : products.length === 0 ? (
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
                  category={`All Products`}
                  products={products.map(item => ({
                    id: `${item.product_id}/${item.color_slug}`,
                    name: `${item.product_name} - ${item.color_name}`,
                    price: Number(item.product_price),
                    rating: 4.5,
                    image: item.cover_image_url || "/placeholder.jpg",
                  }))}
                  totalCount={totalCount}
                  page={page}
                  pageSize={pageSize}
                  onPageChange={setPage}
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
