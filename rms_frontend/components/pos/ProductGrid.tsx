"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, ShoppingBag, History, Plus } from "lucide-react";
import { useProducts } from "@/hooks/queries/useInventory";
import { Product } from "@/types/inventory";
import { usePOSStore } from "@/store/pos-store";

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

  // Fetch products using the useProducts hook
  const { data: products, isLoading, error } = useProducts();

  console.log("All products:", products);

  // Filter products based on search query, category, and price range
  const filteredProducts =
    products?.filter((product) => {
      const matchesSearch =
        searchQuery === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        (product.category &&
          product.category.id?.toString() === selectedCategory);

      const productPrice = parseFloat(product.selling_price);
      const matchesPrice =
        !isNaN(productPrice) &&
        productPrice >= priceRange[0] &&
        productPrice <= priceRange[1];

      console.log("Product filtering:", {
        product: product.name,
        matchesSearch,
        matchesCategory,
        matchesPrice,
        category: product.category,
        selectedCategory,
        price: productPrice,
        priceRange,
        isActive: product.is_active,
      });

      return matchesSearch && matchesCategory && product.is_active;
    }) || [];

  console.log("Filtered products:", filteredProducts);

  const formatCurrency = (price: string): string => {
    return `$${Number.parseFloat(price).toFixed(2)}`;
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

  const getColorValue = (colorName: string): string => {
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
    };
    return colorMap[colorName] || "#9CA3AF";
  };

  const handleViewProductHistory = (product: Product) => {
    console.log("View history for product:", product.id);
    // Implement your history viewing logic here
  };

  const getCurrentVariationStock = (product: Product): number => {
    const size =
      selectedSizes[product.id] ||
      getUniqueValues(product.variations, "size")[0];
    const color =
      selectedColors[product.id] ||
      getUniqueValues(product.variations, "color")[0];
    return getVariationStock(product, size, color);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium">Error loading products</h3>
        <p className="text-muted-foreground">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      {filteredProducts.map((product) => {
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
                <Badge variant="secondary" className="text-[10px]">
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
              <p className="text-sm font-bold mb-1">
                {formatCurrency(product.selling_price)}
              </p>

              {/* Size selection */}
              {sizes.length > 0 && (
                <div className="mb-1.5">
                  <p className="text-[10px] text-muted-foreground mb-0.5">
                    Size:
                  </p>
                  <div className="flex flex-wrap gap-0.5">
                    {sizes.map((size) => (
                      <Badge
                        key={size}
                        variant={
                          selectedSizes[product.id] === size
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer text-[10px] h-5"
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
                <div className="mb-1.5">
                  <p className="text-[10px] text-muted-foreground mb-0.5">
                    Color:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {colors.map((color) => (
                      <button
                        key={color}
                        className={`h-4 w-4 rounded-full border ${
                          selectedColors[product.id] === color
                            ? "border-blue-600 ring-1 ring-blue-200"
                            : "border-gray-300"
                        }`}
                        style={{ backgroundColor: getColorValue(color) }}
                        onClick={() => {
                          setSelectedColors({
                            ...selectedColors,
                            [product.id]: color,
                          });
                        }}
                        title={color}
                        aria-label={`Select color ${color}`}
                      />
                    ))}
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
                className="w-full mt-auto h-7 text-xs"
                disabled={currentStock === 0}
                onClick={() => {
                  const size = selectedSizes[product.id] || sizes[0];
                  const color = selectedColors[product.id] || colors[0];
                  handleAddToCart(product, size, color);
                }}
              >
                <Plus className="h-3 w-3 mr-1" />
                {currentStock === 0 ? "Out of Stock" : "Add to Cart"}
              </Button>
            </CardContent>
          </Card>
        );
      })}

      {filteredProducts.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center py-8 text-center">
          <ShoppingBag className="h-8 w-8 text-gray-300 mb-2" />
          <h3 className="text-sm font-medium">No products found</h3>
          <p className="text-xs text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}
