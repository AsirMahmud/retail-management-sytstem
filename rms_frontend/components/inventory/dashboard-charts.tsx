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
      value: category.total_value,
    })) || [];

  const movementData =
    movementAnalysis?.movement_trends.map((trend) => ({
      date: new Date(trend.period).toLocaleDateString(),
      stockIn: trend.stock_in || 0,
      stockOut: trend.stock_out || 0,
      adjustments: trend.adjustments || 0,
    })) || [];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="movement" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="movement">Stock Movement</TabsTrigger>
          <TabsTrigger value="distribution">Category Distribution</TabsTrigger>
        </TabsList>
        <TabsContent value="movement">
          <Card>
            <CardHeader>
              <CardTitle>Stock Movement Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={movementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="stockIn"
                      stroke="#0088FE"
                      name="Stock In"
                    />
                    <Line
                      type="monotone"
                      dataKey="stockOut"
                      stroke="#FF8042"
                      name="Stock Out"
                    />
                    <Line
                      type="monotone"
                      dataKey="adjustments"
                      stroke="#00C49F"
                      name="Adjustments"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="distribution">
          <Card>
            <CardHeader>
              <CardTitle>Category Distribution</CardTitle>
            </CardHeader>
            <CardContent>
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
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Top Products by Movement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={movementAnalysis?.top_products.map((product) => ({
                  name: product.product__name,
                  value: product.total_movement,
                }))}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={150} />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
