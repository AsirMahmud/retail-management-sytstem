"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Search, ShoppingCart, User, Menu, ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { useCartStore } from "@/hooks/useCartStore"
import { ecommerceApi, type ProductByColorEntry } from "@/lib/api"
import { cn } from "@/lib/utils"
import { useGlobalDiscount } from "@/lib/useGlobalDiscount"
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"
import {
  Home,
  Package,
  Heart,
  Settings,
  LogOut,
  ChevronDown,
  ArrowRight,
  TrendingUp,
  Award,
  Zap
} from "lucide-react"

export function SiteHeader() {
  const [onlineCategories, setOnlineCategories] = useState<
    Array<{ id: number; name: string; slug: string; parent: number | null; parent_name?: string; children_count?: number }>
  >([])
  const [loadingCategories, setLoadingCategories] = useState(false)
  const totalItems = useCartStore((s) => s.totalItems)
  const [branding, setBranding] = useState<{ logo_image_url?: string; logo_text?: string }>({})
  const globalDiscountValue = useGlobalDiscount((state) => state.discount?.value || 0)

  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<ProductByColorEntry[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const router = useRouter()
  const [shouldAnimateCart, setShouldAnimateCart] = useState(false)
  const prevTotalItems = useRef(totalItems)

  // Fetch online categories for desktop navigation
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true)
      try {
        const allCategories = await ecommerceApi.getOnlineCategories()
        setOnlineCategories(allCategories)
      } catch (error) {
        console.error("Failed to fetch categories:", error)
        setOnlineCategories([])
      } finally {
        setLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const data = await ecommerceApi.getHomePageSettings()
        setBranding({
          logo_image_url: data.logo_image_url,
          logo_text: data.logo_text,
        })
      } catch (error) {
        console.error("Failed to fetch branding:", error)
      }
    }

    fetchBranding()
  }, [])

  // Organize categories into hierarchical structure
  const organizedCategories = onlineCategories
    .filter((cat) => !cat.parent) // Get only root categories
    .map((category) => {
      const children = onlineCategories.filter((c) => c.parent === category.id)
      return {
        ...category,
        children,
      }
    })

  // Clean up debounce timer
  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current)
      }
    }
  }, [])

  // Animate cart icon when totalItems increases
  useEffect(() => {
    if (totalItems > prevTotalItems.current) {
      setShouldAnimateCart(true)
      const timer = setTimeout(() => setShouldAnimateCart(false), 500)
      return () => clearTimeout(timer)
    }
    prevTotalItems.current = totalItems
  }, [totalItems])

  const handleOpenSearch = () => {
    setIsSearchOpen(true)
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)

    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current)
    }

    const trimmed = value.trim()

    if (!trimmed || trimmed.length < 2) {
      setSearchResults([])
      setSearchLoading(false)
      return
    }

    searchDebounceRef.current = setTimeout(async () => {
      setSearchLoading(true)
      try {
        const resp = await ecommerceApi.getProductsByColorPaginated({
          search: trimmed,
          page: 1,
          page_size: 8,
          only_in_stock: true,
        })
        setSearchResults(resp.results || [])
      } catch (error) {
        console.error("Failed to search products:", error)
        setSearchResults([])
      } finally {
        setSearchLoading(false)
      }
    }, 300)
  }

  const handleSelectProduct = (entry: ProductByColorEntry) => {
    setIsSearchOpen(false)
    setSearchQuery("")
    setSearchResults([])
    router.push(`/product/${entry.product_id}/${entry.color_slug}`)
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0" aria-label="Go to home">
            {branding.logo_image_url ? (
              <span className="relative h-8 w-24 sm:h-10 sm:w-32">
                <Image
                  src={branding.logo_image_url}
                  alt={branding.logo_text || "Shop logo"}
                  fill
                  className="object-contain"
                  sizes="128px"
                  priority
                />
              </span>
            ) : (
              <span className="text-xl sm:text-2xl font-bold tracking-tight">{branding.logo_text || "SHOP.CO"}</span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <Link href="/products" className={cn(navigationMenuTriggerStyle(), "bg-transparent hover:bg-secondary/50 transition-colors")}>
              All Products
            </Link>

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-secondary/30 hover:bg-secondary/60 transition-colors border border-transparent hover:border-border px-5 h-10 rounded-full font-bold uppercase text-[10px] tracking-widest">
                    Categories
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[600px] gap-3 p-6 md:grid-cols-2 lg:grid-cols-3">
                      {loadingCategories ? (
                        <div className="flex items-center justify-center p-4 col-span-full">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        </div>
                      ) : organizedCategories.length === 0 ? (
                        <div className="p-4 text-sm text-muted-foreground col-span-full">
                          No categories available
                        </div>
                      ) : (
                        organizedCategories.map((category) => (
                          <div key={category.id} className="space-y-3">
                            <Link
                              href={`/category/${category.slug}`}
                              className="group block space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                            >
                              <div className="text-sm font-semibold leading-none flex items-center justify-between">
                                {category.name}
                                <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                              </div>
                              <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                                Explore our collection of {category.name.toLowerCase()}
                              </p>
                            </Link>
                            {category.children && category.children.length > 0 && (
                              <ul className="grid gap-1 px-3">
                                {category.children.slice(0, 4).map((child: any) => (
                                  <li key={child.id}>
                                    <NavigationMenuLink asChild>
                                      <Link
                                        href={`/category/${child.slug}`}
                                        className="block select-none rounded-md py-1.5 text-xs font-medium leading-none text-muted-foreground no-underline outline-none transition-colors hover:text-foreground"
                                      >
                                        {child.name}
                                      </Link>
                                    </NavigationMenuLink>
                                  </li>
                                ))}
                                {category.children.length > 4 && (
                                  <li>
                                    <Link
                                      href={`/category/${category.slug}`}
                                      className="text-[10px] font-bold text-primary uppercase tracking-wider hover:underline"
                                    >
                                      View All +
                                    </Link>
                                  </li>
                                )}
                              </ul>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-secondary/50 transition-colors px-4">More</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-linear-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href="/unisex"
                          >
                            <TrendingUp className="h-6 w-6 mb-2 text-primary" />
                            <div className="mb-2 mt-4 text-lg font-bold">
                              Unisex Collection
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Modern styles for everyone. Discover our versatile unisex pieces.
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/new-arrivals"
                          className="group block space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          <div className="text-sm font-semibold leading-none flex items-center gap-2">
                            <Zap className="h-4 w-4 text-yellow-500" /> New Arrivals
                          </div>
                          <p className="text-xs text-muted-foreground">Latest items added to our store.</p>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/best-sellers"
                          className="group block space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          <div className="text-sm font-semibold leading-none flex items-center gap-2">
                            <Award className="h-4 w-4 text-blue-500" /> Best Sellers
                          </div>
                          <p className="text-xs text-muted-foreground">Our most popular products.</p>
                        </Link>
                      </NavigationMenuLink>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link href="/women" className={cn(navigationMenuTriggerStyle(), "bg-transparent hover:bg-secondary/50 transition-colors")}>
              Women
            </Link>
            <Link href="/men" className={cn(navigationMenuTriggerStyle(), "bg-transparent hover:bg-secondary/50 transition-colors")}>
              Men
            </Link>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <button
              type="button"
              className="relative w-full text-left"
              onClick={handleOpenSearch}
              aria-label="Open product search"
            >
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for products..."
                className="w-full pl-10 cursor-pointer"
                readOnly
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-4 flex-shrink-0">
            {/* Search Button - Mobile only */}
            <Button variant="ghost" size="icon" className="md:hidden h-9 w-9" onClick={handleOpenSearch}>
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className={cn("relative transition-transform duration-300 h-9 w-9 sm:h-10 sm:w-10", shouldAnimateCart && "scale-125 text-primary")}>
                <ShoppingCart className={cn("h-4 w-4 sm:h-5 sm:w-5", shouldAnimateCart && "animate-bounce")} />
                {totalItems > 0 && (
                  <span className={cn(
                    "absolute -top-1 -right-1 min-w-4 h-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center px-1 transition-all duration-300",
                    shouldAnimateCart && "scale-125"
                  )}>
                    {totalItems}
                  </span>
                )}
                <span className="sr-only">Shopping cart</span>
              </Button>
            </Link>

            {/* Mobile Menu */}
            <MobileNavigationSheet />
          </div>
        </div>
      </header>

      <CommandDialog
        open={isSearchOpen}
        onOpenChange={(open) => {
          setIsSearchOpen(open)
          if (!open) {
            setSearchQuery("")
            setSearchResults([])
          }
        }}
        title="Search products"
        description="Search for products by name"
      >
        <CommandInput
          autoFocus
          placeholder="Search for products..."
          value={searchQuery}
          onValueChange={handleSearchChange}
        />
        <CommandList>
          {searchLoading && <CommandEmpty>Searching products...</CommandEmpty>}
          {!searchLoading && searchQuery.trim().length >= 2 && searchResults.length === 0 && (
            <CommandEmpty>No products found.</CommandEmpty>
          )}
          {!searchLoading && searchResults.length > 0 && (
            <CommandGroup heading="Products">
              {searchResults.map((product) => (
                <CommandItem
                  key={`${product.product_id}-${product.color_slug}`}
                  value={`${product.product_name} ${product.color_name}`}
                  onSelect={() => handleSelectProduct(product)}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="relative h-12 w-12 overflow-hidden rounded-md bg-muted flex-shrink-0">
                      <Image
                        src={product.cover_image_url || "/placeholder.jpg"}
                        alt={product.product_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="truncate font-medium">
                        {product.product_name} - {product.color_name}
                      </span>
                      <div className="flex items-center gap-2">
                        {globalDiscountValue > 0 ? (
                          <>
                            <span className="text-xs font-semibold">
                              ৳{Math.round(Number.parseFloat(product.product_price) * (1 - globalDiscountValue / 100)).toFixed(0)}
                            </span>
                            <span className="text-xs text-muted-foreground line-through">
                              ৳{Number.parseFloat(product.product_price).toFixed(0)}
                            </span>
                          </>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            ৳{Number.parseFloat(product.product_price).toFixed(0)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}

function MobileNavigationSheet() {
  const [selectedGender, setSelectedGender] = useState<"men" | "women" | null>(null)
  const [onlineCategories, setOnlineCategories] = useState<Array<{ id: number; name: string; slug: string; parent: number | null; parent_name?: string; children_count?: number }>>([])
  const [loading, setLoading] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set())

  useEffect(() => {
    const fetchCategories = async () => {
      if (!selectedGender) {
        setOnlineCategories([])
        return
      }

      setLoading(true)
      try {
        // Fetch ALL categories - categories are independent of gender
        // Gender filtering will be applied when products are fetched
        const allCategories = await ecommerceApi.getOnlineCategories()
        setOnlineCategories(allCategories)
      } catch (error) {
        console.error('Failed to fetch categories:', error)
        setOnlineCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [selectedGender])

  // Organize categories into hierarchical structure
  // Categories are independent of gender - show all with proper parent-child hierarchy
  const organizedCategories = onlineCategories
    .filter(cat => !cat.parent) // Show only root categories (those without parent)
    .map(category => ({
      ...category,
      children: onlineCategories.filter(c => c.parent === category.id)
    }))

  const toggleCategoryExpand = (categoryId: number) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId)
      } else {
        newSet.add(categoryId)
      }
      return newSet
    })
  }

  const handleBackToGender = () => {
    setSelectedGender(null)
    setExpandedCategories(new Set())
  }

  return (
    <Sheet>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
          <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-sm overflow-y-auto">
        {selectedGender ? (
          // Categories View
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6 sticky top-0 bg-background/95 backdrop-blur-sm z-10 pb-4 border-b">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBackToGender}
                className="h-10 w-10 rounded-full hover:bg-secondary"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <div>
                <h2 className="text-xl font-bold capitalize leading-tight">{selectedGender}</h2>
                <p className="text-xs text-muted-foreground font-medium">Browse Categories</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <div className="text-sm font-medium text-muted-foreground">Loading categories...</div>
                </div>
              ) : organizedCategories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Package className="h-12 w-12 text-muted mb-4" />
                  <p className="text-base font-semibold mb-1">No categories found</p>
                  <p className="text-sm text-muted-foreground mb-6">We couldn't find any categories for this section.</p>
                  <Button variant="outline" size="sm" onClick={handleBackToGender} className="rounded-full">
                    Go Back
                  </Button>
                </div>
              ) : (
                <nav className="flex flex-col gap-2">
                  {organizedCategories.map((category) => {
                    const hasChildren = category.children && category.children.length > 0
                    const isExpanded = expandedCategories.has(category.id)

                    return (
                      <div key={category.id} className="group">
                        {/* Parent Category */}
                        <div className={cn(
                          "flex items-center gap-1 rounded-xl transition-all duration-200",
                          isExpanded ? "bg-secondary/50" : "hover:bg-secondary/30"
                        )}>
                          <Link
                            href={`/category/${category.slug}${selectedGender ? `?gender=${selectedGender}` : ''}`}
                            className="flex-1 flex items-center gap-3 text-lg font-semibold py-3.5 px-4"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                            {category.name}
                          </Link>
                          {hasChildren && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleCategoryExpand(category.id)}
                              className="h-12 w-12 flex-shrink-0"
                            >
                              <ChevronDown
                                className={cn(
                                  "h-5 w-5 transition-transform duration-300 text-muted-foreground",
                                  isExpanded && "rotate-180 text-foreground"
                                )}
                              />
                            </Button>
                          )}
                        </div>

                        {/* Subcategories */}
                        {hasChildren && isExpanded && (
                          <div className="ml-8 mt-1 mb-2 space-y-1 border-base/10">
                            {category.children.map((child) => (
                              <Link
                                key={child.id}
                                href={`/category/${child.slug}${selectedGender ? `?gender=${selectedGender}` : ''}`}
                                className="flex items-center gap-3 text-[15px] font-medium py-3 px-4 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground"
                              >
                                <ArrowRight className="h-3.5 w-3.5" />
                                {child.name}
                              </Link>
                            ))}
                            <Link
                              href={`/category/${category.slug}${selectedGender ? `?gender=${selectedGender}` : ''}`}
                              className="flex items-center gap-2 text-xs font-bold py-2.5 px-4 text-primary uppercase tracking-widest hover:underline"
                            >
                              View All {category.name}
                            </Link>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </nav>
              )}
            </div>
          </div>
        ) : (
          // Main Navigation View
          <div className="flex flex-col h-full pb-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black tracking-tighter">EXPLORE</h2>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <Link href="/products" className="flex flex-col items-center justify-center p-4 rounded-2xl bg-secondary/50 border border-transparent hover:border-primary/20 hover:bg-secondary transition-all group">
                <Package className="h-6 w-6 mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-sm font-bold">Store</span>
              </Link>
              <Link href="/cart" className="flex flex-col items-center justify-center p-4 rounded-2xl bg-secondary/50 border border-transparent hover:border-primary/20 hover:bg-secondary transition-all group">
                <ShoppingCart className="h-6 w-6 mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-sm font-bold">Cart</span>
              </Link>
            </div>

            {/* Shop by Section */}
            <div className="space-y-4 mb-8">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] px-1">Shop by Gender</h3>
              <div className="grid gap-2">
                <Button
                  variant="outline"
                  className="w-full justify-between h-14 px-6 rounded-2xl text-lg font-bold border-2 hover:bg-primary hover:text-primary-foreground group transition-all"
                  onClick={() => setSelectedGender("men")}
                >
                  <span className="flex items-center gap-3">
                    MEN
                  </span>
                  <ChevronRight className="h-5 w-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-between h-14 px-6 rounded-2xl text-lg font-bold border-2 hover:bg-primary hover:text-primary-foreground group transition-all"
                  onClick={() => setSelectedGender("women")}
                >
                  <span className="flex items-center gap-3">
                    WOMEN
                  </span>
                  <ChevronRight className="h-5 w-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Button>
                <Link href="/unisex" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full justify-between h-14 px-6 rounded-2xl text-lg font-bold border-2 hover:bg-primary hover:text-primary-foreground group transition-all"
                  >
                    <span>UNISEX</span>
                    <ChevronRight className="h-5 w-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </Button>
                </Link>
              </div>
            </div>

          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
