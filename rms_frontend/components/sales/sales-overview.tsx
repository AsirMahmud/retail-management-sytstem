"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  Filter,
  Users,
  Target,
  Calendar,
  ArrowUpRight,
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

// Sample data based on your JSON structure
const salesData = [
  {
    id: 24,
    invoice_number: "INV-C53D6D8A",
    customer: {
      id: 6,
      first_name: "asdfs",
      phone: "0124464664",
    },
    date: "2025-05-31T13:17:33.970571Z",
    subtotal: "2000.00",
    tax: "165.00",
    total: "2165.00",
    payment_method: "cash",
    status: "completed",
    items: [
      {
        product: {
          name: "Mereclrene",
          category_name: "Shirt",
        },
        quantity: 1,
        profit: "1000.00",
      },
    ],
  },
  {
    id: 23,
    invoice_number: "INV-40FFAB25",
    customer: {
      id: 6,
      first_name: "asdfs",
      phone: "0124464664",
    },
    date: "2025-05-31T12:46:50.425063Z",
    subtotal: "49.99",
    tax: "4.12",
    total: "54.11",
    payment_method: "cash",
    status: "completed",
    items: [
      {
        product: {
          name: "Classic Oxford Shirt",
          category_name: "Pant",
        },
        quantity: 1,
        profit: "20.00",
      },
    ],
  },
  {
    id: 17,
    invoice_number: "INV-1605A9C0",
    customer: {
      id: 6,
      first_name: "asdfs",
      phone: "0124464664",
    },
    date: "2025-05-31T12:37:43.598005Z",
    subtotal: "6199.96",
    tax: "511.50",
    total: "6711.46",
    payment_method: "cash",
    status: "completed",
    items: [
      {
        product: {
          name: "Classic Oxford Shirt",
          category_name: "Pant",
        },
        quantity: 2,
        profit: "40.00",
      },
      {
        product: {
          name: "Denim Jacket",
          category_name: "Shirt",
        },
        quantity: 3,
        profit: "3000.00",
      },
    ],
  },
];

const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
];

export default function SalesOverview() {
  const [timeFilter, setTimeFilter] = useState("7d");
  const [statusFilter, setStatusFilter] = useState("all");

  const metrics = useMemo(() => {
    const completedSales = salesData.filter(
      (sale) => sale.status === "completed"
    );
    const totalRevenue = completedSales.reduce(
      (sum, sale) => sum + Number.parseFloat(sale.total),
      0
    );
    const totalProfit = completedSales.reduce((sum, sale) => {
      return (
        sum +
        sale.items.reduce(
          (itemSum, item) => itemSum + Number.parseFloat(item.profit || "0"),
          0
        )
      );
    }, 0);
    const totalOrders = completedSales.length;
    const uniqueCustomers = new Set(
      completedSales.map((sale) => sale.customer?.id).filter(Boolean)
    ).size;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalRevenue,
      totalProfit,
      totalOrders,
      uniqueCustomers,
      avgOrderValue,
      profitMargin: totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0,
    };
  }, []);

  const dailySalesData = useMemo(() => {
    const salesByDate = salesData.reduce((acc, sale) => {
      const date = new Date(sale.date).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { date, revenue: 0, orders: 0, profit: 0 };
      }
      if (sale.status === "completed") {
        acc[date].revenue += Number.parseFloat(sale.total);
        acc[date].orders += 1;
        acc[date].profit += sale.items.reduce(
          (sum, item) => sum + Number.parseFloat(item.profit || "0"),
          0
        );
      }
      return acc;
    }, {} as Record<string, any>);

    return Object.values(salesByDate).slice(-7);
  }, []);

  const categoryData = useMemo(() => {
    const categoryStats = salesData.reduce((acc, sale) => {
      if (sale.status === "completed") {
        sale.items.forEach((item) => {
          const category = item.product.category_name;
          if (!acc[category]) {
            acc[category] = { name: category, value: 0, revenue: 0 };
          }
          acc[category].value += item.quantity;
          acc[category].revenue +=
            Number.parseFloat(sale.total) / sale.items.length;
        });
      }
      return acc;
    }, {} as Record<string, any>);

    return Object.values(categoryStats);
  }, []);

  const paymentMethodData = useMemo(() => {
    const methodStats = salesData.reduce((acc, sale) => {
      if (sale.status === "completed") {
        const method = sale.payment_method;
        if (!acc[method]) {
          acc[method] = { name: method, value: 0 };
        }
        acc[method].value += 1;
      }
      return acc;
    }, {} as Record<string, any>);

    return Object.values(methodStats);
  }, []);

  const topProducts = useMemo(() => {
    const productStats = salesData.reduce((acc, sale) => {
      if (sale.status === "completed") {
        sale.items.forEach((item) => {
          const productName = item.product.name;
          if (!acc[productName]) {
            acc[productName] = { name: productName, quantity: 0, revenue: 0 };
          }
          acc[productName].quantity += item.quantity;
          acc[productName].revenue +=
            Number.parseFloat(sale.total) / sale.items.length;
        });
      }
      return acc;
    }, {} as Record<string, any>);

    return Object.values(productStats)
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 5);
  }, []);

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
            <Select value={timeFilter} onValueChange={setTimeFilter}>
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
            >
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </div>

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
                    <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                    <span className="text-emerald-600 font-medium">+12.5%</span>
                    <span className="text-gray-500 ml-1">vs last period</span>
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
                    <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
                    <span className="text-blue-600 font-medium">+8.2%</span>
                    <span className="text-gray-500 ml-1">vs last period</span>
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
                    Avg Order Value
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    ${metrics.avgOrderValue.toFixed(2)}
                  </p>
                  <div className="flex items-center text-sm">
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    <span className="text-red-600 font-medium">-2.1%</span>
                    <span className="text-gray-500 ml-1">vs last period</span>
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Package className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">
                    Profit Margin
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {metrics.profitMargin.toFixed(1)}%
                  </p>
                  <div className="flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 text-orange-500 mr-1" />
                    <span className="text-orange-600 font-medium">+3.4%</span>
                    <span className="text-gray-500 ml-1">vs last period</span>
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Target className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Daily Sales Trend */}
          <Card className="xl:col-span-2 bg-white border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Sales Trend
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Revenue performance over time
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={dailySalesData}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#6366f1"
                    strokeWidth={3}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Performance */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-gray-900">
                Category Split
              </CardTitle>
              <CardDescription className="text-gray-600">
                Revenue by product category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="revenue"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {categoryData.map((category: any, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                      <span className="text-sm text-gray-600">
                        {category.name}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      ${category.revenue.toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Top Products */}
          <Card className="xl:col-span-2 bg-white border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Top Products
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Best performing products by revenue
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700"
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product: any, index) => (
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
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {product.quantity} units sold
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ${product.revenue.toFixed(2)}
                      </p>
                      <p className="text-sm text-green-600">Revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-gray-900">
                Quick Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Unique Customers</p>
                      <p className="text-xl font-bold text-gray-900">
                        {metrics.uniqueCustomers}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <DollarSign className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Profit</p>
                      <p className="text-xl font-bold text-gray-900">
                        ${metrics.totalProfit.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Order Status</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Completed</span>
                      <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                        {
                          salesData.filter((s) => s.status === "completed")
                            .length
                        }
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Pending</span>
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        {salesData.filter((s) => s.status === "pending").length}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">
                    Payment Methods
                  </h4>
                  <div className="space-y-2">
                    {paymentMethodData.map((method: any, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm text-gray-600 capitalize">
                          {method.name}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {method.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
