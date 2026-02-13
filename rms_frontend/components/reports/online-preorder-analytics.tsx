import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import React from "react";
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Tag,
  BarChart3,
  Package,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useOnlinePreorderAnalytics } from "@/hooks/queries/use-reports";
import { DateRange } from "react-day-picker";

interface OnlinePreorderAnalyticsProps {
  dateRange: DateRange;
}

export function OnlinePreorderAnalytics({ dateRange }: OnlinePreorderAnalyticsProps) {
  const { data: analyticsData, isLoading, error } = useOnlinePreorderAnalytics(dateRange);

  // Process chart data with better error handling - MUST be before any conditional returns
  const chartData = React.useMemo(() => {
    if (!analyticsData?.sales_by_date || !Array.isArray(analyticsData.sales_by_date)) {
      return [];
    }
    
    return analyticsData.sales_by_date
      .filter((item: any) => item && item.date) // Filter out null dates
      .map((item: any) => {
        try {
          // Handle different date formats
          let date: Date;
          if (typeof item.date === 'string') {
            date = new Date(item.date);
          } else if (item.date instanceof Date) {
            date = item.date;
          } else {
            return null;
          }
          
          // Check if date is valid
          if (isNaN(date.getTime())) {
            return null;
          }
          
          return {
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            revenue: parseFloat(String(item.total || '0')),
            orders: parseInt(String(item.orders_count || '0'), 10),
          };
        } catch (e) {
          console.error('Error parsing chart data:', e, item);
          return null;
        }
      })
      .filter((item: any) => item !== null && item !== undefined); // Remove any null entries
  }, [analyticsData?.sales_by_date]);

  // Debug logging
  React.useEffect(() => {
    if (analyticsData) {
      console.log('Online Preorder Analytics Data:', analyticsData);
      console.log('Sales by date:', analyticsData.sales_by_date);
    }
    if (error) {
      console.error('Online Preorder Analytics Error:', error);
    }
  }, [analyticsData, error]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-80" />
        <Skeleton className="h-80" />
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-gray-500">No analytics data available</p>
        {error && (
          <p className="text-red-500 text-sm mt-2">Error: {error.message || 'Failed to load data'}</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-indigo-900">Total Orders</CardTitle>
            <ShoppingCart className="h-5 w-5 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-900">{analyticsData.total_orders}</div>
            <p className="text-xs text-indigo-700 mt-1">All online preorders</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-emerald-900">Total Sales</CardTitle>
            <BarChart3 className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-900">{analyticsData.total_sales_count}</div>
            <p className="text-xs text-emerald-700 mt-1">Completed orders</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-blue-900">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">
              ৳{Number(analyticsData.total_revenue).toLocaleString()}
            </div>
            <p className="text-xs text-blue-700 mt-1">From completed orders</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-purple-900">Avg Order Value</CardTitle>
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">
              ৳{Number(analyticsData.average_order_value).toLocaleString()}
            </div>
            <p className="text-xs text-purple-700 mt-1">Per completed order</p>
          </CardContent>
        </Card>
      </div>

      {/* Sales Trend Chart */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Sales Trend Over Time
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-[350px] w-full">
            {chartData && chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    tickMargin={10}
                  />
                  <YAxis 
                    yAxisId="left"
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    tickFormatter={(value) => `৳${value.toLocaleString()}`}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                  />
                  <Tooltip 
                    formatter={(value: any, name: string) => {
                      if (name === 'revenue') {
                        return [`৳${Number(value).toLocaleString()}`, 'Revenue'];
                      }
                      if (name === 'orders') {
                        return [value, 'Orders'];
                      }
                      return [value, name];
                    }}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Legend />
                  <Bar 
                    yAxisId="left"
                    dataKey="revenue" 
                    fill="#6366f1" 
                    name="Revenue (৳)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    yAxisId="right"
                    dataKey="orders" 
                    fill="#10b981" 
                    name="Orders"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <BarChart3 className="h-12 w-12 mb-2 opacity-50" />
                <p>No sales data available for the selected period</p>
                {analyticsData?.sales_by_date && (
                  <p className="text-xs mt-2 text-gray-400">
                    {Array.isArray(analyticsData.sales_by_date) 
                      ? `${analyticsData.sales_by_date.length} date entries found but couldn't be parsed`
                      : 'No date entries in response'}
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Top Products and Categories */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Products */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Top Selling Products
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {analyticsData.top_products && analyticsData.top_products.length > 0 ? (
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analyticsData.top_products.map((product: any, idx: number) => (
                      <TableRow key={product.product_id || idx}>
                        <TableCell className="font-medium">{product.product_name || 'Unknown'}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{product.category_name || 'Uncategorized'}</Badge>
                        </TableCell>
                        <TableCell className="text-right">{product.quantity_sold || 0}</TableCell>
                        <TableCell className="text-right font-semibold">
                          ৳{Number(product.total_sales || 0).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <Package className="h-12 w-12 mb-2 opacity-50" />
                <p>No product data available for the selected period</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Categories */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Top Categories by Sales
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {analyticsData.top_categories && analyticsData.top_categories.length > 0 ? (
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Orders</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analyticsData.top_categories.map((category: any, idx: number) => (
                      <TableRow key={category.category_name || idx}>
                        <TableCell className="font-medium">{category.category_name || 'Uncategorized'}</TableCell>
                        <TableCell className="text-right">{category.order_count || 0}</TableCell>
                        <TableCell className="text-right">{category.quantity_sold || 0}</TableCell>
                        <TableCell className="text-right font-semibold">
                          ৳{Number(category.total_sales || 0).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <Tag className="h-12 w-12 mb-2 opacity-50" />
                <p>No category data available for the selected period</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

