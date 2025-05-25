import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SalesOverviewChart } from "@/components/sales/sales-overview-chart"
import { SalesHistoryTable } from "@/components/sales/sales-history-table"
import { SalesByProductTable } from "@/components/sales/sales-by-product-table"
import { SalesByStaffTable } from "@/components/sales/sales-by-staff-table"
import { SalesSummaryCards } from "@/components/sales/sales-summary-cards"
import { SalesFilterBar } from "@/components/sales/sales-filter-bar"

export const metadata: Metadata = {
  title: "Sales Management",
  description: "Comprehensive overview of all sales activities and performance metrics",
}

export default function SalesPage() {
  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Management</h1>
          <p className="text-muted-foreground">Track, analyze, and manage all sales activities across your business</p>
        </div>
        <SalesFilterBar />
      </div>

      <SalesSummaryCards />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">Sales History</TabsTrigger>
          <TabsTrigger value="products">By Product</TabsTrigger>
          <TabsTrigger value="staff">By Staff</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Sales Trend</CardTitle>
                <CardDescription>Daily sales performance over time</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <SalesOverviewChart />
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
                <CardDescription>Products with highest sales volume</CardDescription>
              </CardHeader>
              <CardContent>
                <SalesByProductTable limit={5} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales History</CardTitle>
              <CardDescription>Complete record of all sales transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <SalesHistoryTable />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales by Product</CardTitle>
              <CardDescription>Performance metrics for each product</CardDescription>
            </CardHeader>
            <CardContent>
              <SalesByProductTable />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="staff" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales by Staff</CardTitle>
              <CardDescription>Performance metrics for each staff member</CardDescription>
            </CardHeader>
            <CardContent>
              <SalesByStaffTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
