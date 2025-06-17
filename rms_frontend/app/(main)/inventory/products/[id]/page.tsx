"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useProduct, useDeleteProduct } from "@/hooks/queries/useInventory";
import { useParams, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@/types/inventory";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Package,
  Tag,
  DollarSign,
  Warehouse,
  Calendar,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function ProductPage() {
  const params = useParams();
  const productId =
    typeof params.id === "string" ? Number.parseInt(params.id) : 0;
  const { data: product, isLoading } = useProduct(productId);

  if (isLoading) {
    return <ProductSkeleton />;
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <Package className="h-16 w-16 text-muted-foreground opacity-30" />
        <p className="text-xl font-medium text-muted-foreground">
          Product not found
        </p>
        <Button variant="outline" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
        </Button>
      </div>
    );
  }

  return <ProductDetails product={product} />;
}

function ProductSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
      </div>

      {/* Main content skeleton */}
      <Card className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
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
            <Skeleton className="h-1 w-full" />
            <div>
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="grid grid-cols-2 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="grid grid-cols-2 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                ))}
              </div>
            </div>
            <Skeleton className="h-1 w-full" />
            <div>
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="grid grid-cols-2 gap-4">
                {[...Array(2)].map((_, i) => (
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

      {/* Variations skeleton */}
      <Card className="p-6">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="overflow-x-auto">
          <Skeleton className="h-64 w-full" />
        </div>
      </Card>
    </div>
  );
}

interface ProductDetailsProps {
  product: Product;
}

function ProductDetails({ product }: ProductDetailsProps) {
  const router = useRouter();
  const deleteProduct = useDeleteProduct();
  const categoryName =
    typeof product.category === "object" ? product.category?.name : "N/A";
  const supplierName =
    typeof product.supplier === "object"
      ? product.supplier?.company_name
      : "N/A";

  const costPrice = Number(product.cost_price);
  const sellingPrice = Number(product.selling_price);
  const profitMargin = ((sellingPrice - costPrice) / sellingPrice) * 100;
  const isLowStock = product.stock_quantity <= product.minimum_stock;
  const isOutOfStock = product.stock_quantity <= 0;

  const handleDelete = async () => {
    try {
      await deleteProduct.mutateAsync(product.id);
      toast.success("Product deleted successfully");
      router.push("/inventory/products");
    } catch (error) {
      toast.error("Failed to delete product");
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with navigation and actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Product Details
            </h1>
            <p className="text-muted-foreground">
              View and manage product information
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              router.push(`/inventory/edit-product/${product.id.toString()}`)
            }
          >
            <Edit className="h-4 w-4 mr-2" /> Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" /> Delete
          </Button>
        </div>
      </div>

      {/* Product overview card */}
      <Card className="overflow-hidden border-0 shadow-lg">
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 p-6 border-b">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{product.name}</h2>
                <Badge
                  variant={product.is_active ? "default" : "secondary"}
                  className="ml-2"
                >
                  {product.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <p className="text-muted-foreground">{product.description}</p>
            </div>
            {isLowStock && (
              <div className="bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 px-3 py-1.5 rounded-md flex items-center gap-2 text-sm font-medium">
                <AlertTriangle className="h-4 w-4" />
                {isOutOfStock ? "Out of Stock" : "Low Stock"}
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left column */}
            <div className="space-y-6">
              {/* Product information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-500" />
                  Product Information
                </h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      SKU
                    </p>
                    <p className="font-medium">{product.sku}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Barcode
                    </p>
                    <p className="font-medium">{product.barcode || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Category
                    </p>
                    <p className="font-medium">{categoryName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Supplier
                    </p>
                    <p className="font-medium">{supplierName}</p>
                  </div>
                </div>
              </div>

              <Separator className="my-2" />

              {/* Pricing */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  Pricing
                </h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Cost Price
                    </p>
                    <p className="font-medium text-lg">
                      ${costPrice.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Selling Price
                    </p>
                    <p className="font-medium text-lg">
                      ${sellingPrice.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Profit Margin
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-lg">
                        {profitMargin.toFixed(1)}%
                      </p>
                      <Badge
                        variant={
                          profitMargin > 30
                            ? "default"
                            : profitMargin > 15
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {profitMargin > 30
                          ? "High"
                          : profitMargin > 15
                          ? "Good"
                          : "Low"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Size Information */}
              {(product.size_type ||
                product.size_category ||
                product.gender) && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-indigo-500"
                    >
                      <path d="M4 7V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2h-12a2 2 0 0 1-2-2Z" />
                      <polyline points="14,2 14,8 20,8" />
                      <line x1="16" x2="8" y1="13" y2="13" />
                      <line x1="16" x2="8" y1="17" y2="17" />
                      <polyline points="10,9 9,9 8,9" />
                    </svg>
                    Size Information
                  </h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    {product.size_type && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Size Type
                        </p>
                        <p className="font-medium capitalize">
                          {product.size_type}
                        </p>
                      </div>
                    )}
                    {product.size_category && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Size Category
                        </p>
                        <p className="font-medium">{product.size_category}</p>
                      </div>
                    )}
                    {product.gender && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Gender
                        </p>
                        <p className="font-medium">{product.gender}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Separator className="my-2" />
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Stock information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Warehouse className="h-5 w-5 text-purple-500" />
                  Stock Information
                </h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Current Stock
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-lg">
                        {product.stock_quantity}
                      </p>
                      {isOutOfStock ? (
                        <XCircle className="h-5 w-5 text-red-500" />
                      ) : isLowStock ? (
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                      ) : (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Minimum Stock
                    </p>
                    <p className="font-medium text-lg">
                      {product.minimum_stock}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Stock Status
                    </p>
                    <Badge
                      variant={
                        isOutOfStock
                          ? "destructive"
                          : isLowStock
                          ? "outline"
                          : "default"
                      }
                      className="mt-1"
                    >
                      {isOutOfStock
                        ? "Out of Stock"
                        : isLowStock
                        ? "Low Stock"
                        : "In Stock"}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator className="my-2" />

              {/* Timestamps */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-orange-500" />
                  Timestamps
                </h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Created At
                    </p>
                    <p className="font-medium">
                      {product.created_at
                        ? new Date(product.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              timeZone: "UTC",
                            }
                          )
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Last Updated
                    </p>
                    <p className="font-medium">
                      {product.updated_at
                        ? new Date(product.updated_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              timeZone: "UTC",
                            }
                          )
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Product variations */}
      {product.variations && product.variations.length > 0 && (
        <Card className="overflow-hidden border-0 shadow-lg">
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 p-6 border-b">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Tag className="h-5 w-5 text-blue-500" />
              Product Variations
            </h3>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-6 py-3 text-left font-medium text-sm text-muted-foreground">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-sm text-muted-foreground">
                      Color
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-sm text-muted-foreground">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-sm text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {product.variations.map((variation) => (
                    <tr
                      key={variation.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium">
                        {variation.size}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full border"
                            style={{
                              backgroundColor:
                                variation.color.toLowerCase() === "white"
                                  ? "#ffffff"
                                  : variation.color.toLowerCase() === "blue"
                                  ? "#3b82f6"
                                  : variation.color.toLowerCase() === "black"
                                  ? "#000000"
                                  : variation.color.toLowerCase(),
                            }}
                          />
                          <span>{variation.color}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {variation.stock}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            variation.stock <= 0
                              ? "destructive"
                              : variation.stock <= 5
                              ? "outline"
                              : "default"
                          }
                        >
                          {variation.stock <= 0
                            ? "Out of Stock"
                            : variation.stock <= 5
                            ? "Low Stock"
                            : "In Stock"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}

      {/* Product image */}
      {product.image && (
        <Card className="overflow-hidden border-0 shadow-lg">
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 p-6 border-b">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-pink-500"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
              Product Image
            </h3>
          </div>
          <div className="p-6">
            <div className="relative aspect-square w-64 mx-auto sm:mx-0 overflow-hidden rounded-lg shadow-md border">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
