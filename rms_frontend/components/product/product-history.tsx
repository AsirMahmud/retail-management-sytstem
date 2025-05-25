"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { Button } from "@/components/ui/button"
import { Download, BarChart3 } from "lucide-react"

interface ProductHistoryProps {
  productId?: string
  showHeader?: boolean
}

export function ProductHistory({ productId, showHeader = true }: ProductHistoryProps) {
  const [timeRange, setTimeRange] = useState("30days")
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  })

  // Mock data - in a real app, this would be fetched based on productId and date range
  const salesHistory = [
    {
      date: "2023-05-01",
      quantity: 5,
      revenue: 249.95,
      customer: "John Doe",
      discount: "0%",
      staff: "Emma Wilson",
    },
    {
      date: "2023-05-02",
      quantity: 2,
      revenue: 99.98,
      customer: "Sarah Johnson",
      discount: "10%",
      staff: "Michael Brown",
    },
    {
      date: "2023-05-03",
      quantity: 1,
      revenue: 49.99,
      customer: "Robert Smith",
      discount: "0%",
      staff: "Emma Wilson",
    },
    {
      date: "2023-05-04",
      quantity: 3,
      revenue: 149.97,
      customer: "Lisa Anderson",
      discount: "5%",
      staff: "James Taylor",
    },
    {
      date: "2023-05-05",
      quantity: 4,
      revenue: 199.96,
      customer: "David Wilson",
      discount: "0%",
      staff: "Michael Brown",
    },
  ]

  // Calculate totals
  const totalQuantity = salesHistory.reduce((sum, item) => sum + item.quantity, 0)
  const totalRevenue = salesHistory.reduce((sum, item) => sum + item.revenue, 0)

  return (
    <Card className="w-full">
      {showHeader && (
        <CardHeader>
          <CardTitle>Product Sales History</CardTitle>
          <CardDescription>View detailed sales history for this product</CardDescription>
        </CardHeader>
      )}
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>

              {timeRange === "custom" && <DateRangePicker value={dateRange} onChange={setDateRange} />}
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Chart
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Staff</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesHistory.map((sale, index) => (
                  <TableRow key={index}>
                    <TableCell>{sale.date}</TableCell>
                    <TableCell>{sale.quantity}</TableCell>
                    <TableCell>${sale.revenue.toFixed(2)}</TableCell>
                    <TableCell>{sale.customer}</TableCell>
                    <TableCell>{sale.discount}</TableCell>
                    <TableCell>{sale.staff}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-medium">
                  <TableCell>Total</TableCell>
                  <TableCell>{totalQuantity}</TableCell>
                  <TableCell>${totalRevenue.toFixed(2)}</TableCell>
                  <TableCell colSpan={3}></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
