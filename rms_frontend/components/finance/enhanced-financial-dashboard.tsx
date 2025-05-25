"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  Download,
  FileSpreadsheet,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Percent,
  Wallet,
  CreditCard,
  BarChart3,
  PieChart,
  ChevronDown,
} from "lucide-react";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ComposedChart,
  Scatter,
} from "recharts";
import { FinancialMetricsTable } from "./financial-metrics-table";
import { FinancialRatios } from "./financial-ratios";
import { CashFlowForecast } from "./cash-flow-forecast";
import { ProfitLossStatement } from "./profit-loss-statement";

// Enhanced sample data for financial charts
const revenueData = [
  { name: "Jan", Revenue: 34500, Expenses: 28700, Profit: 5800, Target: 35000 },
  { name: "Feb", Revenue: 32300, Expenses: 27900, Profit: 4400, Target: 36000 },
  { name: "Mar", Revenue: 38200, Expenses: 29400, Profit: 8800, Target: 37000 },
  { name: "Apr", Revenue: 36800, Expenses: 30100, Profit: 6700, Target: 38000 },
  { name: "May", Revenue: 40100, Expenses: 31200, Profit: 8900, Target: 39000 },
  {
    name: "Jun",
    Revenue: 42700,
    Expenses: 32500,
    Profit: 10200,
    Target: 40000,
  },
  {
    name: "Jul",
    Revenue: 45231,
    Expenses: 33700,
    Profit: 11531,
    Target: 41000,
  },
];

const expenseBreakdown = [
  { name: "Inventory", value: 12400, trend: "+5.2%" },
  { name: "Payroll", value: 9800, trend: "+2.1%" },
  { name: "Rent", value: 4200, trend: "0%" },
  { name: "Utilities", value: 1900, trend: "-1.5%" },
  { name: "Marketing", value: 2100, trend: "+8.3%" },
  { name: "Other", value: 1300, trend: "-0.8%" },
];

const COLORS = [
  "#1E3A8A",
  "#3B82F6",
  "#60A5FA",
  "#93C5FD",
  "#BFDBFE",
  "#E5E7EB",
];

const cashFlowData = [
  { name: "Jan", value: 5800, forecast: 6000 },
  { name: "Feb", value: 10200, forecast: 10500 },
  { name: "Mar", value: 19000, forecast: 19500 },
  { name: "Apr", value: 25700, forecast: 26000 },
  { name: "May", value: 34600, forecast: 35000 },
  { name: "Jun", value: 44800, forecast: 45000 },
  { name: "Jul", value: 56331, forecast: 56500 },
];

const profitMarginData = [
  { name: "Jan", margin: 16.8, target: 18 },
  { name: "Feb", margin: 13.6, target: 18 },
  { name: "Mar", margin: 23.0, target: 18 },
  { name: "Apr", margin: 18.2, target: 18 },
  { name: "May", margin: 22.2, target: 18 },
  { name: "Jun", margin: 23.9, target: 18 },
  { name: "Jul", margin: 25.5, target: 18 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border rounded-lg shadow-lg">
        <p className="font-bold">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}:{" "}
            {entry.name === "margin" || entry.name === "target"
              ? `${entry.value}%`
              : `$${entry.value.toLocaleString()}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function EnhancedFinancialDashboard() {
  const [timeframe, setTimeframe] = useState("month");
  const [chartType, setChartType] = useState("area");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Financial Management
          </h2>
          <p className="text-muted-foreground">
            Comprehensive financial tracking, analysis, and forecasting
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DatePickerWithRange className="w-[300px]" />
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="ml-auto">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <div className="flex items-center pt-1 text-xs text-green-500">
              <ArrowUpRight className="mr-1 h-4 w-4" />
              <span>+20.1% from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,234.59</div>
            <div className="flex items-center pt-1 text-xs text-green-500">
              <ArrowUpRight className="mr-1 h-4 w-4" />
              <span>+12.3% from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">27.05%</div>
            <div className="flex items-center pt-1 text-xs text-green-500">
              <ArrowUpRight className="mr-1 h-4 w-4" />
              <span>+2.4% from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Operating Expenses
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$18,593.40</div>
            <div className="flex items-center pt-1 text-xs text-red-500">
              <ArrowDownRight className="mr-1 h-4 w-4" />
              <span>+4.2% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="cash-flow">Cash Flow</TabsTrigger>
          <TabsTrigger value="profit-margin">Profit Margin</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Revenue vs Expenses</CardTitle>
                    <CardDescription>
                      Monthly comparison with targets
                    </CardDescription>
                  </div>
                  <Select value={chartType} onValueChange={setChartType}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Chart type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="area">Area Chart</SelectItem>
                      <SelectItem value="bar">Bar Chart</SelectItem>
                      <SelectItem value="line">Line Chart</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="Revenue"
                        stroke="#1E3A8A"
                        fill="#1E3A8A"
                        fillOpacity={0.2}
                      />
                      <Area
                        type="monotone"
                        dataKey="Expenses"
                        stroke="#EF4444"
                        fill="#EF4444"
                        fillOpacity={0.2}
                      />
                      <Line
                        type="monotone"
                        dataKey="Target"
                        stroke="#10B981"
                        strokeDasharray="5 5"
                        dot={false}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
                <CardDescription>Current month with trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={expenseBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent, trend }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {expenseBreakdown.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name, props) => [
                          `$${value.toLocaleString()}`,
                          `${name} (${props.payload.trend})`,
                        ]}
                      />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analysis</CardTitle>
              <CardDescription>
                Monthly revenue with targets and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar
                      dataKey="Revenue"
                      fill="#1E3A8A"
                      radius={[4, 4, 0, 0]}
                    />
                    <Line
                      type="monotone"
                      dataKey="Target"
                      stroke="#10B981"
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expense Analysis</CardTitle>
              <CardDescription>
                Monthly expense trends and breakdown
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar
                      dataKey="Expenses"
                      fill="#EF4444"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="Profit"
                      fill="#10B981"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cash-flow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow Analysis</CardTitle>
              <CardDescription>Actual vs Forecasted cash flow</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={cashFlowData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#6366F1"
                      fill="#6366F1"
                      fillOpacity={0.2}
                    />
                    <Line
                      type="monotone"
                      dataKey="forecast"
                      stroke="#10B981"
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profit-margin" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profit Margin Analysis</CardTitle>
              <CardDescription>Actual vs Target profit margins</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={profitMarginData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `${value}%`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="margin"
                      stroke="#10B981"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="target"
                      stroke="#EF4444"
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
