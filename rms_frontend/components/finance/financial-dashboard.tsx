"use client";

import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  CalendarIcon,
  CreditCard,
  DollarSign,
  Download,
  FilePlus,
  Wallet,
} from "lucide-react";
import { format, subMonths } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// Sample data for financial charts
const generateMonthlyData = (
  months = 12,
  baseValue = 14000,
  growth = 0.05,
  variance = 0.1
) => {
  const data = [];
  let currentValue = baseValue;

  for (let i = months - 1; i >= 0; i--) {
    const date = subMonths(new Date(), i);
    const randomVariance = 1 + (Math.random() * variance * 2 - variance);
    currentValue = currentValue * (1 + growth) * randomVariance;

    data.push({
      name: format(date, "MMM"),
      fullDate: date,
      value: Math.round(currentValue),
    });
  }

  return data;
};

const revenueData = generateMonthlyData(12, 14000, 0.05, 0.1);
const expenseData = generateMonthlyData(12, 9000, 0.04, 0.08);

// Calculate profit data
const profitData = revenueData.map((item, index) => ({
  name: item.name,
  fullDate: item.fullDate,
  value: item.value - expenseData[index].value,
}));

// Calculate cash flow data
const cashFlowData = (() => {
  const result = [];
  for (let i = 0; i < revenueData.length; i++) {
    const previousValue = i > 0 ? result[i - 1].value : 0;
    result.push({
      name: revenueData[i].name,
      fullDate: revenueData[i].fullDate,
      value: previousValue + (revenueData[i].value - expenseData[i].value),
    });
  }
  return result;
})();

const salesByCategory = [
  { name: "Suits", value: 35 },
  { name: "Shirts", value: 25 },
  { name: "Accessories", value: 15 },
  { name: "Shoes", value: 12 },
  { name: "Casual Wear", value: 13 },
];

const transactions = [
  {
    id: "INV-1234",
    date: "Aug 15, 2023",
    amount: 349.99,
    type: "sale",
    description: "Sale - John Smith",
    method: "Credit Card",
  },
  {
    id: "PO-5678",
    date: "Aug 12, 2023",
    amount: -1250.0,
    type: "expense",
    description: "Inventory Restock - FashionWholesale Inc.",
    method: "Bank Transfer",
  },
  {
    id: "INV-1235",
    date: "Aug 12, 2023",
    amount: 159.95,
    type: "sale",
    description: "Sale - Alex Johnson",
    method: "Cash",
  },
  {
    id: "EXP-4321",
    date: "Aug 10, 2023",
    amount: -450.0,
    type: "expense",
    description: "Store Utilities",
    method: "Automatic Payment",
  },
  {
    id: "INV-1236",
    date: "Aug 9, 2023",
    amount: 245.0,
    type: "sale",
    description: "Sale - Robert Williams",
    method: "Credit Card",
  },
];

// Financial ratios data
const financialRatios = [
  { name: "Gross Profit Margin", value: 42.5, change: 2.3, target: 45 },
  { name: "Net Profit Margin", value: 18.2, change: 1.5, target: 20 },
  { name: "Current Ratio", value: 2.1, change: 0.3, target: 2.0 },
  { name: "Quick Ratio", value: 1.5, change: 0.2, target: 1.0 },
  { name: "Inventory Turnover", value: 6.8, change: -0.5, target: 8.0 },
  { name: "Return on Assets (ROA)", value: 12.4, change: 1.8, target: 15 },
  { name: "Return on Equity (ROE)", value: 18.7, change: 2.1, target: 20 },
  { name: "Debt to Equity", value: 0.45, change: -0.05, target: 0.5 },
];

export function FinancialDashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dateRange, setDateRange] = useState<"month" | "quarter" | "year">(
    "month"
  );
  const [forecastPeriod, setForecastPeriod] = useState<
    "3months" | "6months" | "12months"
  >("3months");

  // Calculate total revenue and expenses for the current month
  const currentMonthRevenue = revenueData[revenueData.length - 1].value;
  const previousMonthRevenue = revenueData[revenueData.length - 2].value;
  const revenueChange =
    ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;

  const currentMonthExpenses = expenseData[expenseData.length - 1].value;
  const previousMonthExpenses = expenseData[expenseData.length - 2].value;
  const expensesChange =
    ((currentMonthExpenses - previousMonthExpenses) / previousMonthExpenses) *
    100;

  const profit = currentMonthRevenue - currentMonthExpenses;
  const previousProfit = previousMonthRevenue - previousMonthExpenses;
  const profitChange = ((profit - previousProfit) / previousProfit) * 100;

  const profitMargin = (profit / currentMonthRevenue) * 100;

  // Calculate cash flow
  const currentCashFlow = cashFlowData[cashFlowData.length - 1].value;
  const previousCashFlow = cashFlowData[cashFlowData.length - 2].value;
  const cashFlowChange =
    ((currentCashFlow - previousCashFlow) / Math.abs(previousCashFlow)) * 100;

  // Generate forecast data
  const generateForecast = (
    baseData,
    months,
    growthRate = 0.03,
    variance = 0.05
  ) => {
    const lastValue = baseData[baseData.length - 1].value;
    const lastDate = baseData[baseData.length - 1].fullDate;
    const forecast = [];

    let forecastValue = lastValue;
    for (let i = 1; i <= months; i++) {
      const forecastDate = new Date(lastDate);
      forecastDate.setMonth(lastDate.getMonth() + i);
      const randomVariance = 1 + (Math.random() * variance * 2 - variance);
      forecastValue = forecastValue * (1 + growthRate) * randomVariance;

      forecast.push({
        name: format(forecastDate, "MMM"),
        fullDate: forecastDate,
        value: Math.round(forecastValue),
        forecast: true,
      });
    }

    return forecast;
  };

  const forecastMonths =
    forecastPeriod === "3months" ? 3 : forecastPeriod === "6months" ? 6 : 12;
  const revenueForecast = generateForecast(
    revenueData,
    forecastMonths,
    0.04,
    0.08
  );
  const expenseForecast = generateForecast(
    expenseData,
    forecastMonths,
    0.03,
    0.06
  );

  // Combine historical and forecast data
  const combinedRevenueData = [...revenueData, ...revenueForecast];
  const combinedExpenseData = [...expenseData, ...expenseForecast];

  // Calculate forecast profit
  const profitForecast = revenueForecast.map((item, index) => ({
    name: item.name,
    fullDate: item.fullDate,
    value: item.value - expenseForecast[index].value,
    forecast: true,
  }));

  const combinedProfitData = [...profitData, ...profitForecast];

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1E3A8A]">
            Financial Management
          </h1>
          <p className="text-muted-foreground">
            Track revenue, expenses and financial performance
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[240px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "MMMM yyyy") : <span>Pick a month</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Select
            value={dateRange}
            onValueChange={(value) => setDateRange(value as any)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Monthly</SelectItem>
              <SelectItem value="quarter">Quarterly</SelectItem>
              <SelectItem value="year">Yearly</SelectItem>
            </SelectContent>
          </Select>

          <Button className="bg-[#1E3A8A] hover:bg-[#15296b]">
            <FilePlus className="mr-2 h-4 w-4" /> New Transaction
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-[#1E3A8A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${currentMonthRevenue.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {revenueChange >= 0 ? (
                <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
              ) : (
                <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
              )}
              <span
                className={
                  revenueChange >= 0 ? "text-green-500" : "text-red-500"
                }
              >
                {Math.abs(revenueChange).toFixed(1)}%
              </span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <Wallet className="h-4 w-4 text-[#1E3A8A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${currentMonthExpenses.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {expensesChange <= 0 ? (
                <ArrowDown className="mr-1 h-4 w-4 text-green-500" />
              ) : (
                <ArrowUp className="mr-1 h-4 w-4 text-red-500" />
              )}
              <span
                className={
                  expensesChange <= 0 ? "text-green-500" : "text-red-500"
                }
              >
                {Math.abs(expensesChange).toFixed(1)}%
              </span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-[#1E3A8A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${profit.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {profitChange >= 0 ? (
                <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
              ) : (
                <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
              )}
              <span
                className={
                  profitChange >= 0 ? "text-green-500" : "text-red-500"
                }
              >
                {Math.abs(profitChange).toFixed(1)}%
              </span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <CreditCard className="h-4 w-4 text-[#1E3A8A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profitMargin.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">Target: 40%</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="forecast">Financial Forecast</TabsTrigger>
          <TabsTrigger value="ratios">Financial Ratios</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-6">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Financial Overview</CardTitle>
              <CardDescription>
                Monthly revenue and expenses overview
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenueData.map((item, index) => ({
                    name: item.name,
                    Revenue: item.value,
                    Expenses: expenseData[index].value,
                    Profit: item.value - expenseData[index].value,
                  }))}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                  <Tooltip
                    formatter={(value) => [
                      `$${value.toLocaleString()}`,
                      undefined,
                    ]}
                  />
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
                  <Area
                    type="monotone"
                    dataKey="Profit"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>Product category distribution</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={salesByCategory}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `${value}%`} />
                    <Tooltip
                      formatter={(value) => [`${value}%`, "Percentage"]}
                    />
                    <Bar dataKey="value" fill="#FFC107" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cash Flow</CardTitle>
                <CardDescription>Monthly cash flow trend</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="mb-4 flex items-center">
                  <div className="text-2xl font-bold">
                    ${currentCashFlow.toLocaleString()}
                  </div>
                  <div className="ml-3 flex items-center text-sm">
                    {cashFlowChange >= 0 ? (
                      <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
                    )}
                    <span
                      className={
                        cashFlowChange >= 0 ? "text-green-500" : "text-red-500"
                      }
                    >
                      {Math.abs(cashFlowChange).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height="80%">
                  <LineChart
                    data={cashFlowData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                    <Tooltip
                      formatter={(value) => [
                        `$${value.toLocaleString()}`,
                        "Cash Flow",
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#6366F1"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
              <CardDescription>
                Detailed revenue analysis by category and time period
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={Array.from({ length: 30 }, (_, i) => ({
                    day: i + 1,
                    revenue: Math.floor(Math.random() * 1000) + 500,
                  }))}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" />
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#1E3A8A"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Payment Method</CardTitle>
                <CardDescription>
                  Distribution of revenue by payment type
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { method: "Credit Card", value: 15200 },
                      { method: "Cash", value: 8500 },
                      { method: "Debit Card", value: 6300 },
                      { method: "Mobile Payment", value: 4800 },
                      { method: "Gift Card", value: 1200 },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="method" />
                    <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                    <Tooltip
                      formatter={(value) => [
                        `$${value.toLocaleString()}`,
                        "Revenue",
                      ]}
                    />
                    <Bar dataKey="value" fill="#1E3A8A" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Location</CardTitle>
                <CardDescription>
                  Revenue distribution by store location
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { location: "Main Street", value: 18500 },
                      { location: "Downtown", value: 12300 },
                      { location: "Westfield Mall", value: 9800 },
                      { location: "Online Store", value: 14200 },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="location" />
                    <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                    <Tooltip
                      formatter={(value) => [
                        `$${value.toLocaleString()}`,
                        "Revenue",
                      ]}
                    />
                    <Bar dataKey="value" fill="#6366F1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="expenses" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
              <CardDescription>
                Detailed expense analysis by category
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { category: "Inventory", value: 8500 },
                    { category: "Rent", value: 3500 },
                    { category: "Payroll", value: 7000 },
                    { category: "Utilities", value: 1200 },
                    { category: "Marketing", value: 1500 },
                    { category: "Other", value: 800 },
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="category" />
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <Tooltip formatter={(value) => [`$${value}`, "Amount"]} />
                  <Bar dataKey="value" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Fixed vs Variable Expenses</CardTitle>
                <CardDescription>
                  Comparison of fixed and variable costs
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { month: "Jan", fixed: 5200, variable: 3800 },
                      { month: "Feb", fixed: 5200, variable: 4100 },
                      { month: "Mar", fixed: 5200, variable: 4500 },
                      { month: "Apr", fixed: 5500, variable: 4800 },
                      { month: "May", fixed: 5500, variable: 5200 },
                      { month: "Jun", fixed: 5500, variable: 5800 },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                    <Tooltip
                      formatter={(value) => [
                        `$${value.toLocaleString()}`,
                        undefined,
                      ]}
                    />
                    <Legend />
                    <Bar
                      dataKey="fixed"
                      name="Fixed Expenses"
                      stackId="a"
                      fill="#EF4444"
                    />
                    <Bar
                      dataKey="variable"
                      name="Variable Expenses"
                      stackId="a"
                      fill="#F87171"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expense Trend</CardTitle>
                <CardDescription>
                  Monthly expense trend analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={expenseData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                    <Tooltip
                      formatter={(value) => [
                        `$${value.toLocaleString()}`,
                        "Expenses",
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#EF4444"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="forecast" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Financial Forecast</h3>
            <Select
              value={forecastPeriod}
              onValueChange={(value) => setForecastPeriod(value as any)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Forecast period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3months">3 Months</SelectItem>
                <SelectItem value="6months">6 Months</SelectItem>
                <SelectItem value="12months">12 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Revenue & Profit Forecast</CardTitle>
              <CardDescription>
                Projected revenue and profit for the next {forecastMonths}{" "}
                months
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    allowDuplicatedCategory={false}
                    type="category"
                  />
                  <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                  <Tooltip
                    formatter={(value) => [
                      `$${value.toLocaleString()}`,
                      undefined,
                    ]}
                  />
                  <Legend />
                  <Line
                    data={combinedRevenueData}
                    type="monotone"
                    dataKey="value"
                    name="Revenue"
                    stroke="#1E3A8A"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    data={combinedProfitData}
                    type="monotone"
                    dataKey="value"
                    name="Profit"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Cash Flow Projection</CardTitle>
                <CardDescription>
                  Projected cash flow for the next {forecastMonths} months
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={[
                      ...cashFlowData,
                      ...profitForecast.map((item, index) => ({
                        name: item.name,
                        value:
                          cashFlowData[cashFlowData.length - 1].value +
                          profitForecast
                            .slice(0, index + 1)
                            .reduce((sum, i) => sum + i.value, 0),
                        forecast: true,
                      })),
                    ]}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                    <Tooltip
                      formatter={(value) => [
                        `$${value.toLocaleString()}`,
                        "Cash Flow",
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#6366F1"
                      fill="#6366F1"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Break-Even Analysis</CardTitle>
                <CardDescription>
                  Projected break-even point based on current trends
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" allowDuplicatedCategory={false} />
                    <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                    <Tooltip
                      formatter={(value) => [
                        `$${value.toLocaleString()}`,
                        undefined,
                      ]}
                    />
                    <Legend />
                    <Line
                      data={combinedRevenueData}
                      type="monotone"
                      dataKey="value"
                      name="Revenue"
                      stroke="#1E3A8A"
                      strokeWidth={2}
                    />
                    <Line
                      data={combinedExpenseData}
                      type="monotone"
                      dataKey="value"
                      name="Expenses"
                      stroke="#EF4444"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ratios" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Financial Ratios</CardTitle>
              <CardDescription>
                Key financial ratios and performance indicators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {financialRatios.map((ratio) => (
                  <div key={ratio.name} className="border rounded-lg p-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      {ratio.name}
                    </h3>
                    <div className="text-2xl font-bold">
                      {ratio.value}
                      {ratio.name.includes("Margin") ||
                      ratio.name.includes("ROA") ||
                      ratio.name.includes("ROE")
                        ? "%"
                        : ""}
                    </div>
                    <div className="flex items-center text-xs mt-1">
                      {ratio.change >= 0 ? (
                        <ArrowUp className="mr-1 h-3 w-3 text-green-500" />
                      ) : (
                        <ArrowDown className="mr-1 h-3 w-3 text-red-500" />
                      )}
                      <span
                        className={
                          ratio.change >= 0 ? "text-green-500" : "text-red-500"
                        }
                      >
                        {ratio.change >= 0 ? "+" : ""}
                        {ratio.change}
                        {ratio.name.includes("Margin") ||
                        ratio.name.includes("ROA") ||
                        ratio.name.includes("ROE")
                          ? "%"
                          : ""}
                      </span>
                      <span className="ml-2 text-muted-foreground">
                        Target: {ratio.target}
                        {ratio.name.includes("Margin") ||
                        ratio.name.includes("ROA") ||
                        ratio.name.includes("ROE")
                          ? "%"
                          : ""}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">
                  Financial Health Score
                </h3>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-4 mr-4">
                    <div
                      className="bg-green-500 h-4 rounded-full"
                      style={{ width: "78%" }}
                    ></div>
                  </div>
                  <span className="text-lg font-bold">78/100</span>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Your business is in good financial health. Consider improving
                  your inventory turnover ratio to reach excellent status.
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Ratio Analysis</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ratio</TableHead>
                      <TableHead>Current</TableHead>
                      <TableHead>Industry Avg</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Gross Profit Margin</TableCell>
                      <TableCell>42.5%</TableCell>
                      <TableCell>40.2%</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          Good
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Net Profit Margin</TableCell>
                      <TableCell>18.2%</TableCell>
                      <TableCell>15.8%</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          Good
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Inventory Turnover</TableCell>
                      <TableCell>6.8</TableCell>
                      <TableCell>8.5</TableCell>
                      <TableCell>
                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                          Needs Improvement
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Return on Assets</TableCell>
                      <TableCell>12.4%</TableCell>
                      <TableCell>10.5%</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          Good
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Complete transaction records</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">
                        {transaction.id}
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.method}</TableCell>
                      <TableCell
                        className={`text-right ${
                          transaction.amount < 0
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        {transaction.amount < 0 ? "-" : ""}$
                        {Math.abs(transaction.amount).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
