"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProductPerformanceReport } from "@/hooks/queries/use-reports";
import { DateRange } from "react-day-picker";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductPerformanceReport({
  dateRange,
}: {
  dateRange: { from: Date | undefined; to: Date | undefined };
}) {
  const { data: productData, isLoading } =
    useProductPerformanceReport(dateRange);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card
              key={i}
              className="bg-gradient-to-br from-pink-50 to-fuchsia-100 border-0 shadow-xl"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[60px]" />
                <Skeleton className="h-4 w-[80px] mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="border-0 shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
            <Skeleton className="h-6 w-[200px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!productData) return null;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {productData.total_products}
            </div>
            <p className="text-xs text-muted-foreground">
              {productData.top_performing_products.length} top performers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${parseFloat(productData.total_sales).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {productData.sales_by_product.length} products sold
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${parseFloat(productData.total_profit).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {parseFloat(productData.average_profit_margin || "0").toFixed(2)}%
              average margin
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Performing Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productData.top_performing_products}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="product_name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total_sales" fill="#8884d8" name="Sales" />
                <Bar dataKey="total_profit" fill="#82ca9d" name="Profit" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Products Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Total Sales</TableHead>
                <TableHead>Quantity Sold</TableHead>
                <TableHead>Profit</TableHead>
                <TableHead className="text-right">Profit Margin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productData.top_performing_products.map((product) => (
                <TableRow key={product.product_name}>
                  <TableCell>{product.product_name}</TableCell>
                  <TableCell>{product.category_name || "N/A"}</TableCell>
                  <TableCell className="text-right">
                    ${parseFloat(product.total_sales).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    {product.quantity_sold ?? 0}
                  </TableCell>
                  <TableCell className="text-right">
                    ${parseFloat(product.total_profit).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    {product.profit_margin !== undefined &&
                    product.profit_margin !== null
                      ? `${parseFloat(product.profit_margin).toFixed(2)}%`
                      : "0.00%"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Low Performing Products</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Total Sales</TableHead>
                <TableHead>Quantity Sold</TableHead>
                <TableHead>Profit</TableHead>
                <TableHead className="text-right">Profit Margin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productData.low_performing_products.map((product) => (
                <TableRow key={product.product_name}>
                  <TableCell>{product.product_name}</TableCell>
                  <TableCell>{product.category_name || "N/A"}</TableCell>
                  <TableCell className="text-right">
                    ${parseFloat(product.total_sales).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    {product.quantity_sold ?? 0}
                  </TableCell>
                  <TableCell className="text-right">
                    ${parseFloat(product.total_profit).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    {product.profit_margin !== undefined &&
                    product.profit_margin !== null
                      ? `${parseFloat(product.profit_margin).toFixed(2)}%`
                      : "0.00%"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Product Sales Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Total Sales</TableHead>
                <TableHead>Quantity Sold</TableHead>
                <TableHead>Average Price</TableHead>
                <TableHead>Profit</TableHead>
                <TableHead className="text-right">Profit Margin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productData.sales_by_product.map((product) => {
                const profitInfo = productData.profit_by_product.find(
                  (p) => p.product_name === product.product_name
                );
                return (
                  <TableRow key={product.product_name}>
                    <TableCell>{product.product_name}</TableCell>
                    <TableCell>
                      ${parseFloat(product.total_sales).toFixed(2)}
                    </TableCell>
                    <TableCell>{product.quantity_sold}</TableCell>
                    <TableCell>
                      ${parseFloat(product.average_price).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      ${parseFloat(profitInfo?.total_profit || "0").toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      {parseFloat(profitInfo?.profit_margin || "0").toFixed(2)}%
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
