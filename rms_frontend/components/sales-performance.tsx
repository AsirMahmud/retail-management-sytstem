"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample data for daily sales
const dailySalesData = [
  { date: "Mon", sales: 2400, orders: 24 },
  { date: "Tue", sales: 1398, orders: 18 },
  { date: "Wed", sales: 9800, orders: 32 },
  { date: "Thu", sales: 3908, orders: 28 },
  { date: "Fri", sales: 4800, orders: 35 },
  { date: "Sat", sales: 3800, orders: 30 },
  { date: "Sun", sales: 4300, orders: 33 },
];

// Sample data for monthly sales
const monthlySalesData = [
  { month: "Jan", sales: 4000, target: 5000 },
  { month: "Feb", sales: 3000, target: 5000 },
  { month: "Mar", sales: 5000, target: 5000 },
  { month: "Apr", sales: 2780, target: 5000 },
  { month: "May", sales: 1890, target: 5000 },
  { month: "Jun", sales: 2390, target: 5000 },
  { month: "Jul", sales: 3490, target: 5000 },
  { month: "Aug", sales: 4000, target: 5000 },
  { month: "Sep", sales: 3200, target: 5000 },
  { month: "Oct", sales: 2800, target: 5000 },
  { month: "Nov", sales: 4200, target: 5000 },
  { month: "Dec", sales: 4800, target: 5000 },
];

// Sample data for sales by category
const salesByCategoryData = [
  { category: "Electronics", sales: 4000, growth: 12 },
  { category: "Clothing", sales: 3000, growth: 8 },
  { category: "Home", sales: 2000, growth: 15 },
  { category: "Sports", sales: 2780, growth: 5 },
  { category: "Books", sales: 1890, growth: 20 },
];

export function SalesPerformance() {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="daily" className="w-full">
        <TabsList>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Sales Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailySalesData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis
                      yAxisId="left"
                      tickFormatter={(value) => `$${value}`}
                    />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip
                      formatter={(value, name) => {
                        if (name === "sales") return [`$${value}`, "Sales"];
                        return [value, "Orders"];
                      }}
                    />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="sales"
                      stroke="#1E3A8A"
                      fill="#93C5FD"
                      fillOpacity={0.3}
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="orders"
                      stroke="#FFC107"
                      fill="#FEF3C7"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Sales vs Target</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlySalesData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${value}`} />
                    <Tooltip formatter={(value) => [`$${value}`, "Amount"]} />
                    <Legend />
                    <Bar
                      dataKey="sales"
                      fill="#1E3A8A"
                      radius={[4, 4, 0, 0]}
                      name="Actual Sales"
                    />
                    <Bar
                      dataKey="target"
                      fill="#93C5FD"
                      radius={[4, 4, 0, 0]}
                      name="Target"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesByCategoryData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="category" />
                    <YAxis
                      yAxisId="left"
                      tickFormatter={(value) => `$${value}`}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip
                      formatter={(value, name) => {
                        if (name === "sales") return [`$${value}`, "Sales"];
                        return [`${value}%`, "Growth"];
                      }}
                    />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="sales"
                      stroke="#1E3A8A"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="growth"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
