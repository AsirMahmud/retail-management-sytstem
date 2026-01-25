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
  onResetFilters?: () => void;
  onClose?: () => void;
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

const colors = [
  { name: "White", value: "white", hex: "#FFFFFF" },
  { name: "Black", value: "black", hex: "#000000" },
  { name: "Red", value: "red", hex: "#FF0000" },
  { name: "Blue", value: "blue", hex: "#0000FF" },
  { name: "Green", value: "green", hex: "#008000" },
  { name: "Yellow", value: "yellow", hex: "#FFFF00" },
  { name: "Pink", value: "pink", hex: "#FFC0CB" },
  { name: "Purple", value: "purple", hex: "#800080" },
  { name: "Orange", value: "orange", hex: "#FFA500" },
]

const sizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"]

export function CategoryFilters({
  onCategoryChange,
  onColorChange,
  onSizeChange,
  onPriceChange,
  onGenderChange,
  onApplyFilters,
  onResetFilters,
  onClose,
  selectedCategory: externalSelectedCategory,
  selectedColor: externalSelectedColor,
  selectedSize: externalSelectedSize,
  selectedGender: externalSelectedGender,
  priceRange: externalPriceRange,
}: CategoryFiltersProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>(externalPriceRange || [0, 10000])
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
    price: true,
    colors: true,
    sizes: true,
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
    onApplyFilters?.()
  }

  // Sync external props with internal state
  useEffect(() => {
    if (externalSelectedCategory !== undefined) setSelectedCategory(externalSelectedCategory)
  }, [externalSelectedCategory])

  useEffect(() => {
    if (externalSelectedGender !== undefined) setSelectedGender(externalSelectedGender)
  }, [externalSelectedGender])

  useEffect(() => {
    if (externalSelectedColor !== undefined) setSelectedColor(externalSelectedColor)
  }, [externalSelectedColor])

  useEffect(() => {
    if (externalSelectedSize !== undefined) setSelectedSize(externalSelectedSize)
  }, [externalSelectedSize])

  useEffect(() => {
    if (externalPriceRange) setPriceRange(externalPriceRange)
  }, [externalPriceRange])

  const handleGenderSelect = (gender: string | null) => {
    setSelectedGender(gender)
    onGenderChange?.(gender)
    onApplyFilters?.()
  }

  const handleColorSelect = (color: string | null) => {
    const newVal = selectedColor === color ? null : color
    setSelectedColor(newVal)
    onColorChange?.(newVal)
    onApplyFilters?.()
  }

  const handleSizeSelect = (size: string | null) => {
    const newVal = selectedSize === size ? null : size
    setSelectedSize(newVal)
    onSizeChange?.(newVal)
    onApplyFilters?.()
  }

  const handlePriceChange = (min: number, max: number) => {
    const newRange: [number, number] = [min, max]
    setPriceRange(newRange)
    onPriceChange?.(newRange)
    onApplyFilters?.()
  }

  const handleReset = () => {
    setPriceRange([0, 10000])
    setSelectedColor(null)
    setSelectedSize(null)
    setSelectedCategory(null)
    setSelectedGender(null)
    onResetFilters?.()
    onApplyFilters?.()
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold uppercase tracking-wider">Filters</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded-md hover:bg-secondary/50"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-secondary rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
          <SlidersHorizontal className="h-5 w-5 text-muted-foreground lg:block hidden" />
        </div>
      </div>

      <Separator />

      {/* Categories - Hierarchical */}
      <div className="space-y-4">
        <button
          onClick={() => toggleSection("categories")}
          className="w-full flex items-center justify-between font-semibold py-1"
        >
          <span>CATEGORIES</span>
          <ChevronUp className={cn("h-4 w-4 transition-transform", !expandedSections.categories && "rotate-180")} />
        </button>
        {expandedSections.categories && (
          <div className="space-y-1">
            <button
              onClick={() => handleCategorySelect(null)}
              className={cn(
                "w-full flex items-center transition-colors py-2 px-3 rounded-md text-sm",
                selectedCategory === null
                  ? "text-primary font-bold bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <span>All Categories</span>
            </button>
            {loading ? (
              <div className="text-sm text-muted-foreground px-3">Loading...</div>
            ) : (
              organizedCategories.map((category) => {
                const hasChildren = category.children && category.children.length > 0
                const isExpanded = expandedCategories.has(category.id)
                const isSelected = selectedCategory === category.slug

                return (
                  <div key={category.id} className="space-y-0.5">
                    <div className="flex items-center">
                      {hasChildren ? (
                        <button
                          onClick={() => toggleCategoryExpand(category.id)}
                          className="p-1.5 hover:bg-secondary rounded transition-colors flex-shrink-0"
                        >
                          <ChevronRight
                            className={cn(
                              "h-3.5 w-3.5 transition-transform text-muted-foreground",
                              isExpanded && "rotate-90"
                            )}
                          />
                        </button>
                      ) : (
                        <div className="w-8 flex-shrink-0" />
                      )}
                      <button
                        onClick={() => handleCategorySelect(category.slug)}
                        className={cn(
                          "flex-1 flex items-center transition-colors py-1.5 px-2 rounded-md text-sm text-left",
                          isSelected
                            ? "text-primary font-bold bg-primary/10"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                        )}
                      >
                        <span>{category.name}</span>
                      </button>
                    </div>

                    {hasChildren && isExpanded && (
                      <div className="ml-8 space-y-0.5 border-l border-secondary pl-3 py-1">
                        {category.children.map((child) => {
                          const isChildSelected = selectedCategory === child.slug
                          return (
                            <button
                              key={child.id}
                              onClick={() => handleCategorySelect(child.slug)}
                              className={cn(
                                "w-full flex items-center transition-colors py-1.5 px-2 rounded-md text-xs",
                                isChildSelected
                                  ? "text-primary font-bold bg-primary/10"
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

      {/* Gender */}
      <div className="space-y-4">
        <button
          onClick={() => toggleSection("gender")}
          className="w-full flex items-center justify-between font-semibold py-1"
        >
          <span>GENDER</span>
          <ChevronUp className={cn("h-4 w-4 transition-transform", !expandedSections.gender && "rotate-180")} />
        </button>
        {expandedSections.gender && (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleGenderSelect(null)}
              className={cn(
                "py-2 px-3 rounded-md text-sm border transition-all text-center",
                selectedGender === null
                  ? "bg-foreground text-background border-foreground font-medium"
                  : "bg-transparent text-muted-foreground border-input hover:border-foreground hover:text-foreground"
              )}
            >
              All
            </button>
            {genders.map((gender) => {
              const isSelected = selectedGender === gender.value
              return (
                <button
                  key={gender.value}
                  onClick={() => handleGenderSelect(gender.value)}
                  className={cn(
                    "py-2 px-3 rounded-md text-sm border transition-all text-center",
                    isSelected
                      ? "bg-foreground text-background border-foreground font-medium"
                      : "bg-transparent text-muted-foreground border-input hover:border-foreground hover:text-foreground"
                  )}
                >
                  {gender.label}
                </button>
              )
            })}
          </div>
        )}
      </div>

      <Separator />

      {/* Price */}
      <div className="space-y-4">
        <button
          onClick={() => toggleSection("price")}
          className="w-full flex items-center justify-between font-semibold py-1"
        >
          <span>PRICE</span>
          <ChevronUp className={cn("h-4 w-4 transition-transform", !expandedSections.price && "rotate-180")} />
        </button>
        {expandedSections.price && (
          <div className="space-y-4 px-2">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold px-1">Min</span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">৳</span>
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceChange(Number(e.target.value), priceRange[1])}
                    className="w-full bg-secondary/30 border-none rounded-md py-2 pl-7 pr-3 text-sm focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="flex-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold px-1">Max</span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">৳</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange(priceRange[0], Number(e.target.value))}
                    className="w-full bg-secondary/30 border-none rounded-md py-2 pl-7 pr-3 text-sm focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {[500, 1000, 2000, 5000].map((price) => (
                <button
                  key={price}
                  onClick={() => handlePriceChange(0, price)}
                  className="text-[10px] font-bold py-1 px-2 bg-secondary/50 hover:bg-secondary rounded-full border border-transparent hover:border-secondary-foreground/20 transition-all"
                >
                  Under ৳{price}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <Separator />

      {/* Colors */}
      <div className="space-y-4">
        <button
          onClick={() => toggleSection("colors")}
          className="w-full flex items-center justify-between font-semibold py-1"
        >
          <span>COLORS</span>
          <ChevronUp className={cn("h-4 w-4 transition-transform", !expandedSections.colors && "rotate-180")} />
        </button>
        {expandedSections.colors && (
          <div className="flex flex-wrap gap-3 px-1">
            {colors.map((color) => {
              const isSelected = selectedColor === color.value
              return (
                <button
                  key={color.value}
                  onClick={() => handleColorSelect(color.value)}
                  className={cn(
                    "group relative flex flex-col items-center gap-1.5",
                    "transition-all active:scale-95"
                  )}
                  title={color.name}
                >
                  <div
                    className={cn(
                      "h-8 w-8 rounded-full border-2 transition-all",
                      isSelected ? "border-primary scale-110 shadow-md" : "border-transparent group-hover:border-muted-foreground/30"
                    )}
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className={cn(
                    "text-[10px] uppercase font-bold tracking-tighter transition-colors",
                    isSelected ? "text-primary" : "text-muted-foreground"
                  )}>
                    {color.name}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      <Separator />

      {/* Sizes */}
      <div className="space-y-4">
        <button
          onClick={() => toggleSection("sizes")}
          className="w-full flex items-center justify-between font-semibold py-1"
        >
          <span>SIZES</span>
          <ChevronUp className={cn("h-4 w-4 transition-transform", !expandedSections.sizes && "rotate-180")} />
        </button>
        {expandedSections.sizes && (
          <div className="grid grid-cols-4 gap-2 px-1">
            {sizes.map((size) => {
              const isSelected = selectedSize === size
              return (
                <button
                  key={size}
                  onClick={() => handleSizeSelect(size)}
                  className={cn(
                    "h-10 rounded-md border text-xs font-bold transition-all flex items-center justify-center",
                    isSelected
                      ? "bg-foreground text-background border-foreground shadow-sm"
                      : "bg-transparent text-muted-foreground border-input hover:border-foreground hover:text-foreground"
                  )}
                >
                  {size}
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div className="pt-4 lg:hidden">
        <Button
          onClick={onClose}
          className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-full h-12 font-bold uppercase tracking-widest text-xs"
        >
          Show Results
        </Button>
      </div>
    </div>
  )
}
