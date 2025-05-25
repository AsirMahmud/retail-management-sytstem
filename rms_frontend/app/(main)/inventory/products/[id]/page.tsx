"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useProduct } from "@/hooks/queries/useInventory";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@/types/inventory";
import Image from "next/image";

export default function ProductPage() {
  const params = useParams();
  const productId = typeof params.id === "string" ? parseInt(params.id) : 0;
  const { data: product, isLoading } = useProduct(productId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
            <Skeleton className="h-6 w-20" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            {/* Loading skeletons for product information */}
            <div className="space-y-4">
              <div>
                <Skeleton className="h-6 w-40 mb-4" />
                <div className="grid grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i}>
                      <Skeleton className="h-4 w-20 mb-1" />
                      <Skeleton className="h-6 w-32" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-muted-foreground">Product not found</p>
      </div>
    );
  }

  return <ProductDetails product={product} />;
}

interface ProductDetailsProps {
  product: Product;
}

function ProductDetails({ product }: ProductDetailsProps) {
  const categoryName =
    typeof product.category === "object" ? product.category.name : "N/A";
  const supplierName =
    typeof product.supplier === "object"
      ? product.supplier.company_name
      : "N/A";

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground mt-1">{product.description}</p>
          </div>
          <Badge variant={product.is_active ? "default" : "secondary"}>
            {product.is_active ? "Active" : "Inactive"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-4">
                Product Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">SKU</p>
                  <p className="font-medium">{product.sku}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Barcode</p>
                  <p className="font-medium">{product.barcode || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{categoryName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Supplier</p>
                  <p className="font-medium">{supplierName}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="text-lg font-semibold mb-4">Pricing</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Cost Price</p>
                  <p className="font-medium">
                    ${product.cost_price.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Selling Price</p>
                  <p className="font-medium">
                    ${product.selling_price.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Profit Margin</p>
                  <p className="font-medium">
                    {(
                      ((product.selling_price - product.cost_price) /
                        product.cost_price) *
                      100
                    ).toFixed(2)}
                    %
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-4">Stock Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Current Stock</p>
                  <p className="font-medium">{product.stock_quantity}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Minimum Stock</p>
                  <p className="font-medium">{product.minimum_stock}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Stock Status</p>
                  <Badge
                    variant={
                      product.stock_quantity <= product.minimum_stock
                        ? "destructive"
                        : "default"
                    }
                  >
                    {product.stock_quantity <= product.minimum_stock
                      ? "Low Stock"
                      : "In Stock"}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="text-lg font-semibold mb-4">Timestamps</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Created At</p>
                  <p className="font-medium">
                    {new Date(product.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">
                    {new Date(product.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {product.image && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Product Image</h2>
          <div className="relative aspect-square w-64">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </Card>
      )}
    </div>
  );
}
