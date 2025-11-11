"use client"

import Link from "next/link"
import { Search, ShoppingCart, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useCartStore } from "@/hooks/useCartStore"

export function SiteHeader() {
  const categories = [
    { name: "Casual", slug: "casual" },
    { name: "Formal", slug: "formal" },
    { name: "Party", slug: "party" },
    { name: "Gym", slug: "gym" },
  ]

  const totalItems = useCartStore((s) => s.totalItems)

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
            <DropdownMenuContent>
              {categories.map((category) => (
                <DropdownMenuItem key={category.slug} asChild>
                  <Link href={`/category/${category.slug}`}>{category.name}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/women" className="text-sm font-medium hover:underline underline-offset-4">
            Women
          </Link>
          <Link href="/men" className="text-sm font-medium hover:underline underline-offset-4">
            Men
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
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/products" className="text-lg font-medium">
                  All Products
                </Link>
                <Link href="/women" className="text-lg font-medium">Women</Link>
                <Link href="/men" className="text-lg font-medium">Men</Link>
                <div className="text-sm font-semibold text-muted-foreground mb-2">Categories</div>
                {categories.map((category) => (
                  <Link key={category.slug} href={`/category/${category.slug}`} className="text-lg font-medium">
                    {category.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
