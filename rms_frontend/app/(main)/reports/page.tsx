"use client";

import { useState, useMemo } from "react";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { OnlinePreorderAnalytics } from "@/components/reports/online-preorder-analytics";
import { Calendar, Filter, TrendingUp, TrendingDown, DollarSign, ShoppingCart, ChevronDown, ChevronUp } from "lucide-react";

// Preset filter options
const PRESET_FILTERS = [
  { label: "All Time", value: "all-time", icon: TrendingUp },
  { label: "Today", value: "today", icon: Calendar },
  { label: "This Week", value: "this-week", icon: TrendingUp },
  { label: "This Month", value: "this-month", icon: Calendar },
  { label: "This Year", value: "this-year", icon: TrendingUp },
  { label: "Last 7 Days", value: "last-7-days", icon: TrendingDown },
  { label: "Last 30 Days", value: "last-30-days", icon: TrendingDown },
  { label: "Last 90 Days", value: "last-90-days", icon: TrendingDown },
];

export default function ReportsPage() {
  const [selectedFilter, setSelectedFilter] = useState("all-time");
  const [customDateRange, setCustomDateRange] = useState<DateRange>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  });
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  // Calculate date range based on selected filter
  const dateRange = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (selectedFilter) {
      case "all-time":
        return {
          from: new Date(2020, 0, 1), // Start from 2020 or adjust as needed
          to: now,
        };
      case "today":
        return {
          from: today,
          to: today,
        };
      case "this-week":
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        return {
          from: startOfWeek,
          to: now,
        };
      case "this-month":
        return {
          from: new Date(now.getFullYear(), now.getMonth(), 1),
          to: now,
        };
      case "this-year":
        return {
          from: new Date(now.getFullYear(), 0, 1),
          to: now,
        };
      case "last-7-days":
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        return {
          from: sevenDaysAgo,
          to: now,
        };
      case "last-30-days":
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        return {
          from: thirtyDaysAgo,
          to: now,
        };
      case "last-90-days":
        const ninetyDaysAgo = new Date(today);
        ninetyDaysAgo.setDate(today.getDate() - 90);
        return {
          from: ninetyDaysAgo,
          to: now,
        };
      case "custom":
        return customDateRange;
      default:
        return {
          from: new Date(now.getFullYear(), now.getMonth(), 1),
          to: now,
        };
    }
  }, [selectedFilter, customDateRange]);

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

  // Format date range for display
  const formatDateRangeDisplay = (range: DateRange) => {
    if (!range.from) return "Select dates";
    const fromDate = range.from.toLocaleDateString();
    const toDate = range.to ? range.to.toLocaleDateString() : fromDate;
    return fromDate === toDate ? fromDate : `${fromDate} - ${toDate}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
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

        {/* Enhanced Filter System */}
        <div className="mb-8">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    Filter Reports
                  </CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  {isFilterExpanded ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      Collapse
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      Expand
                    </>
                  )}
                </Button>
              </div>
              
              {/* Current Filter Display - Always Visible */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Current Period:</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {selectedFilter === "custom" 
                      ? formatDateRangeDisplay(customDateRange)
                      : PRESET_FILTERS.find(f => f.value === selectedFilter)?.label || "All Time"
                    }
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {dateRange.from?.toLocaleDateString()} - {dateRange.to?.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardHeader>
            
            {/* Collapsible Content */}
            {isFilterExpanded && (
              <CardContent className="space-y-6 pt-0">
                {/* Preset Filters */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Filters</h3>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_FILTERS.map((filter) => {
                      const Icon = filter.icon;
                      return (
                        <Button
                          key={filter.value}
                          variant={selectedFilter === filter.value ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedFilter(filter.value)}
                          className={`transition-all duration-200 ${
                            selectedFilter === filter.value
                              ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                              : "hover:bg-blue-50 hover:border-blue-300"
                          }`}
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          {filter.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Date Range */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Custom Date Range</h3>
                  <div className="flex items-center space-x-4">
                    <DatePickerWithRange
                      value={customDateRange}
                      onChange={(range) => {
                        setCustomDateRange(range || { from: new Date(), to: new Date() });
                        setSelectedFilter("custom");
                      }}
                    />
                    {selectedFilter === "custom" && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {formatDateRangeDisplay(customDateRange)}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-9 bg-white/70 backdrop-blur-sm border border-white/20 shadow-lg rounded-xl p-1">
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
            <TabsTrigger
              value="online-preorder"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg transition-all duration-200"
            >
              Online Preorder Analytics
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
                    <DollarSign className="h-4 w-4 text-blue-600" />
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
                    <TrendingDown className="h-4 w-4 text-emerald-600" />
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
                    <TrendingUp className="h-4 w-4 text-purple-600" />
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
                    <ShoppingCart className="h-4 w-4 text-orange-600" />
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
          <TabsContent value="online-preorder" className="space-y-8">
            <OnlinePreorderAnalytics dateRange={dateRange} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
