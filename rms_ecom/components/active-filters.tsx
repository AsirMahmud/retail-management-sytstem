"use client"

import { X, RotateCcw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface ActiveFiltersProps {
    selectedCategory: string | null;
    selectedGender: string | null;
    selectedColor: string | null;
    selectedSize: string | null;
    priceRange: [number, number];
    onRemoveFilter: (type: 'category' | 'gender' | 'color' | 'size' | 'price') => void;
    onClearAll: () => void;
}

export function ActiveFilters({
    selectedCategory,
    selectedGender,
    selectedColor,
    selectedSize,
    priceRange,
    onRemoveFilter,
    onClearAll,
}: ActiveFiltersProps) {
    const hasPriceFilter = priceRange[0] > 0 || priceRange[1] < 10000

    if (!selectedCategory && !selectedGender && !selectedColor && !selectedSize && !hasPriceFilter) {
        return null
    }

    return (
        <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mr-1">Active:</span>

            {selectedCategory && (
                <Badge variant="secondary" className="pl-3 pr-1 py-1 rounded-full bg-white border-border text-foreground font-medium flex items-center gap-1 group hover:border-primary/50 transition-colors">
                    <span className="text-xs">Category: {selectedCategory.replace(/-/g, ' ')}</span>
                    <button
                        onClick={() => onRemoveFilter('category')}
                        className="p-0.5 rounded-full hover:bg-secondary transition-colors"
                    >
                        <X className="h-3 w-3" />
                    </button>
                </Badge>
            )}

            {selectedGender && (
                <Badge variant="secondary" className="pl-3 pr-1 py-1 rounded-full bg-white border-border text-foreground font-medium flex items-center gap-1 group hover:border-primary/50 transition-colors">
                    <span className="text-xs">Gender: {selectedGender}</span>
                    <button
                        onClick={() => onRemoveFilter('gender')}
                        className="p-0.5 rounded-full hover:bg-secondary transition-colors"
                    >
                        <X className="h-3 w-3" />
                    </button>
                </Badge>
            )}

            {selectedColor && (
                <Badge variant="secondary" className="pl-3 pr-1 py-1 rounded-full bg-white border-border text-foreground font-medium flex items-center gap-1 group hover:border-primary/50 transition-colors">
                    <span className="text-xs">Color: {selectedColor}</span>
                    <button
                        onClick={() => onRemoveFilter('color')}
                        className="p-0.5 rounded-full hover:bg-secondary transition-colors"
                    >
                        <X className="h-3 w-3" />
                    </button>
                </Badge>
            )}

            {selectedSize && (
                <Badge variant="secondary" className="pl-3 pr-1 py-1 rounded-full bg-white border-border text-foreground font-medium flex items-center gap-1 group hover:border-primary/50 transition-colors">
                    <span className="text-xs">Size: {selectedSize}</span>
                    <button
                        onClick={() => onRemoveFilter('size')}
                        className="p-0.5 rounded-full hover:bg-secondary transition-colors"
                    >
                        <X className="h-3 w-3" />
                    </button>
                </Badge>
            )}

            {hasPriceFilter && (
                <Badge variant="secondary" className="pl-3 pr-1 py-1 rounded-full bg-white border-border text-foreground font-medium flex items-center gap-1 group hover:border-primary/50 transition-colors">
                    <span className="text-xs">Price: ৳{priceRange[0]} - ৳{priceRange[1]}</span>
                    <button
                        onClick={() => onRemoveFilter('price')}
                        className="p-0.5 rounded-full hover:bg-secondary transition-colors"
                    >
                        <X className="h-3 w-3" />
                    </button>
                </Badge>
            )}

            <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="h-7 px-2 text-[10px] font-bold uppercase tracking-tighter text-muted-foreground hover:text-destructive hover:bg-destructive/5"
            >
                <RotateCcw className="h-3 w-3 mr-1" />
                Clear All
            </Button>
        </div>
    )
}
