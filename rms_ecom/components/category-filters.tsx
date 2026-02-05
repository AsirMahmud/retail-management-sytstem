"use client"

import { useState, useEffect } from "react"
import { ChevronRight, ChevronDown, SlidersHorizontal, X, Check, RotateCcw, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { ecommerceApi } from "@/lib/api"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

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
  gender: 'MALE' | 'FEMALE' | 'UNISEX';
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
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "categories",
    "gender",
    "price",
    "colors",
    "sizes",
  ])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        // Fetch all categories to group them by gender
        const data = await ecommerceApi.getOnlineCategories({}) as Category[]
        setCategories(data)
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  // Organize categories by gender and then by parent-child hierarchy
  const groupedCategories = {
    men: categories.filter(c => c.gender === 'MALE' && !c.parent).map(parent => ({
      ...parent,
      children: categories.filter(c => c.parent === parent.id)
    })),
    women: categories.filter(c => c.gender === 'FEMALE' && !c.parent).map(parent => ({
      ...parent,
      children: categories.filter(c => c.parent === parent.id)
    })),
    unisex: categories.filter(c => c.gender === 'UNISEX' && !c.parent).map(parent => ({
      ...parent,
      children: categories.filter(c => c.parent === parent.id)
    }))
  }

  const handleCategorySelect = (categorySlug: string | null, gender?: string | null) => {
    setSelectedCategory(categorySlug)
    onCategoryChange?.(categorySlug)

    // If a gender is provided (or if we are clearing), update gender state too
    if (gender !== undefined) {
      setSelectedGender(gender)
      onGenderChange?.(gender)
    }

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

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }


  const activeFiltersCount = [
    selectedCategory,
    selectedGender,
    selectedColor,
    selectedSize,
    (priceRange[0] > 0 || priceRange[1] < 10000)
  ].filter(Boolean).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold tracking-tight">FILTERS</h2>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="rounded-full px-2 py-0 h-5 text-[10px] font-bold bg-primary/10 text-primary border-none">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-8 text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:text-primary hover:bg-primary/5 px-2"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden h-8 w-8 hover:bg-secondary rounded-full"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>

      <Accordion
        type="multiple"
        defaultValue={expandedSections}
        className="space-y-2"
      >
        {/* Categories Section */}
        <AccordionItem value="categories" className="border-none">
          <AccordionTrigger className="hover:no-underline py-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80">
            Categories
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="space-y-1">
              <button
                onClick={() => handleCategorySelect(null, null)}
                className={cn(
                  "w-full flex items-center transition-all py-3 px-4 rounded-xl text-sm group mb-2",
                  selectedCategory === null && selectedGender === null
                    ? "text-primary font-bold bg-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                )}
              >
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full mr-3 transition-all",
                  selectedCategory === null ? "bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" : "bg-primary/30 group-hover:bg-primary/60"
                )} />
                <span>All Styles</span>
              </button>

              {loading ? (
                <div className="space-y-4 px-3 mt-4">
                  <Skeleton className="h-6 w-full rounded-xl" />
                  <Skeleton className="h-6 w-[80%] rounded-xl" />
                  <Skeleton className="h-6 w-[90%] rounded-xl" />
                </div>
              ) : (
                <div className="space-y-4">
                  {(['men', 'women', 'unisex'] as const).map((gender) => {
                    const genderLabel = gender === 'men' ? 'Men' : gender === 'women' ? 'Women' : 'Unisex'
                    const categoriesForGender = groupedCategories[gender]

                    if (categoriesForGender.length === 0) return null

                    return (
                      <Collapsible key={gender} className="border rounded-xl overflow-hidden bg-white shadow-sm">
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            className="w-full justify-between h-12 px-4 hover:bg-secondary/50 font-bold uppercase tracking-widest text-[10px]"
                          >
                            <span className="flex items-center gap-2">
                              {genderLabel}
                              <Badge variant="secondary" className="rounded-full px-1.5 py-0 h-4 text-[9px] font-medium bg-muted text-muted-foreground border-none">
                                {categoriesForGender.length}
                              </Badge>
                            </span>
                            <ChevronDown className="h-4 w-4 transition-transform duration-300" />
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="px-2 pb-2 space-y-1 bg-secondary/10">
                          {categoriesForGender.map((category) => {
                            const hasChildren = category.children && category.children.length > 0
                            const isExpanded = expandedCategories.has(category.id)
                            const isSelected = selectedCategory === category.slug

                            return (
                              <Collapsible
                                key={category.id}
                                open={isExpanded}
                                onOpenChange={() => toggleCategoryExpand(category.id)}
                                className="group/collapsible"
                              >
                                <div className={cn(
                                  "flex items-center gap-1 rounded-xl transition-all duration-200",
                                  isSelected || isExpanded ? "bg-white shadow-sm" : "hover:bg-white/50"
                                )}>
                                  <button
                                    onClick={() => handleCategorySelect(category.slug, gender)}
                                    className={cn(
                                      "flex-1 flex items-center gap-3 py-2.5 px-3 text-[13px] transition-all text-left",
                                      isSelected ? "text-primary font-bold" : "text-foreground font-medium"
                                    )}
                                  >
                                    <div className={cn(
                                      "w-1.5 h-1.5 rounded-full transition-colors",
                                      isSelected ? "bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" : "bg-primary/20 group-hover/collapsible:bg-primary/40"
                                    )} />
                                    {category.name}
                                  </button>

                                  {hasChildren && (
                                    <CollapsibleTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 flex-shrink-0 hover:bg-primary/5 mr-1"
                                      >
                                        <ChevronDown
                                          className={cn(
                                            "h-3.5 w-3.5 transition-transform duration-300 text-muted-foreground",
                                            isExpanded && "rotate-180 text-foreground"
                                          )}
                                        />
                                      </Button>
                                    </CollapsibleTrigger>
                                  )}
                                </div>

                                <CollapsibleContent className="animate-in fade-in-0 slide-in-from-top-1 duration-200">
                                  {hasChildren && (
                                    <div className="ml-6 mt-1 mb-2 space-y-1 border-l border-primary/10 pl-2">
                                      {category.children.map((child: any) => {
                                        const isChildSelected = selectedCategory === child.slug
                                        return (
                                          <button
                                            key={child.id}
                                            onClick={() => handleCategorySelect(child.slug, gender)}
                                            className={cn(
                                              "w-full flex items-center gap-2.5 text-xs font-medium py-2 px-3 rounded-lg transition-all group/sub",
                                              isChildSelected
                                                ? "bg-primary/5 text-primary font-bold"
                                                : "text-muted-foreground hover:bg-white/80 hover:text-foreground"
                                            )}
                                          >
                                            <ArrowRight className={cn(
                                              "h-3 w-3 transition-transform",
                                              isChildSelected ? "translate-x-0.5" : "-translate-x-1 opacity-0 group-hover/sub:translate-x-0 group-hover/sub:opacity-100"
                                            )} />
                                            {child.name}
                                          </button>
                                        )
                                      })}
                                    </div>
                                  )}
                                </CollapsibleContent>
                              </Collapsible>
                            )
                          })}
                        </CollapsibleContent>
                      </Collapsible>
                    )
                  })}
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>


        {/* Price Section */}
        <AccordionItem value="price" className="border-none">
          <AccordionTrigger className="hover:no-underline py-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80">
            Price Range
          </AccordionTrigger>
          <AccordionContent className="pt-6 px-1">
            <div className="space-y-6">
              <Slider
                value={[priceRange[0], priceRange[1]]}
                max={10000}
                step={100}
                onValueChange={(vals) => handlePriceChange(vals[0], vals[1])}
                className="py-4"
              />

              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 space-y-1.5 text-center">
                  <div className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-tighter">Min Price</div>
                  <div className="bg-secondary/50 rounded-lg py-1.5 font-bold text-sm tabular-nums">৳{priceRange[0]}</div>
                </div>
                <div className="w-4 h-px bg-border mt-4" />
                <div className="flex-1 space-y-1.5 text-center">
                  <div className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-tighter">Max Price</div>
                  <div className="bg-secondary/50 rounded-lg py-1.5 font-bold text-sm tabular-nums">৳{priceRange[1]}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {[1000, 2000, 5000].map((price) => (
                  <button
                    key={price}
                    onClick={() => handlePriceChange(0, price)}
                    className="text-[10px] font-bold py-1.5 px-3 bg-secondary/50 hover:bg-primary/10 hover:text-primary rounded-full transition-all border border-transparent shadow-sm"
                  >
                    Under ৳{price}
                  </button>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Colors Section */}
        <AccordionItem value="colors" className="border-none">
          <AccordionTrigger className="hover:no-underline py-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80">
            Colors
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <TooltipProvider>
              <div className="grid grid-cols-5 gap-y-4 gap-x-2 px-1">
                {colors.map((color) => {
                  const isSelected = selectedColor === color.value
                  return (
                    <Tooltip key={color.value}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleColorSelect(color.value)}
                          className="group flex flex-col items-center gap-1.5 outline-none"
                        >
                          <div
                            className={cn(
                              "relative h-10 w-10 rounded-full border-2 transition-all duration-300 flex items-center justify-center overflow-hidden",
                              isSelected
                                ? "border-primary scale-110 shadow-lg shadow-black/10 ring-2 ring-primary/20"
                                : "border-secondary group-hover:border-muted-foreground/30 shadow-sm"
                            )}
                            style={{ backgroundColor: color.hex }}
                          >
                            {isSelected && (
                              <div className={cn(
                                "absolute inset-0 flex items-center justify-center bg-black/10 transition-opacity",
                                color.value === 'white' ? 'text-black' : 'text-white'
                              )}>
                                <Check className="h-5 w-5 stroke-[3]" />
                              </div>
                            )}
                          </div>
                          <span className={cn(
                            "text-[9px] uppercase font-bold tracking-tighter transition-colors w-full text-center truncate",
                            isSelected ? "text-primary" : "text-muted-foreground/60 group-hover:text-foreground"
                          )}>
                            {color.name}
                          </span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="font-bold">
                        {color.name}
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
              </div>
            </TooltipProvider>
          </AccordionContent>
        </AccordionItem>

        {/* Sizes Section */}
        <AccordionItem value="sizes" className="border-none">
          <AccordionTrigger className="hover:no-underline py-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80">
            Sizes
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="grid grid-cols-4 gap-2">
              {sizes.map((size) => {
                const isSelected = selectedSize === size
                return (
                  <button
                    key={size}
                    onClick={() => handleSizeSelect(size)}
                    className={cn(
                      "h-10 rounded-xl border text-xs font-bold transition-all flex items-center justify-center shadow-sm",
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105 z-10"
                        : "bg-white text-muted-foreground border-border hover:border-primary/50 hover:text-primary"
                    )}
                  >
                    {size}
                  </button>
                )
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Mobile Sidebar Footer */}
      <div className="pt-6 lg:hidden">
        <Button
          onClick={onClose}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/95 shadow-xl shadow-primary/20 rounded-2xl h-14 font-bold uppercase tracking-widest text-xs"
        >
          View {activeFiltersCount > 0 ? `${activeFiltersCount} Selection${activeFiltersCount > 1 ? 's' : ''}` : 'All Results'}
        </Button>
      </div>
    </div>
  )
}
