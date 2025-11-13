"use client"

import { useState, useEffect } from "react"
import { ChevronRight, ChevronUp, SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { ecommerceApi } from "@/lib/api"

interface CategoryFiltersProps {
  onCategoryChange?: (categorySlug: string | null) => void;
  onColorChange?: (color: string | null) => void;
  onSizeChange?: (size: string | null) => void;
  onPriceChange?: (priceRange: [number, number]) => void;
  onGenderChange?: (gender: string | null) => void;
  onApplyFilters?: () => void;
  selectedCategory?: string | null;
  selectedColor?: string | null;
  selectedSize?: string | null;
  selectedGender?: string | null;
  priceRange?: [number, number];
}



interface Category {
  id: number;
  name: string;
  slug: string;
  parent: number | null;
  parent_name?: string;
  children_count?: number;
}

const genders = [
  { label: "Men", value: "men" },
  { label: "Women", value: "women" },
  { label: "Unisex", value: "unisex" },
]

export function CategoryFilters({ 
  onCategoryChange,
  onColorChange,
  onSizeChange,
  onPriceChange,
  onGenderChange,
  onApplyFilters,
  selectedCategory: externalSelectedCategory,
  selectedColor: externalSelectedColor,
  selectedSize: externalSelectedSize,
  selectedGender: externalSelectedGender,
  priceRange: externalPriceRange,
}: CategoryFiltersProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>(externalPriceRange || [50, 200])
  const [selectedColor, setSelectedColor] = useState<string | null>(externalSelectedColor || null)
  const [selectedSize, setSelectedSize] = useState<string | null>(externalSelectedSize || null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(externalSelectedCategory || null)
  const [selectedGender, setSelectedGender] = useState<string | null>(externalSelectedGender || null)
  const [categories, setCategories] = useState<Category[]>([])
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    gender: true,
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

  // Sync external selectedCategory prop with internal state
  useEffect(() => {
    if (externalSelectedCategory !== undefined) {
      setSelectedCategory(externalSelectedCategory)
    }
  }, [externalSelectedCategory])

  // Sync external selectedGender prop with internal state
  useEffect(() => {
    if (externalSelectedGender !== undefined) {
      setSelectedGender(externalSelectedGender)
    }
  }, [externalSelectedGender])

  const handleGenderSelect = (gender: string | null) => {
    const newGender = selectedGender === gender ? null : gender
    setSelectedGender(newGender)
    onGenderChange?.(newGender)
    // Apply filter immediately
    if (onApplyFilters) {
      setTimeout(() => onApplyFilters(), 100)
    }
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

      {/* Gender */}
      <div className="space-y-4">
        <button
          onClick={() => toggleSection("gender")}
          className="w-full flex items-center justify-between font-semibold"
        >
          <span>Gender</span>
          <ChevronUp className={cn("h-4 w-4 transition-transform", !expandedSections.gender && "rotate-180")} />
        </button>
        {expandedSections.gender && (
          <div className="space-y-2">
            <button
              onClick={() => handleGenderSelect(null)}
              className={cn(
                "w-full flex items-center justify-between transition-colors py-2 px-2 rounded-md",
                selectedGender === null 
                  ? "text-foreground font-medium bg-secondary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <span>All</span>
            </button>
            {genders.map((gender) => {
              const isSelected = selectedGender === gender.value
              return (
                <button
                  key={gender.value}
                  onClick={() => handleGenderSelect(gender.value)}
                  className={cn(
                    "w-full flex items-center justify-between transition-colors py-2 px-2 rounded-md text-left",
                    isSelected
                      ? "text-foreground font-medium bg-secondary" 
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  <span>{gender.label}</span>
                </button>
              )
            })}
          </div>
        )}
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

      <Button 
        onClick={() => onApplyFilters?.()}
        className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-full h-12"
      >
        Apply Filter
      </Button>
    </div>
  )
}
