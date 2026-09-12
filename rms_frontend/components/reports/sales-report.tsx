"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSalesReport } from "@/hooks/queries/use-reports";
import { DateRange } from "react-day-picker";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, ShoppingCart, Tag, CreditCard, TrendingUp } from "lucide-react";

const MODERN_COLORS = [
  "#6366F1",
  "#06B6D4",
  "#10B981",
  "#F59E0B",
  "#EC4899",
  "#8B5CF6",
  "#3B82F6",
];

export function SalesReport({
  dateRange,
}: {
  dateRange: { from: Date | undefined; to: Date | undefined };
}) {
  const { data: salesData, isLoading } = useSalesReport(dateRange);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="rounded-2xl border border-slate-100 shadow-sm p-4">
              <Skeleton className="h-4 w-[100px] mb-3" />
              <Skeleton className="h-8 w-[120px] mb-2" />
              <Skeleton className="h-3 w-[80px]" />
            </Card>
          ))}
        </div>
        <Card className="rounded-2xl border border-slate-100 shadow-sm p-6">
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </Card>
      </div>
    );
  }

  if (!salesData) return null;

  const totalCategorySales = salesData.sales_by_category.reduce(
    (acc, curr) => acc + parseFloat(curr.total || "0"),
    0
  );

  return (
    <div className="space-y-6">
      {/* Modern Executive Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
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
              ${parseFloat(salesData.total_sales).toFixed(2)}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Across {salesData.total_orders} completed orders
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-white border border-slate-100/80 shadow-md hover:shadow-lg transition-all rounded-2xl">
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4 sm:px-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Average Order Value
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-5 pb-4">
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              ${parseFloat(salesData.average_order_value).toFixed(2)}
            </div>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">
              {salesData.total_items_sold} items sold in total
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-white border border-slate-100/80 shadow-md hover:shadow-lg transition-all rounded-2xl">
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4 sm:px-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Average Item Price
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-sm">
              <Tag className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-5 pb-4">
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              ${parseFloat(salesData.average_item_price).toFixed(2)}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Per item sold across catalog
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trend" className="space-y-4">
        <TabsList className="bg-slate-100/80 p-1 rounded-xl border border-slate-200/80 text-xs sm:text-sm">
          <TabsTrigger value="trend" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm">Sales Trend</TabsTrigger>
          <TabsTrigger value="categories" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm">By Category</TabsTrigger>
          <TabsTrigger value="products" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm">Top Products</TabsTrigger>
          <TabsTrigger value="payments" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm">Payment Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="trend">
          <Card className="border border-slate-100/80 shadow-md bg-white rounded-2xl overflow-hidden">
            <CardHeader className="p-5 border-b border-slate-100">
              <CardTitle className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
                Sales Trend Over Time
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="h-[300px] sm:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData.sales_by_date}>
                    <defs>
                      <linearGradient id="salesTrendGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-slate-900/90 text-white px-3.5 py-2.5 rounded-xl shadow-xl backdrop-blur-md text-xs border border-slate-800">
                              <p className="font-semibold text-slate-300 mb-1">{label}</p>
                              <p className="font-bold text-indigo-400">
                                Sales: ${parseFloat(String(payload[0].value)).toFixed(2)}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey={(data) => parseFloat(data.total)}
                      stroke="#6366F1"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#salesTrendGrad)"
                      name="Sales"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border border-slate-100/80 shadow-md bg-white rounded-2xl overflow-hidden">
              <CardHeader className="p-5 border-b border-slate-100">
                <CardTitle className="text-base font-bold text-slate-900">Sales by Category</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="h-[280px] relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0];
                            const val = parseFloat(String(data.value));
                            const pct = totalCategorySales > 0 ? ((val / totalCategorySales) * 100).toFixed(1) : 0;
                            return (
                              <div className="bg-slate-900/90 text-white px-3.5 py-2 rounded-xl shadow-xl backdrop-blur-md text-xs border border-slate-800">
                                <p className="font-semibold text-slate-300">{data.name}</p>
                                <p className="font-bold text-indigo-400 mt-1">${val.toFixed(2)}</p>
                                <p className="text-[11px] text-slate-400">{pct}% of total</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Pie
                        data={salesData.sales_by_category}
                        cx="50%"
                        cy="50%"
                        innerRadius="65%"
                        outerRadius="88%"
                        paddingAngle={3}
                        cornerRadius={5}
                        dataKey={(data) => parseFloat(data.total)}
                        nameKey="category_name"
                      >
                        {salesData.sales_by_category.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={MODERN_COLORS[index % MODERN_COLORS.length]}
                            stroke="transparent"
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Total</span>
                    <span className="text-lg font-bold text-slate-900">
                      ${totalCategorySales.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-100/80 shadow-md bg-white rounded-2xl overflow-hidden">
              <CardHeader className="p-5 border-b border-slate-100">
                <CardTitle className="text-base font-bold text-slate-900">Category Details</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50">
                      <TableHead className="text-xs">Category</TableHead>
                      <TableHead className="text-right text-xs">Sales</TableHead>
                      <TableHead className="text-right text-xs">Items</TableHead>
                      <TableHead className="text-right text-xs">Quantity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salesData.sales_by_category.map((category, idx) => (
                      <TableRow key={category.category_name} className="hover:bg-slate-50/80">
                        <TableCell className="text-xs font-medium flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                            style={{ backgroundColor: MODERN_COLORS[idx % MODERN_COLORS.length] }}
                          />
                          {category.category_name}
                        </TableCell>
                        <TableCell className="text-right text-xs font-semibold text-slate-900">
                          ${parseFloat(category.total).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right text-xs text-slate-500">
                          {category.items_count}
                        </TableCell>
                        <TableCell className="text-right text-xs text-slate-500">
                          {category.quantity_sold}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Sales</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Avg. Price</TableHead>
                    <TableHead className="text-right">Profit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesData.top_products.map((product) => (
                    <TableRow key={product.product_name}>
                      <TableCell>{product.product_name}</TableCell>
                      <TableCell>{product.category_name}</TableCell>
                      <TableCell className="text-right">
                        ${parseFloat(product.total_sales).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        {product.quantity_sold}
                      </TableCell>
                      <TableCell className="text-right">
                        ${parseFloat(product.average_price).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        ${parseFloat(product.profit).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border border-slate-100/80 shadow-md bg-white rounded-2xl overflow-hidden">
              <CardHeader className="p-5 border-b border-slate-100">
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                  Payment Methods Volume
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData.payment_methods}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="payment_method" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-slate-900/90 text-white px-3.5 py-2 rounded-xl shadow-xl backdrop-blur-md text-xs border border-slate-800">
                                <p className="font-semibold text-slate-300 mb-1">{label}</p>
                                <p className="font-bold text-indigo-400">
                                  ${parseFloat(String(payload[0].value)).toFixed(2)}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar
                        dataKey={(data) => parseFloat(data.total)}
                        fill="#6366F1"
                        radius={[6, 6, 0, 0]}
                        name="Total Sales"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-100/80 shadow-md bg-white rounded-2xl overflow-hidden">
              <CardHeader className="p-5 border-b border-slate-100">
                <CardTitle className="text-base font-bold text-slate-900">Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50">
                      <TableHead className="text-xs">Method</TableHead>
                      <TableHead className="text-right text-xs">Total</TableHead>
                      <TableHead className="text-right text-xs">Orders</TableHead>
                      <TableHead className="text-right text-xs">Items</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salesData.payment_methods.map((method) => (
                      <TableRow key={method.payment_method} className="hover:bg-slate-50/80">
                        <TableCell className="text-xs font-medium capitalize">{method.payment_method}</TableCell>
                        <TableCell className="text-right text-xs font-semibold text-slate-900">
                          ${parseFloat(method.total).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right text-xs text-slate-500">
                          {method.orders_count}
                        </TableCell>
                        <TableCell className="text-right text-xs text-slate-500">
                          {method.items_count}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
