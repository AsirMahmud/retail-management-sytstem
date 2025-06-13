"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { SalesReport } from "@/components/reports/sales-report";
import { ExpenseReport } from "@/components/reports/expense-report";
import { InventoryReport } from "@/components/reports/inventory-report";
import { CustomerReport } from "@/components/reports/customer-report";
import { CategoryReport } from "@/components/reports/category-report";
import { ProfitLossReport } from "@/components/reports/profit-loss-report";
import { ProductPerformanceReport } from "@/components/reports/product-performance-report";
import {
  useSalesReport,
  useExpenseReport,
  useInventoryReport,
  useCustomerReport,
  useCategoryReport,
  useProfitLossReport,
  useProductPerformanceReport,
} from "@/hooks/queries/use-reports";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setDate(1)), // First day of current month
    to: new Date(),
  });

  const { data: salesData, isLoading: isSalesLoading } =
    useSalesReport(dateRange);
  const { data: expenseData, isLoading: isExpenseLoading } =
    useExpenseReport(dateRange);
  const { data: inventoryData, isLoading: isInventoryLoading } =
    useInventoryReport();
  const { data: customerData, isLoading: isCustomerLoading } =
    useCustomerReport(dateRange);
  const { data: categoryData, isLoading: isCategoryLoading } =
    useCategoryReport();
  const { data: profitLossData, isLoading: isProfitLossLoading } =
    useProfitLossReport(dateRange);
  const {
    data: productPerformanceData,
    isLoading: isProductPerformanceLoading,
  } = useProductPerformanceReport(dateRange);

  const isLoading =
    isSalesLoading ||
    isExpenseLoading ||
    isInventoryLoading ||
    isCustomerLoading ||
    isCategoryLoading ||
    isProfitLossLoading ||
    isProductPerformanceLoading;

  const formattedDateRange = {
    from: dateRange.from,
    to: dateRange.to || dateRange.from,
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reports</h1>
        <DatePickerWithRange value={dateRange} onChange={setDateRange} />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="profit-loss">Profit & Loss</TabsTrigger>
          <TabsTrigger value="product-performance">
            Product Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
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
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Sales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${salesData?.total_sales.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {salesData?.total_orders} orders
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Expenses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${expenseData?.total_expenses.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {expenseData?.expenses_by_category.length} categories
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Net Profit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${profitLossData?.net_profit.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {profitLossData?.profit_margin.toFixed(1)}% margin
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {inventoryData?.total_products}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {inventoryData?.low_stock_items.length} low in stock
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="sales">
          <SalesReport dateRange={formattedDateRange} />
        </TabsContent>

        <TabsContent value="expenses">
          <ExpenseReport dateRange={formattedDateRange} />
        </TabsContent>

        <TabsContent value="inventory">
          <InventoryReport dateRange={formattedDateRange} />
        </TabsContent>

        <TabsContent value="customers">
          <CustomerReport dateRange={formattedDateRange} />
        </TabsContent>

        <TabsContent value="categories">
          <CategoryReport dateRange={formattedDateRange} />
        </TabsContent>

        <TabsContent value="profit-loss">
          <ProfitLossReport dateRange={formattedDateRange} />
        </TabsContent>

        <TabsContent value="product-performance">
          <ProductPerformanceReport dateRange={formattedDateRange} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
