"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, ShoppingCart, User, Menu, ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { useCartStore } from "@/hooks/useCartStore"
import { ecommerceApi } from "@/lib/api"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const [onlineCategories, setOnlineCategories] = useState<Array<{ id: number; name: string; slug: string; parent: number | null; parent_name?: string; children_count?: number }>>([])
  const [loadingCategories, setLoadingCategories] = useState(false)
  const totalItems = useCartStore((s) => s.totalItems)

  // Fetch online categories for desktop navigation
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
  
  // Debug: Log categories structure
  useEffect(() => {
    if (organizedCategories.length > 0) {
      console.log('Organized categories:', organizedCategories)
      organizedCategories.forEach(cat => {
        if (cat.children && cat.children.length > 0) {
          console.log(`Category "${cat.name}" has ${cat.children.length} children:`, cat.children.map(c => c.name))
        }
      })
    }
  }, [organizedCategories])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold tracking-tight">SHOP.CO</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/products" className="text-sm font-medium hover:underline underline-offset-4">
            All Products
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger className="text-sm font-medium hover:underline underline-offset-4">
              Categories
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
          <Link href="/women" className="text-sm font-medium hover:underline underline-offset-4">
            Women
          </Link>
          <Link href="/men" className="text-sm font-medium hover:underline underline-offset-4">
            Men
          </Link>
          <Link href="/unisex" className="text-sm font-medium hover:underline underline-offset-4">
            Unisex
          </Link>
        </nav>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input type="search" placeholder="Search for products..." className="w-full pl-10" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="hidden md:inline-flex">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center px-1">
                  {totalItems}
                </span>
              )}
              <span className="sr-only">Shopping cart</span>
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="hidden md:inline-flex">
            <User className="h-5 w-5" />
            <span className="sr-only">Account</span>
          </Button>

          {/* Mobile Menu */}
          <MobileNavigationSheet />
        </div>
      </div>
    </header>
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
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-sm overflow-y-auto">
        {selectedGender ? (
          // Categories View
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6 sticky top-0 bg-background pb-4 border-b">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBackToGender}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-xl font-bold capitalize">{selectedGender} Categories</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-sm text-muted-foreground">Loading categories...</div>
                </div>
              ) : organizedCategories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-sm text-muted-foreground mb-2">No categories found</p>
                  <Button variant="outline" size="sm" onClick={handleBackToGender}>
                    Go Back
                  </Button>
                </div>
              ) : (
                <nav className="flex flex-col gap-1">
                  {organizedCategories.map((category) => {
                    const hasChildren = category.children && category.children.length > 0
                    const isExpanded = expandedCategories.has(category.id)
                    
                    return (
                      <div key={category.id} className="space-y-0.5">
                        {/* Parent Category */}
                        <div className="flex items-center gap-2">
                          {hasChildren && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleCategoryExpand(category.id)}
                              className="h-8 w-8 flex-shrink-0"
                            >
                              <ChevronRight 
                                className={cn(
                                  "h-4 w-4 transition-transform text-muted-foreground",
                                  isExpanded && "rotate-90"
                                )} 
                              />
                            </Button>
                          )}
                          {!hasChildren && <div className="w-8 flex-shrink-0" />}
                          <Link
                            href={`/category/${category.slug}${selectedGender ? `?gender=${selectedGender}` : ''}`}
                            className="flex-1 text-lg font-medium py-2 px-2 rounded-md hover:bg-secondary transition-colors"
                          >
                            {category.name}
                          </Link>
                        </div>
                        
                        {/* Subcategories */}
                        {hasChildren && isExpanded && (
                          <div className="ml-10 space-y-0.5 border-l-2 border-secondary/30 pl-4 py-1">
                            {category.children.map((child) => (
                              <Link
                                key={child.id}
                                href={`/category/${child.slug}${selectedGender ? `?gender=${selectedGender}` : ''}`}
                                className="block text-base font-medium py-2 px-2 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                              >
                                {child.name}
                              </Link>
                            ))}
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
          <div className="flex flex-col h-full">
            <h2 className="text-xl font-bold mb-6">Menu</h2>
            
            {/* Filter Section - Moved to top */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Filter by Category</h3>
              <div className="flex flex-col gap-3">
                <Button
                  variant="outline"
                  className="w-full justify-between h-12 text-base font-medium"
                  onClick={() => setSelectedGender("men")}
                >
                  <span>Men</span>
                  <ChevronRight className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-between h-12 text-base font-medium"
                  onClick={() => setSelectedGender("women")}
                >
                  <span>Women</span>
                  <ChevronRight className="h-5 w-5" />
                </Button>
                <Link href="/unisex" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full justify-between h-12 text-base font-medium"
                  >
                    <span>Unisex</span>
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>

            <nav className="flex flex-col gap-4 border-t pt-6">
              <Link href="/products" className="text-lg font-medium py-2 hover:underline">
                All Products
              </Link>
              <Link href="/women" className="text-lg font-medium py-2 hover:underline">Women</Link>
              <Link href="/men" className="text-lg font-medium py-2 hover:underline">Men</Link>
              <Link href="/unisex" className="text-lg font-medium py-2 hover:underline">Unisex</Link>
            </nav>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
