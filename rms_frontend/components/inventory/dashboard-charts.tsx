import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
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
  useDashboardOverview,
  useStockMovementAnalysis,
} from "@/hooks/queries/useInventory";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StockMovementAnalysis } from "@/types/inventory";
import { TrendingUp, PieChart as PieIcon, BarChart3, Layers } from "lucide-react";

const MODERN_PALETTE = [
  "#6366F1", // Indigo
  "#06B6D4", // Cyan
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EC4899", // Pink
  "#8B5CF6", // Purple
  "#3B82F6", // Blue
];

export function DashboardCharts() {
  const { data: overview, isLoading: isOverviewLoading } =
    useDashboardOverview("month");
  const { data: movementAnalysis, isLoading: isMovementLoading } =
    useStockMovementAnalysis("month");

  if (isOverviewLoading || isMovementLoading) {
    return (
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
        <Skeleton className="h-[400px] rounded-2xl" />
        <Skeleton className="h-[400px] rounded-2xl" />
      </div>
    );
  }

  const categoryData =
    overview?.category_distribution.map((category) => ({
      name: category.name,
      value: category.total_value || 0,
    })) || [];

  const totalInventoryValue = categoryData.reduce((acc, curr) => acc + curr.value, 0);

  const movementData =
    movementAnalysis?.daily_movements.map((trend) => ({
      date: new Date(trend.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      stockIn: trend.stock_in || 0,
      stockOut: trend.stock_out || 0,
    })) || [];

  const categoryMovementData =
    movementAnalysis?.category_movements.map((category) => ({
      name: category.product__category__name,
      stockIn: category.stock_in || 0,
      stockOut: category.stock_out || 0,
    })) || [];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="movement" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80 text-xs sm:text-sm shadow-inner">
          <TabsTrigger
            value="movement"
            className="flex items-center gap-2 py-2 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm rounded-lg font-medium transition-all"
          >
            <TrendingUp className="w-4 h-4" />
            Stock Movement
          </TabsTrigger>
          <TabsTrigger
            value="distribution"
            className="flex items-center gap-2 py-2 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm rounded-lg font-medium transition-all"
          >
            <PieIcon className="w-4 h-4" />
            Category Distribution
          </TabsTrigger>
        </TabsList>

        <TabsContent value="movement" className="mt-4">
          <Card className="border border-slate-100/80 shadow-md bg-white rounded-2xl overflow-hidden">
            <CardHeader className="p-5 sm:p-6 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
                  Stock Movement Trends
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-1">
                  Daily stock inflows vs outflows over time
                </CardDescription>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-indigo-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Stock In
                </span>
                <span className="flex items-center gap-1.5 text-amber-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Stock Out
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="h-[280px] sm:h-[350px] md:h-[380px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={movementData}>
                    <defs>
                      <linearGradient id="invStockIn" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="invStockOut" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                      dataKey="date"
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#e2e8f0' }}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-slate-900/90 text-white px-3.5 py-2.5 rounded-xl shadow-xl backdrop-blur-md text-xs border border-slate-800 space-y-1">
                              <p className="font-semibold text-slate-300 mb-1">{label}</p>
                              {payload.map((p: any, idx: number) => (
                                <p key={idx} className="flex items-center gap-2">
                                  <span
                                    className="w-2 h-2 rounded-full inline-block"
                                    style={{ backgroundColor: p.stroke || p.color }}
                                  />
                                  <span className="text-slate-400 capitalize">{p.name}:</span>
                                  <span className="font-bold text-white">{p.value} units</span>
                                </p>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="stockIn"
                      stroke="#6366F1"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#invStockIn)"
                      name="Stock In"
                    />
                    <Area
                      type="monotone"
                      dataKey="stockOut"
                      stroke="#F59E0B"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#invStockOut)"
                      name="Stock Out"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="mt-4">
          <Card className="border border-slate-100/80 shadow-md bg-white rounded-2xl overflow-hidden">
            <CardHeader className="p-5 sm:p-6 border-b border-slate-100">
              <CardTitle className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                Category Value Distribution
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                Total inventory value split by product category
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-7 h-[260px] sm:h-[300px] relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0];
                            const percent = totalInventoryValue > 0
                              ? ((Number(data.value) / totalInventoryValue) * 100).toFixed(1)
                              : 0;
                            return (
                              <div className="bg-slate-900/90 text-white px-3.5 py-2.5 rounded-xl shadow-xl backdrop-blur-md text-xs border border-slate-800">
                                <p className="font-semibold text-slate-300">{data.name}</p>
                                <p className="font-bold text-indigo-400 mt-1">
                                  ${Number(data.value).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </p>
                                <p className="text-[11px] text-slate-400">{percent}% of total</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius="65%"
                        outerRadius="88%"
                        paddingAngle={3}
                        cornerRadius={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={MODERN_PALETTE[index % MODERN_PALETTE.length]}
                            stroke="transparent"
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Modern Centered KPI Badge */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Total Value
                    </span>
                    <span className="text-sm sm:text-lg md:text-xl font-bold text-slate-900">
                      ${totalInventoryValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>

                {/* Legend List */}
                <div className="md:col-span-5 max-h-[260px] overflow-y-auto space-y-2 pr-2">
                  {categoryData.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-6">No category data</p>
                  ) : (
                    categoryData.map((cat, idx) => {
                      const pct = totalInventoryValue > 0 ? ((cat.value / totalInventoryValue) * 100).toFixed(1) : 0;
                      return (
                        <div
                          key={cat.name}
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-50/70 hover:bg-slate-100/80 transition-colors border border-slate-100 text-xs"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                              style={{ backgroundColor: MODERN_PALETTE[idx % MODERN_PALETTE.length] }}
                            />
                            <span className="font-medium text-slate-800 truncate">{cat.name}</span>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-semibold text-slate-900 block">
                              ${cat.value.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                            </span>
                            <span className="text-[10px] text-slate-400">{pct}%</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="border border-slate-100/80 shadow-md bg-white rounded-2xl overflow-hidden">
        <CardHeader className="p-5 sm:p-6 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              Category Movement Analysis
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 mt-0.5">
              Stock movement volume by product category
            </CardDescription>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-indigo-600">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Stock In
            </span>
            <span className="flex items-center gap-1.5 text-amber-600">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Stock Out
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryMovementData} layout="vertical" barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={110}
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900/90 text-white px-3.5 py-2.5 rounded-xl shadow-xl backdrop-blur-md text-xs border border-slate-800 space-y-1">
                          <p className="font-semibold text-slate-300 mb-1">{label}</p>
                          {payload.map((p: any, idx: number) => (
                            <p key={idx} className="flex items-center gap-2">
                              <span
                                className="w-2 h-2 rounded-full inline-block"
                                style={{ backgroundColor: p.fill || p.color }}
                              />
                              <span className="text-slate-400 capitalize">{p.name}:</span>
                              <span className="font-bold text-white">{p.value} units</span>
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="stockIn" fill="#6366F1" radius={[0, 6, 6, 0]} name="Stock In" />
                <Bar dataKey="stockOut" fill="#F59E0B" radius={[0, 6, 6, 0]} name="Stock Out" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
