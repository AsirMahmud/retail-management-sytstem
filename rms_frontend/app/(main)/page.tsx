"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardStats } from "@/hooks/queries/use-sales";
import { formatCurrency } from "@/lib/utils";
import {
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Users,
  AlertTriangle,
  BarChart3,
  LineChart,
  PieChart,
  Clock,
  CreditCard,
  UserPlus,
  Percent,
} from "lucide-react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { DashboardStats } from "@/types/dashboard";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

export default function Home() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Today's Sales",
      value: formatCurrency(stats?.today.total_sales || 0),
      subtitle: `${stats?.today.total_transactions} transactions`,
      icon: DollarSign,
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient: "from-emerald-50 to-emerald-100",
      change: "+12.5%",
      isPositive: true,
    },
    {
      title: "Today's Profit",
      value: formatCurrency(stats?.today.total_profit || 0),
      subtitle: `Loss: ${formatCurrency(stats?.today.total_loss || 0)}`,
      icon: TrendingUp,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
      change: "+8.2%",
      isPositive: true,
    },
    {
      title: "Today's Customers",
      value: stats?.today.total_customers || 0,
      subtitle: `${stats?.customer_analytics.new_customers_today} new customers`,
      icon: Users,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
      change: `${stats?.customer_analytics.customer_retention_rate.toFixed(
        1
      )}% retention`,
      isPositive: true,
    },
    {
      title: "Average Transaction",
      value: formatCurrency(stats?.today.average_transaction_value || 0),
      subtitle: `${stats?.today.total_discount} total discount`,
      icon: CreditCard,
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-50 to-orange-100",
      change: "+5.3%",
      isPositive: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Welcome back! Here's what's happening with your business today.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live data</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => (
            <Card
              key={index}
              className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-50`}
              ></div>
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  {card.title}
                </CardTitle>
                <div
                  className={`p-2 rounded-lg bg-gradient-to-r ${card.gradient}`}
                >
                  <card.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  {card.value}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-600">{card.subtitle}</p>
                  <div className="flex items-center space-x-1">
                    {card.isPositive ? (
                      <ArrowUpRight className="h-3 w-3 text-green-600" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-red-600" />
                    )}
                    <span
                      className={`text-xs font-medium ${
                        card.isPositive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {card.change}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sales Trend Chart */}
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Sales Trend
                </CardTitle>
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <div className="flex items-center space-x-1">
                    <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                    <span>Sales</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="h-2 w-2 bg-emerald-500 rounded-full"></div>
                    <span>Profit</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-600">Last 7 days performance</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={stats?.sales_trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="date__date"
                      tickFormatter={(date) =>
                        new Date(date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      }
                      stroke="#64748b"
                      fontSize={12}
                    />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip
                      formatter={(value) => formatCurrency(value as number)}
                      labelFormatter={(date) =>
                        new Date(date).toLocaleDateString()
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
                      dataKey="sales"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      name="Sales"
                      dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="profit"
                      stroke="#10b981"
                      strokeWidth={3}
                      name="Profit"
                      dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2 }}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Sales by Hour */}
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
              <CardTitle className="text-lg font-semibold text-slate-900">
                Sales by Hour
              </CardTitle>
              <p className="text-sm text-slate-600">
                Today's sales distribution by hour
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats?.sales_by_hour}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="hour"
                      tickFormatter={(hour) => `${hour}:00`}
                      stroke="#64748b"
                      fontSize={12}
                    />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip
                      formatter={(value) => formatCurrency(value as number)}
                      labelFormatter={(hour) => `${hour}:00`}
                      contentStyle={{
                        backgroundColor: "white",
                        border: "none",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Method Distribution */}
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
              <CardTitle className="text-lg font-semibold text-slate-900">
                Payment Methods
              </CardTitle>
              <p className="text-sm text-slate-600">
                Distribution by payment method
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={stats?.payment_method_distribution}
                      dataKey="total"
                      nameKey="payment_method"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({
                        cx,
                        cy,
                        midAngle,
                        innerRadius,
                        outerRadius,
                        value,
                        index,
                      }) => {
                        const RADIAN = Math.PI / 180;
                        const radius =
                          25 + innerRadius + (outerRadius - innerRadius);
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);

                        return (
                          <text
                            x={x}
                            y={y}
                            fill="#64748b"
                            textAnchor={x > cx ? "start" : "end"}
                            dominantBaseline="central"
                            className="text-xs"
                          >
                            {
                              stats?.payment_method_distribution[index]
                                .payment_method
                            }{" "}
                            ({formatCurrency(value)})
                          </text>
                        );
                      }}
                    >
                      {stats?.payment_method_distribution.map(
                        (entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        )
                      )}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatCurrency(value as number)}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Top Customers */}
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
              <CardTitle className="text-lg font-semibold text-slate-900">
                Top Customers
              </CardTitle>
              <p className="text-sm text-slate-600">
                Best performing customers this month
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {stats?.customer_analytics.top_customers.map(
                  (customer, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl hover:from-slate-100 hover:to-slate-200 transition-all duration-200"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg">
                            <Users className="h-4 w-4 text-white" />
                          </div>
                          <div className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {customer.customer__name || "Anonymous"}
                          </p>
                          <p className="text-xs text-slate-600">
                            {customer.visit_count} visits
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-slate-900">
                          {formatCurrency(customer.total_spent)}
                        </div>
                        <div className="text-xs text-slate-600">
                          {customer.customer__phone}
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rest of the existing components... */}
        {/* (Keep the existing inventory status, category distribution, etc.) */}
      </div>
    </div>
  );
}
