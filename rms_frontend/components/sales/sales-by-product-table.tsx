"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Sample data - in a real app, this would come from your database
const productSalesData = [
  {
    id: 1,
    name: "Navy Slim Fit Suit",
    category: "Suits",
    sku: "SUIT-001",
    sold: 42,
    revenue: 12599.58,
    profit: 5039.83,
    stock: 18,
    trend: "up",
  },
  {
    id: 2,
    name: "White Dress Shirt",
    category: "Shirts",
    sku: "SHIRT-001",
    sold: 78,
    revenue: 3899.22,
    profit: 1949.61,
    stock: 45,
    trend: "up",
  },
  {
    id: 3,
    name: "Silk Tie",
    category: "Accessories",
    sku: "ACC-001",
    sold: 56,
    revenue: 1679.44,
    profit: 1007.66,
    stock: 32,
    trend: "stable",
  },
  {
    id: 4,
    name: "Leather Oxford Shoes",
    category: "Shoes",
    sku: "SHOE-001",
    sold: 35,
    revenue: 8575.0,
    profit: 3430.0,
    stock: 12,
    trend: "up",
  },
  {
    id: 5,
    name: "Casual Blazer",
    category: "Suits",
    sku: "SUIT-002",
    sold: 29,
    revenue: 4349.71,
    profit: 1739.88,
    stock: 8,
    trend: "down",
  },
  {
    id: 6,
    name: "Cotton T-Shirt",
    category: "Casual Wear",
    sku: "CAS-001",
    sold: 92,
    revenue: 3679.08,
    profit: 2207.45,
    stock: 65,
    trend: "up",
  },
  {
    id: 7,
    name: "Leather Belt",
    category: "Accessories",
    sku: "ACC-002",
    sold: 48,
    revenue: 3877.44,
    profit: 2326.46,
    stock: 22,
    trend: "stable",
  },
  {
    id: 8,
    name: "Charcoal Suit",
    category: "Suits",
    sku: "SUIT-003",
    sold: 37,
    revenue: 12949.63,
    profit: 5179.85,
    stock: 14,
    trend: "up",
  },
]

interface SalesByProductTableProps {
  limit?: number
}

export function SalesByProductTable({ limit }: SalesByProductTableProps) {
  const displayData = limit ? productSalesData.slice(0, limit) : productSalesData

  // Find the highest sold value for progress bar calculation
  const maxSold = Math.max(...productSalesData.map((product) => product.sold))

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
                    <Progress value={(product.sold / maxSold) * 100} className="h-2" />
                  </div>
                  <span>{product.sold}</span>
                </div>
              </TableCell>
              <TableCell>${product.revenue.toFixed(2)}</TableCell>
              <TableCell>${product.profit.toFixed(2)}</TableCell>
              <TableCell>
                <Badge variant={product.stock < 15 ? "destructive" : "outline"}>{product.stock}</Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={product.trend === "up" ? "success" : product.trend === "down" ? "destructive" : "outline"}
                >
                  {product.trend === "up" ? "↑" : product.trend === "down" ? "↓" : "→"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
