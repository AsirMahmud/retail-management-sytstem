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
  AreaChart,
  Area,
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
      <div className="max-w-7xl mx-auto p-2 sm:p-4 md:p-6 min-w-0">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shrink-0">
              <svg
                className="h-5 w-5 sm:h-6 sm:w-6 text-white"
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
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Reports & Analytics
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Visualize and analyze your retail business performance
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Filter System */}
        <div className="mb-6 sm:mb-8">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-base sm:text-lg font-semibold text-gray-800">
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 gap-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs sm:text-sm text-gray-600">Current Period:</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                    {selectedFilter === "custom" 
                      ? formatDateRangeDisplay(customDateRange)
                      : PRESET_FILTERS.find(f => f.value === selectedFilter)?.label || "All Time"
                    }
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
                  <Calendar className="h-4 w-4 shrink-0" />
                  <span className="break-all sm:break-normal">
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
                  <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-3">Quick Filters</h3>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_FILTERS.map((filter) => {
                      const Icon = filter.icon;
                      return (
                        <Button
                          key={filter.value}
                          variant={selectedFilter === filter.value ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedFilter(filter.value)}
                          className={`transition-all duration-200 text-xs sm:text-sm ${
                            selectedFilter === filter.value
                              ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                              : "hover:bg-blue-50 hover:border-blue-300"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                          {filter.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Date Range */}
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-3">Custom Date Range</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <DatePickerWithRange
                      value={customDateRange}
                      onChange={(range) => {
                        setCustomDateRange(range || { from: new Date(), to: new Date() });
                        setSelectedFilter("custom");
                      }}
                    />
                    {selectedFilter === "custom" && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 w-fit">
                        {formatDateRangeDisplay(customDateRange)}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6 sm:space-y-8">
          <TabsList className="flex items-center w-full overflow-x-auto no-scrollbar justify-start space-x-1 sm:grid sm:grid-cols-9 sm:space-x-0 bg-white/70 backdrop-blur-sm border border-white/20 shadow-lg rounded-xl p-1 min-w-0">
            <TabsTrigger
              value="overview"
              className="shrink-0 whitespace-nowrap px-3 py-1.5 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-lg transition-all duration-200"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="sales"
              className="shrink-0 whitespace-nowrap px-3 py-1.5 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-lg transition-all duration-200"
            >
              Sales
            </TabsTrigger>
            <TabsTrigger
              value="expenses"
              className="shrink-0 whitespace-nowrap px-3 py-1.5 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-lg transition-all duration-200"
            >
              Expenses
            </TabsTrigger>
            <TabsTrigger
              value="inventory"
              className="shrink-0 whitespace-nowrap px-3 py-1.5 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-lg transition-all duration-200"
            >
              Inventory
            </TabsTrigger>
            <TabsTrigger
              value="customers"
              className="shrink-0 whitespace-nowrap px-3 py-1.5 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-lg transition-all duration-200"
            >
              Customers
            </TabsTrigger>
            <TabsTrigger
              value="profit-loss"
              className="shrink-0 whitespace-nowrap px-3 py-1.5 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-lg transition-all duration-200"
            >
              Profit & Loss
            </TabsTrigger>
            <TabsTrigger
              value="product-performance"
              className="shrink-0 whitespace-nowrap px-3 py-1.5 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-lg transition-all duration-200"
            >
              Product Performance
            </TabsTrigger>
            <TabsTrigger
              value="preorder"
              className="shrink-0 whitespace-nowrap px-3 py-1.5 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-lg transition-all duration-200"
            >
              Preorder Analytics
            </TabsTrigger>
            <TabsTrigger
              value="online-preorder"
              className="shrink-0 whitespace-nowrap px-3 py-1.5 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg transition-all duration-200"
            >
              Online Preorders
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-6">
            {isLoadingOverview ? (
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-28 rounded-2xl" />
                <Skeleton className="h-28 rounded-2xl" />
                <Skeleton className="h-28 rounded-2xl" />
                <Skeleton className="h-28 rounded-2xl" />
              </div>
            ) : overviewData ? (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="relative overflow-hidden bg-white border border-slate-100/80 shadow-md hover:shadow-lg transition-all rounded-2xl">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500" />
                  <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4 sm:px-5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Total Sales
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 sm:px-5 pb-4">
                    <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      ${parseFloat(overviewData.total_sales).toFixed(2)}
                    </div>
                    <p className="text-[11px] text-indigo-600 font-medium mt-1">
                      {overviewData.total_orders} orders recorded
                    </p>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden bg-white border border-slate-100/80 shadow-md hover:shadow-lg transition-all rounded-2xl">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-rose-500" />
                  <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4 sm:px-5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Total Expenses
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-sm">
                      <TrendingDown className="w-4 h-4" />
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 sm:px-5 pb-4">
                    <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      ${parseFloat(overviewData.total_expenses).toFixed(2)}
                    </div>
                    <p className="text-[11px] text-rose-600 font-medium mt-1">
                      From {overviewData.expenses_by_date.length} transactions
                    </p>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden bg-white border border-slate-100/80 shadow-md hover:shadow-lg transition-all rounded-2xl">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />
                  <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4 sm:px-5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Net Profit
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 sm:px-5 pb-4">
                    <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      ${parseFloat(overviewData.net_profit).toFixed(2)}
                    </div>
                    <p className="text-[11px] text-emerald-600 font-medium mt-1">
                      After all operating costs
                    </p>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden bg-white border border-slate-100/80 shadow-md hover:shadow-lg transition-all rounded-2xl">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
                  <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4 sm:px-5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Profit Margin
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-sm">
                      <ShoppingCart className="w-4 h-4" />
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 sm:px-5 pb-4">
                    <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      {parseFloat(overviewData.profit_margin).toFixed(2)}%
                    </div>
                    <p className="text-[11px] text-amber-600 font-medium mt-1">
                      Return on revenue
                    </p>
                  </CardContent>
                </Card>
              </div>
            ) : null}

            <Card className="border border-slate-100/80 shadow-md bg-white rounded-2xl overflow-hidden">
              <CardHeader className="p-5 border-b border-slate-100 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    Sales vs Expenses
                  </CardTitle>
                  <p className="text-xs text-slate-400 mt-0.5">Revenue inflows compared against expenditures</p>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-emerald-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Sales
                  </span>
                  <span className="flex items-center gap-1.5 text-rose-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Expenses
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {isLoadingOverview ? (
                  <Skeleton className="h-80 rounded-xl" />
                ) : (
                  <div className="h-[320px] sm:h-[380px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={combinedChartData}>
                        <defs>
                          <linearGradient id="repSalesGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                          </linearGradient>
                          <linearGradient id="repExpGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
                        <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                        <Tooltip
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-slate-900/90 text-white px-3.5 py-2.5 rounded-xl shadow-xl backdrop-blur-md text-xs border border-slate-800 space-y-1">
                                  <p className="font-semibold text-slate-300 mb-1">{label}</p>
                                  {payload.map((p: any, idx: number) => (
                                    <p key={idx} className="flex items-center gap-2">
                                      <span
                                        className="w-2 h-2 rounded-full inline-block"
                                        style={{ backgroundColor: p.stroke || p.color }}
                                      />
                                      <span className="text-slate-400 capitalize">{p.name}:</span>
                                      <span className="font-bold text-white">${Number(p.value).toFixed(2)}</span>
                                    </p>
                                  ))}
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="sales"
                          stroke="#10B981"
                          strokeWidth={2.5}
                          fillOpacity={1}
                          fill="url(#repSalesGrad)"
                          name="Sales"
                        />
                        <Area
                          type="monotone"
                          dataKey="expenses"
                          stroke="#F43F5E"
                          strokeWidth={2.5}
                          fillOpacity={1}
                          fill="url(#repExpGrad)"
                          name="Expenses"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
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
