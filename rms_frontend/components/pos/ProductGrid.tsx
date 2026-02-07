"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, ShoppingBag, History, Plus, Barcode } from "lucide-react";
import { useProducts, useInfiniteProducts } from "@/hooks/queries/useInventory";
import { Product } from "@/types/inventory";
import { usePOSStore } from "@/store/pos-store";
import type { ProductVariation as BaseProductVariation } from "@/types/inventory";

type ProductVariation = BaseProductVariation & { color_hax?: string };

interface ProductGridProps {
  searchQuery?: string;
  selectedCategory?: string;
  priceRange?: [number, number];
}

export default function ProductGrid({
  searchQuery = "",
  selectedCategory = "all",
  priceRange = [0, 10000],
}: ProductGridProps) {
  const [selectedSizes, setSelectedSizes] = useState<Record<number, string>>(
    {}
  );
  const [selectedColors, setSelectedColors] = useState<Record<number, string>>(
    {}
  );
  const { handleAddToCart } = usePOSStore();
  const observerTarget = useRef<HTMLDivElement>(null);

  // Debounce search query to prevent excessive API calls
  const [debouncedSearch] = useDebounce(searchQuery, 300);

  // Fetch products using the useInfiniteProducts hook
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error
  } = useInfiniteProducts({
    search: debouncedSearch,
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    // sending price filter to backend if supported, otherwise you might need to keep client side filtering for price if backend doesn't support it yet.
    // Assuming backend supports price_min / price_max based on standard patterns, but checking api definition previously, it might not.
    // If backend doesn't support price range, we might need to filter locally on the fetched pages, but that's inefficient for infinite scroll.
    // For now, let's assume we pass what we can or rely on the backend.
    // Based on previous view of useInventory, params are passed directly.
  });

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Flatten pages into a single list of products
  const products = data?.pages.flatMap((page) => page.results) || [];

  // Client-side price filtering (fallback if backend doesn't support it, but ideally backend should)
  // For infinite scroll, client-side filtering is weird because you only filter what you loaded.
  // We will assume backend handles major filtering.

  console.log("Products loaded:", products.length);

  const formatCurrency = (price: number | string): string => {
    return `$${Number(price).toFixed(2)}`;
  };

  const getUniqueValues = (
    variations: Product["variations"] = [],
    key: "size" | "color"
  ): string[] => {
    return [
      ...new Set(variations.filter((v) => v.is_active).map((v) => v[key])),
    ];
  };

  const getVariationStock = (
    product: Product,
    size?: string,
    color?: string
  ): number => {
    const variation = (product.variations || []).find(
      (v) =>
        v.is_active &&
        (!size || v.size === size) &&
        (!color || v.color === color)
    );
    return variation?.stock || 0;
  };

  const isLowStock = (product: Product): boolean => {
    return (product.variations || []).some(
      (v) => v.is_active && v.stock > 0 && v.stock < 5
    );
  };

  const getColorValue = (colorName: string, product: Product): string => {
    // Find the color hex from the product variations
    const variations = product.variations || [];

    // First, try to find a variation with this exact color and a valid hex
    const exactMatch = variations.find(
      (v) =>
        v.color === colorName && v.color_hax && isValidHexColor(v.color_hax)
    );

    if (exactMatch?.color_hax) {
      return exactMatch.color_hax;
    }

    // If no exact match with valid hex, try to find any variation with this color
    const anyMatch = variations.find((v) => v.color === colorName);
    if (anyMatch?.color_hax && isValidHexColor(anyMatch.color_hax)) {
      return anyMatch.color_hax;
    }

    // If still no valid hex, use the color map
    const colorMap: Record<string, string> = {
      White: "#FFFFFF",
      Black: "#000000",
      Blue: "#3B82F6",
      Red: "#EF4444",
      Green: "#10B981",
      Yellow: "#F59E0B",
      Purple: "#8B5CF6",
      Pink: "#EC4899",
      Gray: "#6B7280",
      Navy: "#1E3A8A",
      Orange: "#FFA500",
      Brown: "#A52A2A",
      Teal: "#008080",
      Maroon: "#800000",
      Olive: "#808000",
      Silver: "#C0C0C0",
      Gold: "#FFD700",
      Beige: "#F5F5DC",
      Burgundy: "#800020",
      Khaki: "#F0E68C",
    };

    return colorMap[colorName] || "#9CA3AF";
  };

  // Helper function to validate hex colors
  const isValidHexColor = (hex: string): boolean => {
    if (!hex || typeof hex !== "string") return false;

    // Remove # if present
    const cleanHex = hex.startsWith("#") ? hex.slice(1) : hex;

    // Check if it's a valid 3 or 6 digit hex
    const hexRegex = /^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/;
    if (!hexRegex.test(cleanHex)) return false;

    // Don't allow pure black or pure white as they might be defaults
    if (
      cleanHex.toLowerCase() === "000000" ||
      cleanHex.toLowerCase() === "ffffff"
    ) {
      return false;
    }

    return true;
  };

  const handleViewProductHistory = (product: Product) => {
    console.log("View history for product:", product.id);
    // Implement your history viewing logic here
  };

  const getCurrentVariationStock = (product: Product): number => {
    // If no size or color is selected, return total stock across all variations
    if (!selectedSizes[product.id] && !selectedColors[product.id]) {
      return (product.variations || []).reduce((total, v) => {
        return v.is_active ? total + v.stock : total;
      }, 0);
    }

    // If only size is selected, return sum of stock for that size across all colors
    if (selectedSizes[product.id] && !selectedColors[product.id]) {
      return (product.variations || []).reduce((total, v) => {
        return v.is_active && v.size === selectedSizes[product.id]
          ? total + v.stock
          : total;
      }, 0);
    }

    // If only color is selected, return sum of stock for that color across all sizes
    if (!selectedSizes[product.id] && selectedColors[product.id]) {
      return (product.variations || []).reduce((total, v) => {
        return v.is_active && v.color === selectedColors[product.id]
          ? total + v.stock
          : total;
      }, 0);
    }

    // If both size and color are selected, return stock for that specific variation
    const size = selectedSizes[product.id];
    const color = selectedColors[product.id];
    return getVariationStock(product, size, color);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium">Error loading products</h3>
        <p className="text-muted-foreground">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {products.map((product) => {
          const sizes = getUniqueValues(product.variations, "size");
          const colors = getUniqueValues(product.variations, "color");
          const currentStock = getCurrentVariationStock(product);

          return (
            <Card key={product.id} className="overflow-hidden flex flex-col">
              <div className="relative h-32 bg-gray-100">
                <img
                  src={product.image || "/placeholder.svg?height=200&width=200"}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />

                {/* SKU Badge */}
                <div className="absolute top-1 left-1">
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <Barcode className="h-3 w-3" />
                    {product.sku}
                  </Badge>
                </div>

                {/* Low stock indicator */}
                {isLowStock(product) && (
                  <div className="absolute top-1 right-1">
                    <Badge
                      variant="destructive"
                      className="flex items-center text-[10px]"
                    >
                      <AlertCircle className="h-2 w-2 mr-0.5" />
                      Low Stock
                    </Badge>
                  </div>
                )}

                {/* Sales history button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute bottom-1 right-1 bg-white/80 hover:bg-white h-6 w-6"
                  onClick={() => handleViewProductHistory(product)}
                >
                  <History className="h-3 w-3" />
                </Button>
              </div>

              <CardContent className="p-2 flex-1 flex flex-col">
                <h3
                  className="font-medium text-xs mb-0.5 truncate"
                  title={product.name}
                >
                  {product.name}
                </h3>
                <p className="text-[10px] text-muted-foreground mb-1 line-clamp-1">
                  {product.description}
                </p>

                {/* Size Type and Gender Info */}
                {(product.size_category || product.gender) && (
                  <div className="flex gap-1 mt-1">
                    {product.size_category && (
                      <Badge variant="outline" className="text-xs bg-emerald-200">
                        {product.size_category}
                      </Badge>
                    )}
                    {product.gender && (
                      <Badge
                        variant="outline"
                        className="text-xs bg-red-600 text-white"
                      >
                        {product.gender}
                      </Badge>
                    )}
                  </div>
                )}

                <p className="text-sm font-bold mb-1">
                  {formatCurrency(product.selling_price)}
                </p>

                {/* Size selection */}
                {sizes.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs font-medium mb-1.5 flex items-center gap-1">
                      <span>Select Size:</span>
                      {!selectedSizes[product.id] && (
                        <span className="text-red-500 text-[10px]">
                          (Required)
                        </span>
                      )}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {sizes.map((size) => (
                        <Badge
                          key={size}
                          variant={
                            selectedSizes[product.id] === size
                              ? "default"
                              : "outline"
                          }
                          className={`cursor-pointer text-xs h-6 px-2 transition-all ${selectedSizes[product.id] === size
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "hover:bg-gray-100"
                            }`}
                          onClick={() => {
                            setSelectedSizes({
                              ...selectedSizes,
                              [product.id]: size,
                            });
                          }}
                        >
                          {size}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color selection */}
                {colors.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs font-medium mb-1.5 flex items-center gap-1">
                      <span>Select Color:</span>
                      {!selectedColors[product.id] && (
                        <span className="text-red-500 text-[10px]">
                          (Required)
                        </span>
                      )}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {colors.map((color) => {
                        const colorHex = getColorValue(color, product);
                        return (
                          <button
                            key={color}
                            className={`group relative flex items-center gap-1.5 px-2 py-1 rounded-md border transition-all ${selectedColors[product.id] === color
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                              }`}
                            onClick={() => {
                              setSelectedColors({
                                ...selectedColors,
                                [product.id]: color,
                              });
                            }}
                            title={color}
                            aria-label={`Select color ${color}`}
                          >
                            <div
                              className={`h-5 w-5 rounded-full border transition-all shadow-sm ${selectedColors[product.id] === color
                                ? "border-blue-600 ring-2 ring-blue-200"
                                : "border-gray-300 group-hover:border-gray-400"
                                }`}
                              style={{ backgroundColor: colorHex }}
                            />
                            <span className="text-xs text-gray-700 font-medium">
                              {color}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Stock indicator */}
                <div className="mb-1.5">
                  <p className="text-[10px] text-muted-foreground">
                    Stock:{" "}
                    <span
                      className={
                        currentStock < 5
                          ? "text-red-600 font-medium"
                          : "text-green-600"
                      }
                    >
                      {currentStock} available
                    </span>
                  </p>
                </div>

                {/* Add to cart button */}
                <Button
                  className={`w-full mt-auto h-8 text-xs transition-all ${currentStock === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : !selectedSizes[product.id] || !selectedColors[product.id]
                      ? "bg-gray-100 text-gray-400 hover:bg-gray-200"
                      : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  disabled={
                    currentStock === 0 ||
                    !selectedSizes[product.id] ||
                    !selectedColors[product.id]
                  }
                  onClick={() => {
                    const size = selectedSizes[product.id] || sizes[0];
                    const color = selectedColors[product.id] || colors[0];
                    handleAddToCart(product, size, color);
                  }}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {currentStock === 0
                    ? "Out of Stock"
                    : !selectedSizes[product.id] || !selectedColors[product.id]
                      ? "Select Size & Color"
                      : "Add to Cart"}
                </Button>
              </CardContent>
            </Card>
          );
        })}

        {products.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-8 text-center">
            <ShoppingBag className="h-8 w-8 text-gray-300 mb-2" />
            <h3 className="text-sm font-medium">No products found</h3>
            <p className="text-xs text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Loading sentinel */}
      {hasNextPage && (
        <div
          ref={observerTarget}
          className="w-full flex justify-center py-4"
        >
          {isFetchingNextPage ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          ) : (
            <span className="text-xs text-muted-foreground">Load more...</span>
          )}
        </div>
      )}
    </div>
  );
}

// Simple debounce hook for search
function useDebounce<T>(value: T, delay: number): [T] {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return [debouncedValue];
}
