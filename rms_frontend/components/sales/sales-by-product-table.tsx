"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductSalesData {
  id: number;
  name: string;
  category: string;
  sku: string;
  sold: number;
  revenue: number;
  profit: number;
  stock: number;
  trend: "up" | "down" | "stable";
}

interface SalesByProductTableProps {
  data: ProductSalesData[] | null;
  isLoading: boolean;
  limit?: number;
}

export function SalesByProductTable({
  data,
  isLoading,
  limit,
}: SalesByProductTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Units Sold</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Profit</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 8 }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (!data) return null;

  const displayData = limit ? data.slice(0, limit) : data;

  // Find the highest sold value for progress bar calculation
  const maxSold = Math.max(...data.map((product) => product.sold));

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Units Sold</TableHead>
            <TableHead>Revenue</TableHead>
            <TableHead>Profit</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Trend</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayData.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.sku}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="w-full max-w-24">
                    <Progress
                      value={(product.sold / maxSold) * 100}
                      className="h-2"
                    />
                  </div>
                  <span>{product.sold}</span>
                </div>
              </TableCell>
              <TableCell>${product.revenue.toFixed(2)}</TableCell>
              <TableCell>${product.profit.toFixed(2)}</TableCell>
              <TableCell>
                <Badge variant={product.stock < 15 ? "destructive" : "outline"}>
                  {product.stock}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    product.trend === "up"
                      ? "default"
                      : product.trend === "down"
                      ? "destructive"
                      : "outline"
                  }
                >
                  {product.trend === "up"
                    ? "↑"
                    : product.trend === "down"
                    ? "↓"
                    : "→"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
