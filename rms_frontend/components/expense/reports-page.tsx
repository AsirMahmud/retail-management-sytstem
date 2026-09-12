"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import {
  Calendar,
  Download,
  TrendingUp,
  DollarSign,
  FileText,
} from "lucide-react";
import { useDashboardStats } from "@/hooks/queries/use-expenses";
import { formatCurrency } from "@/lib/utils";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

export function ReportsPage() {
  const [timeRange, setTimeRange] = useState("month");
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Expense Reports</CardTitle>
              <CardDescription className="text-blue-100">
                Analyze your expense data
              </CardDescription>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px] bg-white/20 border-white/30 text-white">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Category Distribution */}
            <Card className="border border-slate-100/80 shadow-md bg-white rounded-2xl overflow-hidden">
              <CardHeader className="p-5 border-b border-slate-100">
                <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
                  Category Distribution
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Expenses grouped by category
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {(() => {
                  const totalExpenseVal = stats?.category_distribution?.reduce(
                    (acc, curr) => acc + (parseFloat(String(curr.total)) || 0),
                    0
                  ) || 0;

                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                      <div className="sm:col-span-7 h-[250px] relative flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Tooltip
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const d = payload[0];
                                  const val = parseFloat(String(d.value));
                                  const pct = totalExpenseVal > 0 ? ((val / totalExpenseVal) * 100).toFixed(1) : 0;
                                  return (
                                    <div className="bg-slate-900/90 text-white px-3.5 py-2 rounded-xl shadow-xl backdrop-blur-md text-xs border border-slate-800">
                                      <p className="font-semibold text-slate-300">{d.name}</p>
                                      <p className="font-bold text-rose-400 mt-1">{formatCurrency(val)}</p>
                                      <p className="text-[11px] text-slate-400">{pct}% of total</p>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Pie
                              data={stats?.category_distribution}
                              dataKey="total"
                              nameKey="category__name"
                              cx="50%"
                              cy="50%"
                              innerRadius="65%"
                              outerRadius="88%"
                              paddingAngle={3}
                              cornerRadius={5}
                            >
                              {stats?.category_distribution.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={
                                    entry.category__color ||
                                    COLORS[index % COLORS.length]
                                  }
                                  stroke="transparent"
                                />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                            Total
                          </span>
                          <span className="text-base sm:text-lg font-bold text-slate-900">
                            {formatCurrency(totalExpenseVal)}
                          </span>
                        </div>
                      </div>

                      <div className="sm:col-span-5 max-h-[250px] overflow-y-auto space-y-2 pr-1">
                        {stats?.category_distribution?.map((entry, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 rounded-xl bg-slate-50/80 hover:bg-slate-100 transition-colors border border-slate-100 text-xs"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                                style={{
                                  backgroundColor:
                                    entry.category__color ||
                                    COLORS[idx % COLORS.length],
                                }}
                              />
                              <span className="font-medium text-slate-800 truncate">
                                {entry.category__name}
                              </span>
                            </div>
                            <span className="font-bold text-slate-900 ml-2">
                              {formatCurrency(entry.total)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>

            {/* Payment Method Distribution */}
            <Card className="border border-slate-100/80 shadow-md bg-white rounded-2xl overflow-hidden">
              <CardHeader className="p-5 border-b border-slate-100">
                <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
                  Payment Methods
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Distribution by payment method
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats?.payment_distribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis
                        dataKey="payment_method"
                        stroke="#94a3b8"
                        fontSize={11}
                        tickLine={false}
                        axisLine={{ stroke: '#e2e8f0' }}
                      />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-slate-900/90 text-white px-3.5 py-2 rounded-xl shadow-xl backdrop-blur-md text-xs border border-slate-800">
                                <p className="font-semibold text-slate-300 mb-1">{label}</p>
                                <p className="font-bold text-indigo-400">
                                  {formatCurrency(Number(payload[0].value))}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar
                        dataKey="total"
                        fill="#6366F1"
                        radius={[6, 6, 0, 0]}
                        name="Total Amount"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
