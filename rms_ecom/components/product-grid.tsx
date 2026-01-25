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
import { cn } from "@/lib/utils"

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
    <div className="space-y-8 min-h-screen">
      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-8">
        {isLoading
          ? Array.from({ length: productsPerPage }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))
          : paginatedProducts.map((product) => (
            <ProductCard key={product.id} {...product} id={String(product.id)} />
          ))}
      </div>

      {/* Empty State */}
      {!isLoading && paginatedProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="bg-secondary/30 p-6 rounded-full mb-4">
            <SlidersHorizontal className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold mb-2">No products found</h3>
          <p className="text-muted-foreground max-w-xs">
            We couldn't find anything matching your filters. Try adjusting your search or filter criteria.
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-12 border-t mt-12">
          <Button
            variant="ghost"
            onClick={() => (isServerPaginated ? onPageChange!(Math.max(1, effectivePage - 1)) : setCurrentPage((prev) => Math.max(1, prev - 1)))}
            disabled={effectivePage === 1}
            className="rounded-xl h-12 px-6 font-bold uppercase text-[10px] tracking-widest gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="hidden md:flex items-center gap-2">
            {renderPageNumbers().map((pageNum, index) => (
              <Button
                key={index}
                variant={pageNum === effectivePage ? "default" : "ghost"}
                size="icon"
                onClick={() => typeof pageNum === "number" && (isServerPaginated ? onPageChange!(pageNum) : setCurrentPage(pageNum))}
                disabled={pageNum === "..."}
                className={cn(
                  "rounded-xl h-10 w-10 font-bold",
                  pageNum === effectivePage ? "shadow-lg shadow-primary/20" : ""
                )}
              >
                {pageNum}
              </Button>
            ))}
          </div>

          <div className="md:hidden flex items-center px-4 font-bold text-sm">
            {effectivePage} / {totalPages}
          </div>

          <Button
            variant="ghost"
            onClick={() => (isServerPaginated ? onPageChange!(Math.min(totalPages, effectivePage + 1)) : setCurrentPage((prev) => Math.min(totalPages, prev + 1)))}
            disabled={effectivePage === totalPages}
            className="rounded-xl h-12 px-6 font-bold uppercase text-[10px] tracking-widest gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
