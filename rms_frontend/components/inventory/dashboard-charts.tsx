import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export function DashboardCharts() {
  const { data: overview, isLoading: isOverviewLoading } =
    useDashboardOverview("month");
  const { data: movementAnalysis, isLoading: isMovementLoading } =
    useStockMovementAnalysis("month");

  if (isOverviewLoading || isMovementLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-[400px]" />
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  const categoryData =
    overview?.category_distribution.map((category) => ({
      name: category.name,
      value: category.total_value || 0,
    })) || [];

  const movementData =
    movementAnalysis?.daily_movements.map((trend) => ({
      date: new Date(trend.date).toLocaleDateString(),
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
        <TabsList className="grid w-full grid-cols-2 bg-white/70 backdrop-blur-sm border border-white/20 shadow-lg rounded-xl p-1">
          <TabsTrigger
            value="movement"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-lg transition-all duration-200"
          >
            Stock Movement
          </TabsTrigger>
          <TabsTrigger
            value="distribution"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-lg transition-all duration-200"
          >
            Category Distribution
          </TabsTrigger>
        </TabsList>
        <TabsContent value="movement">
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
              <CardTitle className="text-lg font-semibold text-slate-900">
                Stock Movement Trends
              </CardTitle>
              <CardDescription>Track stock movements over time</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={movementData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "none",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="stockIn"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                      activeDot={{
                        r: 6,
                        stroke: "#3b82f6",
                        strokeWidth: 2,
                      }}
                      name="Stock In"
                    />
                    <Line
                      type="monotone"
                      dataKey="stockOut"
                      stroke="#f97316"
                      strokeWidth={2}
                      dot={{ fill: "#f97316", strokeWidth: 2, r: 4 }}
                      activeDot={{
                        r: 6,
                        stroke: "#f97316",
                        strokeWidth: 2,
                      }}
                      name="Stock Out"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="distribution">
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
              <CardTitle className="text-lg font-semibold text-slate-900">
                Category Distribution
              </CardTitle>
              <CardDescription>Inventory value by category</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "none",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="border-0 shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
          <CardTitle className="text-lg font-semibold text-slate-900">
            Category Movement Analysis
          </CardTitle>
          <CardDescription>Stock movements by category</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryMovementData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" stroke="#64748b" fontSize={12} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={150}
                  stroke="#64748b"
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar dataKey="stockIn" fill="#3b82f6" name="Stock In" />
                <Bar dataKey="stockOut" fill="#f97316" name="Stock Out" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
