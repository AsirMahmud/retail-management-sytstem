"use client";

import { useProducts } from "@/hooks/queries/useInventory";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@/types/inventory";

export default function ProductsPage() {
  const { data: products = [], isLoading } = useProducts();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <div className="p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <Link href="/inventory/add-product">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add New Product
          </Button>
        </Link>
      </div>

      <Card>
        <div className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Barcode</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead className="text-right">Cost Price</TableHead>
                <TableHead className="text-right">Selling Price</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Min Stock</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product: Product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Link
                      href={`/inventory/products/${product.id}`}
                      className="font-medium hover:underline"
                    >
                      {product.name}
                    </Link>
                  </TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.barcode || "N/A"}</TableCell>
                  {/* <TableCell>
                    {typeof product.category === "object"
                      ? product.category.name
                      : "N/A"}
                  </TableCell> */}
                  {/* <TableCell>
                    {typeof product.supplier === "object"
                      ? product.supplier.name
                      : "N/A"}
                  </TableCell> */}
                  <TableCell className="text-right">
                    ${product.cost_price}
                  </TableCell>
                  <TableCell className="text-right">
                    ${product.selling_price}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={
                        product.stock_quantity <= product.minimum_stock
                          ? "destructive"
                          : "default"
                      }
                    >
                      {product.stock_quantity}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {product.minimum_stock}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={product.is_active ? "default" : "secondary"}
                    >
                      {product.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {/* {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center">
                    No products found
                  </TableCell>
                </TableRow>
              )} */}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
