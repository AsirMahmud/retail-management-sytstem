"use client";
import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Filter,
  Users,
  Target,
  Calendar,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import { useDashboardStats } from "@/hooks/queries/use-sales";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import type { DateRange } from "react-day-picker";

const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
];

interface SalesTrendDataPoint {
  date: string;
  sales: number;
  profit: number;
  orders: number;
}

interface PaymentMethodDataPoint {
  method: string;
  count: number;
  total: number;
}

interface SalesByHourDataPoint {
  hour: number;
  count: number;
  total: number;
}

export default function SalesOverview() {
  const [timeFilter, setTimeFilter] = useState<"7d" | "30d" | "90d">("7d");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  const {
    data: stats,
    isLoading,
    error,
  } = useDashboardStats({
    period: timeFilter,
    status: status || undefined,
    payment_method: paymentMethod || undefined,
    customer_phone: customerPhone || undefined,
    start_date: dateRange.from
      ? dateRange.from.toISOString().slice(0, 10)
      : undefined,
    end_date: dateRange.to
      ? dateRange.to.toISOString().slice(0, 10)
      : undefined,
  });

  const metrics = {
    totalRevenue: stats?.monthly.total_sales || 0,
    totalOrders: stats?.monthly.total_transactions || 0,
    totalProfit: stats?.monthly.total_profit || 0,
    totalDiscount: stats?.monthly.total_discount || 0,
    avgTransactionValue: stats?.monthly.average_transaction_value || 0,
    totalCustomers: stats?.monthly.total_customers || 0,
    todayRevenue: stats?.today.total_sales || 0,
    todayOrders: stats?.today.total_transactions || 0,
    todayProfit: stats?.today.total_profit || 0,
    todayCustomers: stats?.today.total_customers || 0,
  };

  // Format sales trend data for the chart
  const salesTrendData = useMemo<SalesTrendDataPoint[]>(() => {
    if (!stats?.sales_trend) return [];
    return stats.sales_trend.map((item) => ({
      date: item.date__date,
      sales: item.sales,
      profit: item.profit,
      orders: item.orders,
    }));
  }, [stats?.sales_trend]);

  // Format payment method distribution data
  const paymentMethodData = useMemo<PaymentMethodDataPoint[]>(() => {
    if (!stats?.payment_method_distribution) return [];
    return stats.payment_method_distribution.map((item) => ({
      method: item.payment_method,
      count: item.count,
      total: item.total,
    }));
  }, [stats?.payment_method_distribution]);

  // Format sales by hour data (filter out zero values for better visualization)
  const salesByHourData = useMemo<SalesByHourDataPoint[]>(() => {
    if (!stats?.sales_by_hour) return [];
    return stats.sales_by_hour.filter(
      (item) => item.count > 0 || item.total > 0
    );
  }, [stats?.sales_by_hour]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading sales data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600">Error loading sales data</p>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Sales Overview
            </h1>
            <p className="text-lg text-gray-600">
              Track your sales performance and key metrics
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Select
              value={timeFilter}
              onValueChange={(value: "7d" | "30d" | "90d") =>
                setTimeFilter(value)
              }
            >
              <SelectTrigger className="w-40 bg-white border-gray-200 shadow-sm">
                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="bg-white border-gray-200 shadow-sm hover:bg-gray-50"
              onClick={() => setAdvancedOpen(true)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </div>

        {/* Advanced Filter Modal */}
        <Dialog open={advancedOpen} onOpenChange={setAdvancedOpen}>
          <DialogContent className="p-6 w-full max-w-md space-y-4">
            <h2 className="text-lg font-semibold">Advanced Filters</h2>
            <div className="space-y-2">
              <label>Status</label>
              <Select
                value={status}
                onValueChange={(value) =>
                  setStatus(value === "all" ? "" : value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <label>Payment Method</label>
              <Select
                value={paymentMethod}
                onValueChange={(value) =>
                  setPaymentMethod(value === "all" ? "" : value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Methods" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="due">Due</SelectItem>
                </SelectContent>
              </Select>
              <label>Customer Phone</label>
              <Input
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Phone number"
              />
              <label>Date Range</label>
              <DatePickerWithRange value={dateRange} onChange={setDateRange} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setAdvancedOpen(false)}>
                Close
              </Button>
              <Button onClick={() => setAdvancedOpen(false)}>Apply</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">
                    Total Revenue
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    ${metrics.totalRevenue.toLocaleString()}
                  </p>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500">Monthly total</span>
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">
                    Total Orders
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {metrics.totalOrders}
                  </p>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500">Monthly total</span>
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <ShoppingCart className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">
                    Total Profit
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    ${metrics.totalProfit.toLocaleString()}
                  </p>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500">Monthly total</span>
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Target className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">
                    Avg Transaction
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    ${metrics.avgTransactionValue.toFixed(0)}
                  </p>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500">Per order</span>
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">
                    Total Customers
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {metrics.totalCustomers}
                  </p>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500">Monthly total</span>
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">
                    Total Discount
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    ${metrics.totalDiscount.toLocaleString()}
                  </p>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500">Monthly total</span>
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Package className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Products and Top Customers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-gray-900">
                Top Selling Products
              </CardTitle>
              <CardDescription className="text-gray-600">
                Best performing products this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.top_products?.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {product.product__name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {product.total_quantity} units sold
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ${product.total_revenue.toLocaleString()}
                      </p>
                      <p className="text-sm text-emerald-600">
                        ${product.total_profit.toLocaleString()} profit
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Customers */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-gray-900">
                Top Customers
              </CardTitle>
              <CardDescription className="text-gray-600">
                Highest spending customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.customer_analytics?.top_customers?.map(
                  (customer, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {customer.customer_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {customer.customer__phone}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ${customer.total_spent.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {customer.visit_count} visits
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sales Trend Chart */}
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900">
              Sales & Profit Trend
            </CardTitle>
            <CardDescription className="text-gray-600">
              Daily sales and profit performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={salesTrendData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorProfit"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                  />
                  <YAxis
                    yAxisId="left"
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tickFormatter={(value) => value.toLocaleString()}
                  />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip
                    formatter={(value: number, name: string) => {
                      if (name === "Orders") {
                        return [value.toLocaleString(), name];
                      }
                      return [`$${value.toLocaleString()}`, name];
                    }}
                    labelFormatter={(label) =>
                      new Date(label).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    }
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="sales"
                    name="Sales"
                    stroke="#6366f1"
                    fillOpacity={1}
                    fill="url(#colorSales)"
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="profit"
                    name="Profit"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorProfit)"
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="orders"
                    name="Orders"
                    stroke="#f59e0b"
                    fillOpacity={0}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method Distribution */}
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900">
              Payment Method Distribution
            </CardTitle>
            <CardDescription className="text-gray-600">
              Revenue breakdown by payment method
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="total"
                    label={({ method, total, count }) =>
                      `${method.toUpperCase()}: $${total.toLocaleString()} (${count} orders)`
                    }
                  >
                    {paymentMethodData.map((entry, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      `$${value.toLocaleString()}`,
                      "Revenue",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Customer Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">
                    New Customers Today
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats?.customer_analytics?.new_customers_today || 0}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">
                    Active Customers Today
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats?.customer_analytics?.active_customers_today || 0}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">
                    Customer Retention Rate
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats?.customer_analytics?.customer_retention_rate?.toFixed(
                      1
                    ) || 0}
                    %
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                  <Target className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
