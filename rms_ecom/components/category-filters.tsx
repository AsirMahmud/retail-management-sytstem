"use client"

import { useState } from "react"
import { ChevronRight, ChevronUp, SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

const categories = ["T-shirts", "Shorts", "Shirts", "Hoodie", "Jeans"]

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

export function CategoryFilters() {
  const [priceRange, setPriceRange] = useState([50, 200])
  const [selectedColor, setSelectedColor] = useState("Blue")
  const [selectedSize, setSelectedSize] = useState("Large")
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    colors: true,
    size: true,
    dressStyle: true,
  })

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

      {/* Categories */}
      <div className="space-y-3">
        {categories.map((category) => (
          <button
            key={category}
            className="w-full flex items-center justify-between text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>{category}</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        ))}
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
