import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  ShoppingCart,
  BarChart3,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Activity,
  Target,
  Zap,
  Clock,
  Users,
  Award,
} from "lucide-react";
import { productsApi, type ProductAnalytics } from "@/lib/api/inventory";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";

interface ProductAnalyticsProps {
  productId: number;
}

export function ProductAnalytics({ productId }: ProductAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<string>("all"); // Changed to string to handle "all"
  const [chartType, setChartType] = useState<string>("line"); // Chart type: line, bar, area

  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['product-analytics', productId, timeRange],
    queryFn: () => {
      // If "all" is selected, don't pass days parameter (will get all-time data)
      const days = timeRange === "all" ? undefined : Number(timeRange);
      return productsApi.getAnalytics(productId, days);
    },
    enabled: !!productId,
  });

  if (isLoading) {
    return <ProductAnalyticsSkeleton />;
  }

  if (error || !analytics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Product Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Failed to load product analytics</p>
        </CardContent>
      </Card>
    );
  }

  const { product_info, stock_analytics, sales_analytics, charts, recent_activity } = analytics;

  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case "all": return "All Time";
      case "7": return "Last 7 days";
      case "30": return "Last 30 days";
      case "90": return "Last 90 days";
      case "365": return "Last year";
      default: return `Last ${range} days`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with time range selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Product Analytics</h2>
          <p className="text-muted-foreground">
            Complete overview for {product_info.name} - {getTimeRangeLabel(timeRange)}
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

             {/* Key Metrics Cards */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Total Revenue"
          value={`$${sales_analytics.total_revenue.toFixed(2)}`}
          change=""
          changeValue={`${getTimeRangeLabel(timeRange)}`}
          icon={<DollarSign className="h-4 w-4" />}
          trend="neutral"
        />
        <MetricCard
          title="Total Profit"
          value={`$${sales_analytics.net_profit.toFixed(2)}`}
          change=""
          changeValue={`${sales_analytics.profit_margin.toFixed(1)}% margin`}
          icon={<TrendingUp className="h-4 w-4" />}
          trend={sales_analytics.net_profit > 0 ? "up" : "down"}
        />
        <MetricCard
          title="Units Sold"
          value={sales_analytics.total_quantity_sold.toString()}
          change=""
          changeValue={`${sales_analytics.total_sales} transactions`}
          icon={<ShoppingCart className="h-4 w-4" />}
          trend="neutral"
        />
                 <MetricCard
           title="Current Stock"
           value={product_info.current_stock.toString()}
           change=""
           changeValue={`${stock_analytics.net_stock_change > 0 ? '+' : ''}${stock_analytics.net_stock_change} net change`}
           icon={<Package className="h-4 w-4" />}
           trend={stock_analytics.net_stock_change > 0 ? "up" : "down"}
         />
         <MetricCard
           title="Average Profit"
           value={`$${sales_analytics.total_sales > 0 ? (sales_analytics.net_profit / sales_analytics.total_sales).toFixed(2) : '0.00'}`}
           change=""
           changeValue={`per transaction`}
           icon={<Target className="h-4 w-4" />}
           trend="neutral"
         />
      </div>

             {/* Complete Overview */}
               <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Complete Overview</TabsTrigger>
            <TabsTrigger value="stock">Stock Analysis</TabsTrigger>
            <TabsTrigger value="sales">Sales History</TabsTrigger>
            <TabsTrigger value="graph">Sales Graph</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Sales Performance Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Sales Performance Overview
              </CardTitle>
              <CardDescription>Complete sales data for {getTimeRangeLabel(timeRange)}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{sales_analytics.total_sales}</div>
                  <div className="text-sm text-muted-foreground">Total Sales</div>
                  <div className="text-xs text-muted-foreground mt-1">Transactions</div>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{sales_analytics.total_quantity_sold}</div>
                  <div className="text-sm text-muted-foreground">Units Sold</div>
                  <div className="text-xs text-muted-foreground mt-1">Total Quantity</div>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">${sales_analytics.average_price.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Average Order Price</div>
                  <div className="text-xs text-muted-foreground mt-1">Per Transaction</div>
                </div>
                <div className="text-center p-6 bg-orange-50 rounded-lg">
                  <div className="text-3xl font-bold text-orange-600">{sales_analytics.profit_margin.toFixed(1)}%</div>
                  <div className="text-sm text-muted-foreground">Profit Margin</div>
                  <div className="text-xs text-muted-foreground mt-1">Overall</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Financial Summary
                </CardTitle>
                <CardDescription>Revenue and profit breakdown</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Total Revenue</p>
                      <p className="text-sm text-muted-foreground">Gross sales amount</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-green-600">${sales_analytics.total_revenue.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Target className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Net Profit</p>
                      <p className="text-sm text-muted-foreground">After costs</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">${sales_analytics.net_profit.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <TrendingDown className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium">Total Loss</p>
                      <p className="text-sm text-muted-foreground">Discounts & returns</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-red-600">${sales_analytics.total_loss.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Stock Movement Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Stock Movement Summary
                </CardTitle>
                <CardDescription>Stock in/out movements for {getTimeRangeLabel(timeRange)}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <ArrowUpRight className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Stock In</p>
                      <p className="text-sm text-muted-foreground">{stock_analytics.stock_in_movements} movements</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{stock_analytics.total_stock_in}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <ArrowDownRight className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium">Stock Out</p>
                      <p className="text-sm text-muted-foreground">{stock_analytics.stock_out_movements} movements</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-red-600">{stock_analytics.total_stock_out}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Minus className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Net Change</p>
                      <p className="text-sm text-muted-foreground">Current period</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">{stock_analytics.net_stock_change}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Indicators */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Performance Indicators
              </CardTitle>
              <CardDescription>Key performance metrics for {getTimeRangeLabel(timeRange)}</CardDescription>
            </CardHeader>
            <CardContent>
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Profit Margin</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{sales_analytics.profit_margin.toFixed(1)}%</span>
                    <Badge variant={sales_analytics.profit_margin > 20 ? "default" : "secondary"}>
                      {sales_analytics.profit_margin > 20 ? "Excellent" : "Good"}
                    </Badge>
                  </div>
                  <Progress value={Math.min(sales_analytics.profit_margin, 100)} className="h-2" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Stock Utilization</p>
                  <span className="text-2xl font-bold">
                    {product_info.current_stock + sales_analytics.total_quantity_sold > 0 
                      ? Math.round((sales_analytics.total_quantity_sold / (product_info.current_stock + sales_analytics.total_quantity_sold)) * 100)
                      : 0}%
                  </span>
                  <p className="text-sm text-muted-foreground">Units sold vs total</p>
                </div>
                                 <div className="space-y-2">
                   <p className="text-sm font-medium text-muted-foreground">Average Order Value</p>
                   <span className="text-2xl font-bold">
                     ${sales_analytics.total_sales > 0 ? (sales_analytics.total_revenue / sales_analytics.total_sales).toFixed(2) : '0.00'}
                   </span>
                   <p className="text-sm text-muted-foreground">Per transaction</p>
                 </div>
                 <div className="space-y-2">
                   <p className="text-sm font-medium text-muted-foreground">Average Profit</p>
                   <span className="text-2xl font-bold">
                     ${sales_analytics.total_sales > 0 ? (sales_analytics.net_profit / sales_analytics.total_sales).toFixed(2) : '0.00'}
                   </span>
                   <p className="text-sm text-muted-foreground">Per transaction</p>
                 </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stock" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stock Analysis</CardTitle>
              <CardDescription>Detailed stock movement analysis for {getTimeRangeLabel(timeRange)}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Current Stock Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium">Current Stock</span>
                      <span className="text-xl font-bold text-blue-600">{product_info.current_stock}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="font-medium">Total Sold</span>
                      <span className="text-xl font-bold text-green-600">{sales_analytics.total_quantity_sold}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <span className="font-medium">Total Stock In</span>
                      <span className="text-xl font-bold text-purple-600">{stock_analytics.total_stock_in}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <span className="font-medium">Total Stock Out</span>
                      <span className="text-xl font-bold text-red-600">{stock_analytics.total_stock_out}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Movement Summary</h3>
                  <div className="space-y-3">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold">{stock_analytics.stock_in_movements}</div>
                      <div className="text-sm text-muted-foreground">Stock In Movements</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold">{stock_analytics.stock_out_movements}</div>
                      <div className="text-sm text-muted-foreground">Stock Out Movements</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{stock_analytics.net_stock_change}</div>
                      <div className="text-sm text-muted-foreground">Net Stock Change</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
                 </TabsContent>

         <TabsContent value="sales" className="space-y-6">
           <Card>
             <CardHeader>
               <CardTitle className="flex items-center gap-2">
                 <ShoppingCart className="h-5 w-5" />
                 Sales History
               </CardTitle>
               <CardDescription>Complete sales transaction history for {getTimeRangeLabel(timeRange)}</CardDescription>
             </CardHeader>
             <CardContent>
               {recent_activity.sales.length > 0 ? (
                 <div className="space-y-4">
                   <Table>
                                           <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Invoice</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Unit Price</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Profit</TableHead>
                        </TableRow>
                      </TableHeader>
                     <TableBody>
                       {recent_activity.sales.map((sale) => (
                         <TableRow key={sale.id}>
                           <TableCell>
                             {new Date(sale.sale_date).toLocaleDateString()}
                           </TableCell>
                           <TableCell className="font-medium">
                             {sale.invoice_number}
                           </TableCell>
                           <TableCell>{sale.customer_name}</TableCell>
                           <TableCell>{sale.quantity}</TableCell>
                           <TableCell>${sale.unit_price.toFixed(2)}</TableCell>
                           <TableCell className="font-medium">
                             ${sale.total.toFixed(2)}
                           </TableCell>
                                                       <TableCell className={sale.profit > 0 ? "text-green-600" : "text-red-600"}>
                              ${sale.profit.toFixed(2)}
                            </TableCell>
                         </TableRow>
                       ))}
                     </TableBody>
                   </Table>
                 </div>
               ) : (
                 <div className="text-center py-8">
                   <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                   <p className="text-muted-foreground">No sales found for {getTimeRangeLabel(timeRange)}</p>
                 </div>
               )}
             </CardContent>
           </Card>
                   </TabsContent>

          <TabsContent value="graph" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Sales Performance Graph
                </CardTitle>
                <CardDescription>Visual representation of sales data over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                                     {/* Graph Filter Controls */}
                   <div className="flex items-center gap-4">
                     <div className="flex items-center gap-2">
                       <span className="text-sm font-medium">Time Period:</span>
                       <Select 
                         value={timeRange} 
                         onValueChange={setTimeRange}
                       >
                         <SelectTrigger className="w-[140px]">
                           <SelectValue />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="all">All Time</SelectItem>
                           <SelectItem value="365">Last Year</SelectItem>
                           <SelectItem value="90">Last 3 Months</SelectItem>
                           <SelectItem value="30">Last Month</SelectItem>
                           <SelectItem value="7">Last Week</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>
                     <div className="flex items-center gap-2">
                       <span className="text-sm font-medium">Chart Type:</span>
                       <Select 
                         value={chartType} 
                         onValueChange={setChartType}
                       >
                         <SelectTrigger className="w-[120px]">
                           <SelectValue />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="line">Line Chart</SelectItem>
                           <SelectItem value="bar">Bar Chart</SelectItem>
                           <SelectItem value="area">Area Chart</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>
                   </div>

                                                        {/* Graph Content */}
                   <div className="h-80 w-full">
                     {charts.monthly_sales.length > 0 ? (
                       <>
                         {chartType === "line" && (
                           <ResponsiveContainer width="100%" height="100%">
                             <LineChart data={charts.monthly_sales}>
                               <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                               <XAxis 
                                 dataKey="month" 
                                 stroke="#64748b" 
                                 fontSize={12}
                                 tickFormatter={(value) => {
                                   const date = new Date(value);
                                   return date.toLocaleDateString('en-US', { 
                                     month: 'short', 
                                     year: '2-digit' 
                                   });
                                 }}
                               />
                               <YAxis stroke="#64748b" fontSize={12} />
                               <Tooltip
                                 contentStyle={{
                                   backgroundColor: "white",
                                   border: "none",
                                   borderRadius: "8px",
                                   boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                 }}
                                 formatter={(value, name) => [
                                   name === 'revenue' ? `$${Number(value).toFixed(2)}` : 
                                   name === 'profit' ? `$${Number(value).toFixed(2)}` : 
                                   name === 'quantity_sold' ? `${value} units` : 
                                   name === 'loss' ? `$${Number(value).toFixed(2)}` : value,
                                   name === 'revenue' ? 'Revenue' :
                                   name === 'profit' ? 'Profit' :
                                   name === 'quantity_sold' ? 'Units Sold' :
                                   name === 'loss' ? 'Loss' : name
                                 ]}
                               />
                               <Line
                                 type="monotone"
                                 dataKey="revenue"
                                 stroke="#3b82f6"
                                 strokeWidth={2}
                                 dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                                 activeDot={{
                                   r: 6,
                                   stroke: "#3b82f6",
                                   strokeWidth: 2,
                                 }}
                                 name="Revenue"
                               />
                               <Line
                                 type="monotone"
                                 dataKey="profit"
                                 stroke="#10b981"
                                 strokeWidth={2}
                                 dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                                 activeDot={{
                                   r: 6,
                                   stroke: "#10b981",
                                   strokeWidth: 2,
                                 }}
                                 name="Profit"
                               />
                             </LineChart>
                           </ResponsiveContainer>
                         )}
                         {chartType === "bar" && (
                           <ResponsiveContainer width="100%" height="100%">
                             <BarChart data={charts.monthly_sales}>
                               <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                               <XAxis 
                                 dataKey="month" 
                                 stroke="#64748b" 
                                 fontSize={12}
                                 tickFormatter={(value) => {
                                   const date = new Date(value);
                                   return date.toLocaleDateString('en-US', { 
                                     month: 'short', 
                                     year: '2-digit' 
                                   });
                                 }}
                               />
                               <YAxis stroke="#64748b" fontSize={12} />
                               <Tooltip
                                 contentStyle={{
                                   backgroundColor: "white",
                                   border: "none",
                                   borderRadius: "8px",
                                   boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                 }}
                                 formatter={(value, name) => [
                                   name === 'revenue' ? `$${Number(value).toFixed(2)}` : 
                                   name === 'profit' ? `$${Number(value).toFixed(2)}` : 
                                   name === 'quantity_sold' ? `${value} units` : 
                                   name === 'loss' ? `$${Number(value).toFixed(2)}` : value,
                                   name === 'revenue' ? 'Revenue' :
                                   name === 'profit' ? 'Profit' :
                                   name === 'quantity_sold' ? 'Units Sold' :
                                   name === 'loss' ? 'Loss' : name
                                 ]}
                               />
                               <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                               <Bar dataKey="profit" fill="#10b981" name="Profit" />
                             </BarChart>
                           </ResponsiveContainer>
                         )}
                         {chartType === "area" && (
                           <ResponsiveContainer width="100%" height="100%">
                             <AreaChart data={charts.monthly_sales}>
                               <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                               <XAxis 
                                 dataKey="month" 
                                 stroke="#64748b" 
                                 fontSize={12}
                                 tickFormatter={(value) => {
                                   const date = new Date(value);
                                   return date.toLocaleDateString('en-US', { 
                                     month: 'short', 
                                     year: '2-digit' 
                                   });
                                 }}
                               />
                               <YAxis stroke="#64748b" fontSize={12} />
                               <Tooltip
                                 contentStyle={{
                                   backgroundColor: "white",
                                   border: "none",
                                   borderRadius: "8px",
                                   boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                 }}
                                 formatter={(value, name) => [
                                   name === 'revenue' ? `$${Number(value).toFixed(2)}` : 
                                   name === 'profit' ? `$${Number(value).toFixed(2)}` : 
                                   name === 'quantity_sold' ? `${value} units` : 
                                   name === 'loss' ? `$${Number(value).toFixed(2)}` : value,
                                   name === 'revenue' ? 'Revenue' :
                                   name === 'profit' ? 'Profit' :
                                   name === 'quantity_sold' ? 'Units Sold' :
                                   name === 'loss' ? 'Loss' : name
                                 ]}
                               />
                               <Area
                                 type="monotone"
                                 dataKey="revenue"
                                 stroke="#3b82f6"
                                 fill="#3b82f6"
                                 fillOpacity={0.3}
                                 name="Revenue"
                               />
                               <Area
                                 type="monotone"
                                 dataKey="profit"
                                 stroke="#10b981"
                                 fill="#10b981"
                                 fillOpacity={0.3}
                                 name="Profit"
                               />
                             </AreaChart>
                           </ResponsiveContainer>
                         )}
                       </>
                     ) : (
                       <div className="h-full w-full bg-gray-50 rounded-lg flex items-center justify-center">
                         <div className="text-center">
                           <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                           <p className="text-muted-foreground">No sales data available for {getTimeRangeLabel(timeRange)}</p>
                         </div>
                       </div>
                     )}
                   </div>

                  {/* Graph Summary */}
                  {charts.monthly_sales.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {charts.monthly_sales.length}
                        </div>
                        <div className="text-sm text-muted-foreground">Data Points</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          ${charts.monthly_sales.reduce((sum, item) => sum + item.revenue, 0).toFixed(2)}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Revenue</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {charts.monthly_sales.reduce((sum, item) => sum + item.quantity_sold, 0)}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Units Sold</div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Stock Movements */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Stock Movements</CardTitle>
                <CardDescription>Latest stock activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recent_activity.stock_movements.length > 0 ? (
                    recent_activity.stock_movements.map((movement) => (
                      <div key={movement.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${
                            movement.movement_type === 'IN' ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            {movement.movement_type === 'IN' ? (
                              <ArrowUpRight className="h-4 w-4 text-green-600" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{movement.quantity} units</p>
                            <p className="text-sm text-muted-foreground">{movement.notes || 'No notes'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{movement.movement_type}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(movement.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No stock movements found</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Sales */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>Latest sales transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recent_activity.sales.length > 0 ? (
                    recent_activity.sales.map((sale) => (
                      <div key={sale.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{sale.quantity} units</p>
                          <p className="text-sm text-muted-foreground">{sale.customer_name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${sale.total.toFixed(2)}</p>
                          <p className="text-sm text-green-600">+${sale.profit.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(sale.sale_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No sales found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MetricCard({ 
  title, 
  value, 
  change, 
  changeValue, 
  icon, 
  trend 
}: {
  title: string;
  value: string;
  change: string;
  changeValue: string;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'neutral';
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          {change}
          {changeValue}
          {trend === 'up' && <ArrowUpRight className="inline h-3 w-3 text-green-600 ml-1" />}
          {trend === 'down' && <ArrowDownRight className="inline h-3 w-3 text-red-600 ml-1" />}
          {trend === 'neutral' && <Minus className="inline h-3 w-3 text-gray-600 ml-1" />}
        </p>
      </CardContent>
    </Card>
  );
}

function ProductAnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
         {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-3 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
