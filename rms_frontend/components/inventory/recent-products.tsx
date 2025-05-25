"use client";

import { useProducts } from "@/hooks/queries/useInventory";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

export function RecentProducts() {
  const [mounted, setMounted] = useState(false);
  const { data: products = [], isLoading } = useProducts();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-8">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center">
            <div className="ml-4 space-y-1">
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
              <div className="h-3 w-24 bg-gray-200 rounded"></div>
            </div>
            <div className="ml-auto">
              <div className="h-6 w-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center animate-pulse">
            <div className="ml-4 space-y-1">
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
              <div className="h-3 w-24 bg-gray-200 rounded"></div>
            </div>
            <div className="ml-auto">
              <div className="h-6 w-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const recentProducts = [...products]
    .sort((a, b) => {
      const dateA = new Date(a.updated_at || a.created_at);
      const dateB = new Date(b.updated_at || b.created_at);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {recentProducts.map((product) => (
        <div key={product.id} className="flex items-center">
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{product.name}</p>
            <p className="text-sm text-muted-foreground">
              ${product.price.toLocaleString()}
            </p>
          </div>
          <div className="ml-auto font-medium">
            <Badge
              variant={
                product.status === "active"
                  ? "default"
                  : product.status === "inactive"
                  ? "secondary"
                  : "destructive"
              }
            >
              {product.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}
