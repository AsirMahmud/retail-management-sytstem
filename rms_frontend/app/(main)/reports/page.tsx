"use client";

import { useState } from "react";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SalesReport } from "@/components/reports/sales-report";
import { ExpenseReport } from "@/components/reports/expense-report";
import { InventoryReport } from "@/components/reports/inventory-report";
import { CustomerReport } from "@/components/reports/customer-report";
import { CategoryReport } from "@/components/reports/category-report";
import { ProfitLossReport } from "@/components/reports/profit-loss-report";
import { ProductPerformanceReport } from "@/components/reports/product-performance-report";
import { DateRange } from "react-day-picker";
import { useOverviewReport } from "@/hooks/queries/use-reports";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { PreorderReport } from "@/components/reports/preorder-report";

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  });

  const { data: overviewData, isLoading: isLoadingOverview } =
    useOverviewReport(dateRange);

  const combinedChartData = overviewData
    ? overviewData.sales_by_date.map((sale) => {
        const expense = overviewData.expenses_by_date.find(
          (exp) => exp.date === sale.date
        );
        return {
          date: sale.date,
          sales: parseFloat(sale.total),
          expenses: expense ? parseFloat(expense.total) : 0,
        };
      })
    : [];

  const formattedDateRange = {
    from: dateRange?.from,
    to: dateRange?.to,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              {/* You can use a report icon here if you have one */}
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 4h6a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Reports & Analytics
              </h1>
              <p className="text-gray-600 mt-1">
                Visualize and analyze your retail business performance
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between space-y-2 mb-6">
          <div></div>
          <div className="flex items-center space-x-2">
            <DatePickerWithRange
              value={dateRange ?? { from: new Date(), to: new Date() }}
              onChange={setDateRange}
            />
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-8 bg-white/70 backdrop-blur-sm border border-white/20 shadow-lg rounded-xl p-1">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-lg transition-all duration-200"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="sales"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-lg transition-all duration-200"
            >
              Sales
            </TabsTrigger>
            <TabsTrigger
              value="expenses"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-lg transition-all duration-200"
            >
              Expenses
            </TabsTrigger>
            <TabsTrigger
              value="inventory"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-lg transition-all duration-200"
            >
              Inventory
            </TabsTrigger>
            <TabsTrigger
              value="customers"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-lg transition-all duration-200"
            >
              Customers
            </TabsTrigger>
            <TabsTrigger
              value="profit-loss"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-lg transition-all duration-200"
            >
              Profit & Loss
            </TabsTrigger>
            <TabsTrigger
              value="product-performance"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-lg transition-all duration-200"
            >
              Product Performance
            </TabsTrigger>
            <TabsTrigger
              value="preorder"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-lg transition-all duration-200"
            >
              Preorder Analytics
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-8">
            {isLoadingOverview ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
              </div>
            ) : overviewData ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-700">
                      Total Sales
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">
                      ${parseFloat(overviewData.total_sales).toFixed(2)}
                    </div>
                    <p className="text-xs text-blue-600 font-medium mt-1">
                      {overviewData.total_orders} orders
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-emerald-50 to-teal-100 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-700">
                      Total Expenses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">
                      ${parseFloat(overviewData.total_expenses).toFixed(2)}
                    </div>
                    <p className="text-xs text-emerald-600 font-medium mt-1">
                      from {overviewData.expenses_by_date.length} transactions
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-50 to-indigo-100 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-700">
                      Net Profit
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">
                      ${parseFloat(overviewData.net_profit).toFixed(2)}
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-orange-50 to-amber-100 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-700">
                      Profit Margin
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">
                      {parseFloat(overviewData.profit_margin).toFixed(2)}%
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : null}
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
                <CardTitle>Sales vs Expenses</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                {isLoadingOverview ? (
                  <Skeleton className="h-80" />
                ) : (
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={combinedChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="sales" stroke="#10b981" />
                      <Line
                        type="monotone"
                        dataKey="expenses"
                        stroke="#ef4444"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="sales">
            <SalesReport dateRange={formattedDateRange} />
          </TabsContent>
          <TabsContent value="expenses">
            <ExpenseReport dateRange={formattedDateRange} />
          </TabsContent>
          <TabsContent value="inventory">
            <InventoryReport />
          </TabsContent>
          <TabsContent value="customers">
            <CustomerReport dateRange={formattedDateRange} />
          </TabsContent>
          <TabsContent value="profit-loss">
            <ProfitLossReport dateRange={formattedDateRange} />
          </TabsContent>
          <TabsContent value="product-performance">
            <ProductPerformanceReport dateRange={formattedDateRange} />
          </TabsContent>
          <TabsContent value="preorder" className="space-y-8">
            <PreorderReport
              overviewData={overviewData}
              isLoading={isLoadingOverview}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
