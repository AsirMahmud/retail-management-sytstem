"use client"

import { useState, useEffect } from "react"
import { ChevronRight, ChevronUp, SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { ecommerceApi } from "@/lib/api"

interface CategoryFiltersProps {
  onCategoryChange?: (categorySlug: string | null) => void;
}

const colors = [
  { name: "Green", value: "#00C12B" },
  { name: "Red", value: "#F50606" },
  { name: "Yellow", value: "#F5DD06" },
  { name: "Orange", value: "#F57906" },
  { name: "Cyan", value: "#06CAF5" },
  { name: "Blue", value: "#063AF5" },
  { name: "Purple", value: "#7D06F5" },
  { name: "Pink", value: "#F506A4" },
  { name: "White", value: "#FFFFFF" },
  { name: "Black", value: "#000000" },
]

const sizes = ["XX-Small", "X-Small", "Small", "Medium", "Large", "X-Large", "XX-Large", "3X-Large", "4X-Large"]

const dressStyles = ["Casual", "Formal", "Party", "Gym"]

interface Category {
  id: number;
  name: string;
  slug: string;
  parent: number | null;
  parent_name?: string;
  children_count?: number;
}

export function CategoryFilters({ onCategoryChange }: CategoryFiltersProps) {
  const [priceRange, setPriceRange] = useState([50, 200])
  const [selectedColor, setSelectedColor] = useState("Blue")
  const [selectedSize, setSelectedSize] = useState("Large")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    colors: true,
    size: true,
    dressStyle: true,
  })

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await ecommerceApi.getOnlineCategories()
        setCategories(data)
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  // Organize categories into hierarchical structure
  const organizedCategories = categories.reduce((acc, category) => {
    if (!category.parent) {
      // Root category
      acc.push({
        ...category,
        children: categories.filter(c => c.parent === category.id)
      })
    }
    return acc
  }, [] as Array<Category & { children: Category[] }>)

  const handleCategorySelect = (categorySlug: string | null) => {
    setSelectedCategory(categorySlug)
    onCategoryChange?.(categorySlug)
  }

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

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  return (
    <div className="border rounded-lg p-5 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Filters</h2>
        <div className="lg:hidden">
          <X className="h-5 w-5 text-muted-foreground" />
        </div>
        <SlidersHorizontal className="h-5 w-5 text-muted-foreground lg:block hidden" />
      </div>

      <Separator />

      {/* Categories - Hierarchical */}
      <div className="space-y-4">
        <button
          onClick={() => toggleSection("categories")}
          className="w-full flex items-center justify-between font-semibold"
        >
          <span>Categories</span>
          <ChevronUp className={cn("h-4 w-4 transition-transform", !expandedSections.categories && "rotate-180")} />
        </button>
        {expandedSections.categories && (
          <div className="space-y-2">
            <button
              onClick={() => handleCategorySelect(null)}
              className={cn(
                "w-full flex items-center justify-between transition-colors py-2 px-2 rounded-md",
                selectedCategory === null 
                  ? "text-foreground font-medium bg-secondary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <span>All Categories</span>
            </button>
            {loading ? (
              <div className="text-sm text-muted-foreground px-2">Loading categories...</div>
            ) : (
              organizedCategories.map((category) => {
                const hasChildren = category.children && category.children.length > 0
                const isExpanded = expandedCategories.has(category.id)
                const isSelected = selectedCategory === category.slug
                
                return (
                  <div key={category.id} className="space-y-0.5">
                    {/* Parent Category */}
                    <div className="flex items-center gap-2">
                      {hasChildren && (
                        <button
                          onClick={() => toggleCategoryExpand(category.id)}
                          className="p-1 hover:bg-secondary rounded transition-colors flex-shrink-0"
                          aria-label={isExpanded ? "Collapse" : "Expand"}
                        >
                          <ChevronRight 
                            className={cn(
                              "h-4 w-4 transition-transform text-muted-foreground",
                              isExpanded && "rotate-90"
                            )} 
                          />
                        </button>
                      )}
                      {!hasChildren && <div className="w-6 flex-shrink-0" />}
                      <button
                        onClick={() => handleCategorySelect(category.slug)}
                        className={cn(
                          "flex-1 flex items-center transition-colors py-2 px-2 rounded-md text-left",
                          isSelected
                            ? "text-foreground font-medium bg-secondary" 
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                        )}
                      >
                        <span>{category.name}</span>
                      </button>
                    </div>
                    
                    {/* Subcategories */}
                    {hasChildren && isExpanded && (
                      <div className="ml-8 space-y-0.5 border-l-2 border-secondary/30 pl-4 py-1">
                        {category.children.map((child) => {
                          const isChildSelected = selectedCategory === child.slug
                          return (
                            <button
                              key={child.id}
                              onClick={() => handleCategorySelect(child.slug)}
                              className={cn(
                                "w-full flex items-center transition-colors py-2 px-2 rounded-md text-sm",
                                isChildSelected
                                  ? "text-foreground font-medium bg-secondary" 
                                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                              )}
                            >
                              <span>{child.name}</span>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>

      <Separator />

      {/* Price */}
      <div className="space-y-4">
        <button
          onClick={() => toggleSection("price")}
          className="w-full flex items-center justify-between font-semibold"
        >
          <span>Price</span>
          <ChevronUp className={cn("h-4 w-4 transition-transform", !expandedSections.price && "rotate-180")} />
        </button>
        {expandedSections.price && (
          <div className="space-y-4">
            <Slider value={priceRange} onValueChange={setPriceRange} min={0} max={300} step={10} className="w-full" />
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">${priceRange[0]}</span>
              <span className="font-medium">${priceRange[1]}</span>
            </div>
          </div>
        )}
      </div>

      <Separator />

      {/* Colors */}
      <div className="space-y-4">
        <button
          onClick={() => toggleSection("colors")}
          className="w-full flex items-center justify-between font-semibold"
        >
          <span>Colors</span>
          <ChevronUp className={cn("h-4 w-4 transition-transform", !expandedSections.colors && "rotate-180")} />
        </button>
        {expandedSections.colors && (
          <div className="flex flex-wrap gap-3">
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.name)}
                className={cn(
                  "w-9 h-9 rounded-full border-2 transition-all relative",
                  selectedColor === color.name ? "border-foreground scale-110" : "border-transparent hover:scale-105",
                )}
                style={{ backgroundColor: color.value }}
                aria-label={color.name}
              >
                {selectedColor === color.name && color.name !== "White" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                {selectedColor === color.name && color.name === "White" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-foreground"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* Size */}
      <div className="space-y-4">
        <button
          onClick={() => toggleSection("size")}
          className="w-full flex items-center justify-between font-semibold"
        >
          <span>Size</span>
          <ChevronUp className={cn("h-4 w-4 transition-transform", !expandedSections.size && "rotate-180")} />
        </button>
        {expandedSections.size && (
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  selectedSize === size
                    ? "bg-foreground text-background"
                    : "bg-secondary text-foreground hover:bg-secondary/80",
                )}
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* Dress Style */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection("dressStyle")}
          className="w-full flex items-center justify-between font-semibold"
        >
          <span>Dress Style</span>
          <ChevronUp className={cn("h-4 w-4 transition-transform", !expandedSections.dressStyle && "rotate-180")} />
        </button>
        {expandedSections.dressStyle && (
          <div className="space-y-3">
            {dressStyles.map((style) => (
              <button
                key={style}
                className="w-full flex items-center justify-between text-muted-foreground hover:text-foreground transition-colors"
              >
                <span>{style}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            ))}
          </div>
        )}
      </div>

      <Button className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-full h-12">
        Apply Filter
      </Button>
    </div>
  )
}
