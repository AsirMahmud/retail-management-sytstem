"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Users,
  Package,
  Truck,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  TrendingDown,
  RefreshCw,
  Calendar,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useDashboard } from "@/hooks/queries/use-dashboard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ErrorBoundary } from "@/components/error-boundary";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function DashboardContent() {
  const { data: stats, isLoading, error, refetch } = useDashboard();
  const [isClient, setIsClient] = useState(false);

  // Prevent hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-12 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-[400px]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="flex flex-col items-center space-y-4 p-8 bg-white rounded-lg shadow-lg">
          <AlertTriangle className="h-12 w-12 text-red-500" />
          <p className="text-red-500 text-lg font-medium">
            Failed to load dashboard data
          </p>
          <Button onClick={() => refetch()} variant="outline" className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!stats || !isClient) {
    return null;
  }

  // Safe data access with fallbacks
  const safeStats = {
    today: {
      sales: stats.today?.sales || 0,
      expenses: stats.today?.expenses || 0,
    },
    monthly: {
      sales: stats.monthly?.sales || 0,
      expenses: stats.monthly?.expenses || 0,
    },
    counts: {
      customers: stats.counts?.customers || 0,
      products: stats.counts?.products || 0,
      suppliers: stats.counts?.suppliers || 0,
    },
    sales_trend: Array.isArray(stats.sales_trend) ? stats.sales_trend : [],
    expense_trend: Array.isArray(stats.expense_trend)
      ? stats.expense_trend
      : [],
    top_products: Array.isArray(stats.top_products) ? stats.top_products : [],
    expense_categories: Array.isArray(stats.expense_categories)
      ? stats.expense_categories.filter((cat) => cat.amount !== null)
      : [],
    low_stock_items: Array.isArray(stats.low_stock_items)
      ? stats.low_stock_items
      : [],
    recent_suppliers: Array.isArray(stats.recent_suppliers)
      ? stats.recent_suppliers
      : [],
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <div className="max-w-7xl mx-auto p-6">
        <motion.div className="mb-8" variants={item}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Business Dashboard
                </h1>
                <p className="text-gray-600 mt-1">
                  Complete overview of your business performance
                </p>
              </div>
            </div>
            <Button
              onClick={() => refetch()}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Data
            </Button>
          </div>
        </motion.div>

        {/* Key Metrics - Today's and Monthly Overview */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={item}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Today's Sales
              </CardTitle>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {formatCurrency(safeStats.today.sales)}
              </div>
              <div className="flex items-center text-xs text-blue-600 font-medium mt-1">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span>Today's revenue</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-violet-100 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Today's Expenses
              </CardTitle>
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center">
                <TrendingDown className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {formatCurrency(safeStats.today.expenses)}
              </div>
              <div className="flex items-center text-xs text-purple-600 font-medium mt-1">
                <ArrowDownRight className="h-4 w-4 mr-1" />
                <span>Today's expenses</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-green-100 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Monthly Sales
              </CardTitle>
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {formatCurrency(safeStats.monthly.sales)}
              </div>
              <div className="flex items-center text-xs text-emerald-600 font-medium mt-1">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span>Total revenue</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-pink-100 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Monthly Expenses
              </CardTitle>
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                <TrendingDown className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {formatCurrency(safeStats.monthly.expenses)}
              </div>
              <div className="flex items-center text-xs text-red-600 font-medium mt-1">
                <ArrowDownRight className="h-4 w-4 mr-1" />
                <span>Total expenses</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Business Counts */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          variants={item}
        >
          <Card className="bg-gradient-to-br from-orange-50 to-amber-100 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Total Customers
              </CardTitle>
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {safeStats.counts.customers}
              </div>
              <div className="flex items-center text-xs text-orange-600 font-medium mt-1">
                <span>Registered customers</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-teal-50 to-cyan-100 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Total Products
              </CardTitle>
              <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center">
                <Package className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {safeStats.counts.products}
              </div>
              <div className="flex items-center text-xs text-teal-600 font-medium mt-1">
                <span>Active products</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-50 to-gray-100 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Total Suppliers
              </CardTitle>
              <div className="w-10 h-10 bg-gradient-to-r from-slate-500 to-gray-500 rounded-full flex items-center justify-center">
                <Truck className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {safeStats.counts.suppliers}
              </div>
              <div className="flex items-center text-xs text-slate-600 font-medium mt-1">
                <span>Active suppliers</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts Row 1 - Sales vs Expenses */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
          variants={item}
        >
          {/* Sales Trend */}
          <Card className="border-0 shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-900">
                    Sales Trend
                  </CardTitle>
                  <CardDescription>Daily sales over time</CardDescription>
                </div>
                <Calendar className="h-5 w-5 text-slate-400" />
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[300px]">
                {safeStats.sales_trend.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={safeStats.sales_trend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis
                        dataKey="date__date"
                        stroke="#64748b"
                        fontSize={12}
                        tickFormatter={(value) =>
                          value
                            ? new Date(value).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })
                            : ""
                        }
                      />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip
                        formatter={(value) => [
                          formatCurrency(value as number),
                          "Sales",
                        ]}
                        labelFormatter={(label) =>
                          label ? new Date(label).toLocaleDateString() : ""
                        }
                        contentStyle={{
                          backgroundColor: "white",
                          border: "none",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                      />
                      <Bar
                        dataKey="total"
                        fill="#3b82f6"
                        name="Sales"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No sales data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Expense Trend */}
          <Card className="border-0 shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-900">
                    Expense Trend
                  </CardTitle>
                  <CardDescription>Daily expenses over time</CardDescription>
                </div>
                <TrendingDown className="h-5 w-5 text-red-400" />
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[300px]">
                {safeStats.expense_trend.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={safeStats.expense_trend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis
                        dataKey="date"
                        stroke="#64748b"
                        fontSize={12}
                        tickFormatter={(value) =>
                          value
                            ? new Date(value).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })
                            : ""
                        }
                      />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip
                        formatter={(value) => formatCurrency(value as number)}
                        labelFormatter={(label) =>
                          label ? new Date(label).toLocaleDateString() : ""
                        }
                        contentStyle={{
                          backgroundColor: "white",
                          border: "none",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                        activeDot={{
                          r: 6,
                          stroke: "#ef4444",
                          strokeWidth: 2,
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No expense data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts Row 2 */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8"
          variants={item}
        >
          {/* Top Products */}
          <Card className="border-0 shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-900">
                    Top Products
                  </CardTitle>
                  <CardDescription>
                    Best selling products by quantity
                  </CardDescription>
                </div>
                <ShoppingCart className="h-5 w-5 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[300px]">
                {safeStats.top_products.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={safeStats.top_products}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis
                        dataKey="name"
                        stroke="#64748b"
                        fontSize={12}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip
                        formatter={(value, name) => [
                          value,
                          name === "total_sales" ? "Units Sold" : name,
                        ]}
                        contentStyle={{
                          backgroundColor: "white",
                          border: "none",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                      />
                      <Bar
                        dataKey="total_sales"
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                        name="Units Sold"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No product data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Expense Categories */}
          <Card className="border-0 shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-900">
                    Expense Categories
                  </CardTitle>
                  <CardDescription>
                    Expense distribution by category
                  </CardDescription>
                </div>
                <TrendingDown className="h-5 w-5 text-red-400" />
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[300px]">
                {safeStats.expense_categories.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={safeStats.expense_categories.slice(0, 6)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="amount"
                        label={({ name, percent }) =>
                          `${
                            name.length > 10
                              ? name.substring(0, 10) + "..."
                              : name
                          } ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {safeStats.expense_categories
                          .slice(0, 6)
                          .map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => formatCurrency(value as number)}
                        contentStyle={{
                          backgroundColor: "white",
                          border: "none",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No expense categories available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Low Stock Items */}
          <Card className="border-0 shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-900">
                    Low Stock Alert
                  </CardTitle>
                  <CardDescription>
                    Products that need restocking
                  </CardDescription>
                </div>
                <AlertTriangle className="h-5 w-5 text-orange-400" />
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4 max-h-[250px] overflow-y-auto">
                {safeStats.low_stock_items.length > 0 ? (
                  safeStats.low_stock_items.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-sm text-red-600">
                            Only {item.stock_quantity} units left
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 flex-shrink-0">
                        Min: {item.minimum_stock}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    No low stock items
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Suppliers */}
        <motion.div variants={item}>
          <Card className="border-0 shadow-lg overflow-hidden hover:shadow-xl transition-shadow mb-8">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-900">
                    Active Suppliers
                  </CardTitle>
                  <CardDescription>Your current suppliers</CardDescription>
                </div>
                <Truck className="h-5 w-5 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {safeStats.recent_suppliers.length > 0 ? (
                  safeStats.recent_suppliers.map((supplier, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Truck className="h-5 w-5 text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {supplier.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {supplier.phone}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 space-y-1">
                        <p className="text-sm text-gray-600 truncate">
                          <span className="font-medium">Email:</span>{" "}
                          {supplier.email}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          <span className="font-medium">Address:</span>{" "}
                          {supplier.address}
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8 col-span-full">
                    No suppliers available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  return (
    <ErrorBoundary>
      <DashboardContent />
    </ErrorBoundary>
  );
}
