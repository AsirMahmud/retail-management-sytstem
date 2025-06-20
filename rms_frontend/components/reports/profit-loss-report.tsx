"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Legend,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProfitLossReport } from "@/hooks/queries/use-reports";
import { DateRange } from "react-day-picker";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfitLossReport({
  dateRange,
}: {
  dateRange: { from: Date | undefined; to: Date | undefined };
}) {
  const { data: profitLossData, isLoading } = useProfitLossReport(dateRange);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card
              key={i}
              className="bg-gradient-to-br from-orange-50 to-amber-100 border-0 shadow-xl"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[60px]" />
                <Skeleton className="h-4 w-[80px] mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="border-0 shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
            <Skeleton className="h-6 w-[200px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profitLossData) return null;

  // --- Patch: Construct chart data if missing from API ---
  // Build a map for quick lookup
  const revenueMap = Object.fromEntries(
    (profitLossData.revenue_by_date || []).map((item) => [
      item.date,
      parseFloat(item.revenue),
    ])
  );
  const expenseMap = Object.fromEntries(
    (profitLossData.expenses_by_date || []).map((item) => [
      item.date,
      parseFloat(item.total),
    ])
  );
  // Get all unique dates
  const allDates = Array.from(
    new Set([...Object.keys(revenueMap), ...Object.keys(expenseMap)])
  ).sort();
  // Build revenue_vs_expense_by_date
  const revenueVsExpenseData =
    profitLossData.revenue_vs_expense_by_date ??
    allDates.map((date) => ({
      date,
      revenue: revenueMap[date] || 0,
      expense: expenseMap[date] || 0,
    }));
  // Build expenses_over_time
  const expensesOverTimeData =
    profitLossData.expenses_over_time ??
    (profitLossData.expenses_by_date || []).map((item) => ({
      date: item.date,
      amount: item.total,
    }));

  console.log(profitLossData);
  console.log(expensesOverTimeData);
  // --- End Patch ---

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${parseFloat(profitLossData.total_revenue).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {profitLossData.revenue_by_date.length} days of sales
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${parseFloat(profitLossData.total_expenses).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {profitLossData.expenses_by_date.length} days of expenses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${parseFloat(profitLossData.net_profit).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {parseFloat(profitLossData.profit_margin).toFixed(1)}% profit
              margin
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Profit Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {parseFloat(profitLossData.profit_margin).toFixed(2)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Expenses Over Time</CardTitle>
          </CardHeader>
          <CardContent className="h-96">
            <ResponsiveContainer>
              <LineChart
                data={revenueVsExpenseData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value: string) =>
                    `$${parseFloat(value).toFixed(2)}`
                  }
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0088FE"
                  name="Revenue"
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#FF8042"
                  name="Expense"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Expenses Over Time</CardTitle>
          </CardHeader>
          <CardContent className="h-96">
            <ResponsiveContainer>
              <LineChart
                data={expensesOverTimeData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value: string) =>
                    `$${parseFloat(value).toFixed(2)}`
                  }
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#FF8042"
                  name="Expenses"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profit by Category</CardTitle>
        </CardHeader>
        <CardContent className="h-96">
          <ResponsiveContainer>
            <BarChart
              data={profitLossData.profit_by_category}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="category_name" width={100} />
              <Tooltip
                formatter={(value: string) =>
                  `$${parseFloat(value).toFixed(2)}`
                }
              />
              <Legend />
              <Bar
                dataKey={(data) => parseFloat(data.profit)}
                name="Profit"
                fill="#8884d8"
              />
              <Bar
                dataKey={(data) => parseFloat(data.revenue)}
                fill="#82ca9d"
                name="Revenue"
              />
              <Bar
                dataKey={(data) => parseFloat(data.cost)}
                fill="#ff8042"
                name="Cost"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Category Profit Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Profit</TableHead>
                <TableHead>Items Sold</TableHead>
                <TableHead className="text-right">Profit Margin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profitLossData.profit_by_category.map((item) => (
                <TableRow key={item.category_name}>
                  <TableCell>{item.category_name}</TableCell>
                  <TableCell>${parseFloat(item.revenue).toFixed(2)}</TableCell>
                  <TableCell>${parseFloat(item.cost).toFixed(2)}</TableCell>
                  <TableCell>${parseFloat(item.profit).toFixed(2)}</TableCell>
                  <TableCell>{item.items_sold}</TableCell>
                  <TableCell className="text-right">
                    {(
                      (parseFloat(item.profit) / parseFloat(item.revenue)) *
                      100
                    ).toFixed(1)}
                    %
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
