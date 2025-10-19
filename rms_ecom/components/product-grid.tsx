"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { CategoryFilters } from "@/components/category-filters"

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

interface ProductGridProps {
  category: string
}

export function ProductGrid({ category }: ProductGridProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const totalProducts = 100
  const productsPerPage = 9

  const totalPages = Math.ceil(totalProducts / productsPerPage)

  const renderPageNumbers = () => {
    const pages = []

    if (currentPage > 1) {
      pages.push(1)
    }

    if (currentPage > 2) {
      pages.push(2)
    }

    if (currentPage > 3) {
      pages.push(3)
    }

    if (currentPage > 4) {
      pages.push("...")
    }

    if (currentPage > 3 && currentPage < totalPages - 2) {
      pages.push(currentPage)
    }

    if (currentPage < totalPages - 3) {
      pages.push("...")
    }

    if (currentPage < totalPages - 2) {
      pages.push(totalPages - 2)
    }

    if (currentPage < totalPages - 1) {
      pages.push(totalPages - 1)
    }

    if (currentPage < totalPages) {
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-bold">{category}</h1>
          <span className="hidden md:inline text-sm text-muted-foreground">
            Showing {(currentPage - 1) * productsPerPage + 1}-{Math.min(currentPage * productsPerPage, totalProducts)}{" "}
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
        Showing {(currentPage - 1) * productsPerPage + 1}-{Math.min(currentPage * productsPerPage, totalProducts)} of{" "}
        {totalProducts} Products
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 pt-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="rounded-lg"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {renderPageNumbers().map((page, index) => (
          <Button
            key={index}
            variant={page === currentPage ? "default" : "outline"}
            size="icon"
            onClick={() => typeof page === "number" && setCurrentPage(page)}
            disabled={page === "..."}
            className="rounded-lg"
          >
            {page}
          </Button>
        ))}

        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          className="rounded-lg"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
