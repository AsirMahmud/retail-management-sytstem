"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react"
import { ProductCard, ProductCardSkeleton } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { CategoryFilters } from "@/components/category-filters"
import { useEffect } from "react"
import { DiscountInfo } from "@/lib/api"

const products = [
  {
    id: 1,
    name: "Gradient Graphic T-shirt",
    price: 145,
    rating: 3.5,
    image: "/gradient-graphic-tshirt.jpg",
  },
  {
    id: 2,
    name: "Polo with Tipping Details",
    price: 180,
    rating: 4.5,
    image: "/pink-polo-shirt.jpg",
  },
  {
    id: 3,
    name: "Black Striped T-shirt",
    price: 120,
    originalPrice: 160,
    discount: 30,
    rating: 5.0,
    image: "/black-striped-baseball-tshirt.jpg",
  },
  {
    id: 4,
    name: "Skinny Fit Jeans",
    price: 240,
    originalPrice: 260,
    discount: 20,
    rating: 3.5,
    image: "/blue-skinny-jeans.jpg",
  },
  {
    id: 5,
    name: "Checkered Shirt",
    price: 180,
    rating: 4.5,
    image: "/red-checkered-flannel-shirt.jpg",
  },
  {
    id: 6,
    name: "Sleeve Striped T-shirt",
    price: 130,
    originalPrice: 160,
    discount: 30,
    rating: 4.5,
    image: "/orange-striped-sleeve-tshirt.jpg",
  },
  {
    id: 7,
    name: "Vertical Striped Shirt",
    price: 212,
    originalPrice: 232,
    discount: 20,
    rating: 5.0,
    image: "/green-vertical-striped-shirt.jpg",
  },
  {
    id: 8,
    name: "Courage Graphic T-shirt",
    price: 145,
    rating: 4.0,
    image: "/orange-courage-graphic-tshirt.jpg",
  },
  {
    id: 9,
    name: "Loose Fit Bermuda Shorts",
    price: 80,
    rating: 3.0,
    image: "/blue-bermuda-shorts.jpg",
  },
]

interface Product {
  id: number | string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  image: string;
  discount?: number;
  discountInfo?: DiscountInfo | null;
}

interface ProductGridProps {
  category: string;
  products?: Product[];
  totalCount?: number; // when provided, enables server-driven pagination
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
}

export function ProductGrid({ category, products: propProducts, totalCount, page, pageSize, onPageChange, isLoading = false }: ProductGridProps) {
  const isServerPaginated = typeof totalCount === 'number' && typeof page === 'number' && typeof pageSize === 'number' && typeof onPageChange === 'function'
  const [currentPage, setCurrentPage] = useState(1)
  const effectivePage = isServerPaginated ? (page as number) : currentPage
  const productsToUse = propProducts || products
  const totalProducts = isServerPaginated ? (totalCount as number) : productsToUse.length
  const productsPerPage = isServerPaginated ? (pageSize as number) : 9

  const totalPages = Math.ceil(Math.max(1, totalProducts) / Math.max(1, productsPerPage))

  const startIndex = (effectivePage - 1) * productsPerPage
  const endIndex = Math.min(startIndex + productsPerPage, isServerPaginated ? startIndex + productsToUse.length : totalProducts)
  const paginatedProducts = isServerPaginated ? productsToUse : productsToUse.slice(startIndex, endIndex)

  // Clamp current page if total pages shrink (e.g., after filtering)
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1)
    }
  }, [totalPages])

  // Reset to first page when the list changes significantly
  useEffect(() => {
    setCurrentPage(1)
  }, [productsToUse.length])

  const renderPageNumbers = () => {
    const pages: (number | string)[] = []
    const range = 2 // Numbers to show around current page

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || // Always show first page
        i === totalPages || // Always show last page
        (i >= effectivePage - range && i <= effectivePage + range) // Show numbers around current page
      ) {
        pages.push(i)
      } else if (
        (i === effectivePage - range - 1 && i > 1) ||
        (i === effectivePage + range + 1 && i < totalPages)
      ) {
        pages.push("...")
      }
    }

    // Filter out consecutive ellipses (shouldn't happen with above logic but just in case)
    return pages.filter((item, index) => {
      if (item === "..." && pages[index - 1] === "...") return false
      return true
    })
  }

  return (
    <div className="space-y-6 min-h-screen">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-bold">{category}</h1>
          <span className="hidden md:inline text-sm text-muted-foreground">
            Showing {(effectivePage - 1) * productsPerPage + 1}-{Math.min(effectivePage * productsPerPage, totalProducts)}{" "}
            of {totalProducts} Products
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden rounded-lg bg-transparent">
                <SlidersHorizontal className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:w-[400px] overflow-y-auto">
              <CategoryFilters />
            </SheetContent>
          </Sheet>

          <Select defaultValue="popular">
            <SelectTrigger className="w-[140px] md:w-[160px] border-0 font-medium text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="md:hidden text-sm text-muted-foreground">
        Showing {(effectivePage - 1) * productsPerPage + 1}-{Math.min(effectivePage * productsPerPage, totalProducts)} of {totalProducts} Products
      </div>

      {/* Product Grid */}
      <div className="grid  grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {isLoading
          ? Array.from({ length: productsPerPage }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))
          : paginatedProducts.map((product) => (
            <ProductCard key={product.id} {...product} id={String(product.id)} />
          ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 pt-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => (isServerPaginated ? onPageChange!(Math.max(1, effectivePage - 1)) : setCurrentPage((prev) => Math.max(1, prev - 1)))}
          disabled={effectivePage === 1}
          className="rounded-lg"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {renderPageNumbers().map((pageNum, index) => (
          <Button
            key={index}
            variant={pageNum === effectivePage ? "default" : "outline"}
            size="icon"
            onClick={() => typeof pageNum === "number" && (isServerPaginated ? onPageChange!(pageNum) : setCurrentPage(pageNum))}
            disabled={pageNum === "..."}
            className="rounded-lg"
          >
            {pageNum}
          </Button>
        ))}

        <Button
          variant="outline"
          size="icon"
          onClick={() => (isServerPaginated ? onPageChange!(Math.min(totalPages, effectivePage + 1)) : setCurrentPage((prev) => Math.min(totalPages, prev + 1)))}
          disabled={effectivePage === totalPages}
          className="rounded-lg"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
