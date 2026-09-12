import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCustomerReport } from "@/hooks/queries/use-reports";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, DollarSign, ShoppingBag, XCircle, CheckCircle2, TrendingUp, AlertTriangle } from "lucide-react";

export function CustomerReport({
  dateRange,
}: {
  dateRange: { from: Date | undefined; to: Date | undefined };
}) {
  const { data: customerData, isLoading } = useCustomerReport(dateRange);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="rounded-2xl border border-slate-100 p-4">
              <Skeleton className="h-4 w-[100px] mb-3" />
              <Skeleton className="h-8 w-[120px] mb-2" />
              <Skeleton className="h-3 w-[80px]" />
            </Card>
          ))}
        </div>
        <Card className="rounded-2xl border border-slate-100 p-6">
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </Card>
      </div>
    );
  }

  if (!customerData) return null;

  return (
    <div className="space-y-6">
      {/* Modern Executive Metric Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden bg-white border border-slate-100/80 shadow-md hover:shadow-lg transition-all rounded-2xl">
          <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4 sm:px-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Customers
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
              <Users className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-5 pb-4">
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {customerData.total_customers}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {customerData.new_customers} new registered in period
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-white border border-slate-100/80 shadow-md hover:shadow-lg transition-all rounded-2xl">
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4 sm:px-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Sales
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
              <DollarSign className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-5 pb-4">
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              ${parseFloat(customerData.total_sales).toFixed(2)}
            </div>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">
              Avg ${(Number(customerData.average_customer_value) || 0).toFixed(2)} per customer
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-white border border-slate-100/80 shadow-md hover:shadow-lg transition-all rounded-2xl">
          <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4 sm:px-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Orders
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-5 pb-4">
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {customerData.total_orders ?? customerData.top_customers.length}
            </div>
            <p className="text-[11px] text-blue-600 font-medium mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              {customerData.completed_orders ?? customerData.top_customers.length} completed
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-white border border-slate-100/80 shadow-md hover:shadow-lg transition-all rounded-2xl">
          <div className="absolute top-0 left-0 right-0 h-1 bg-rose-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4 sm:px-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Cancelled Orders
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-sm">
              <XCircle className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-5 pb-4">
            <div className="text-2xl font-black text-rose-600 tracking-tight">
              {customerData.cancelled_orders ?? 0}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {customerData.cancellation_rate ? `${customerData.cancellation_rate}% cancellation rate` : "No cancellations recorded"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-slate-100/80 shadow-md bg-white rounded-2xl overflow-hidden">
        <CardHeader className="p-5 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
              Customer Acquisition Trend
            </CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">New customers registered over time</p>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="h-[280px] sm:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={customerData.customer_acquisition}>
                <defs>
                  <linearGradient id="custAcqGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900/90 text-white px-3.5 py-2.5 rounded-xl shadow-xl backdrop-blur-md text-xs border border-slate-800">
                          <p className="font-semibold text-slate-300 mb-1">{label}</p>
                          <p className="font-bold text-indigo-400">
                            +{payload[0].value} New Customers
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="new_customers"
                  stroke="#6366F1"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#custAcqGrad)"
                  name="New Customers"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-slate-100/80 shadow-md bg-white rounded-2xl overflow-hidden">
        <CardHeader className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
              Customer Purchase &amp; Cancellation Analysis
            </CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">
              Breakdown of customer orders, completed purchases, and cancellations
            </p>
          </div>
          <Badge variant="outline" className="text-xs bg-slate-50 text-slate-600 border-slate-200 w-fit">
            {customerData.top_customers.length} Active Customers
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/70">
                  <TableHead className="text-xs">Customer</TableHead>
                  <TableHead className="text-xs">Phone</TableHead>
                  <TableHead className="text-center text-xs">Total Orders</TableHead>
                  <TableHead className="text-center text-xs">Completed</TableHead>
                  <TableHead className="text-center text-xs">Cancelled</TableHead>
                  <TableHead className="text-center text-xs">Cancel Rate</TableHead>
                  <TableHead className="text-right text-xs">Total Sales</TableHead>
                  <TableHead className="text-right text-xs">Items</TableHead>
                  <TableHead className="text-right text-xs">Last Purchase</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customerData.top_customers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12 text-slate-400 text-xs">
                      No customer purchase records found for this period
                    </TableCell>
                  </TableRow>
                ) : (
                  customerData.top_customers.map((customer, idx) => {
                    const fullName = `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 'Anonymous Customer';
                    const cancelled = customer.cancelled_orders ?? 0;
                    const totalOrd = customer.total_orders ?? (customer.completed_orders ?? 1);
                    const completed = customer.completed_orders ?? totalOrd;
                    const cancelRate = customer.cancellation_rate ?? (totalOrd > 0 ? ((cancelled / totalOrd) * 100).toFixed(1) : 0);

                    return (
                      <TableRow key={`${customer.first_name}-${customer.last_name}-${idx}`} className="hover:bg-slate-50/80">
                        <TableCell className="font-semibold text-slate-900 text-xs">
                          {fullName}
                        </TableCell>
                        <TableCell className="text-xs text-slate-500 font-mono">
                          {customer.phone || 'N/A'}
                        </TableCell>
                        <TableCell className="text-center text-xs font-bold text-slate-900">
                          {totalOrd}
                        </TableCell>
                        <TableCell className="text-center text-xs">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {completed}
                          </span>
                        </TableCell>
                        <TableCell className="text-center text-xs">
                          {cancelled > 0 ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                              {cancelled}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-xs">0</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center text-xs">
                          {Number(cancelRate) > 0 ? (
                            <span className={`text-xs font-semibold ${Number(cancelRate) > 30 ? 'text-rose-600' : 'text-amber-600'}`}>
                              {cancelRate}%
                            </span>
                          ) : (
                            <span className="text-emerald-600 text-xs font-medium">0%</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right text-xs font-bold text-slate-900">
                          ${parseFloat(customer.total_sales).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right text-xs text-slate-500">
                          {customer.items_purchased}
                        </TableCell>
                        <TableCell className="text-right text-xs text-slate-500 whitespace-nowrap">
                          {customer.last_purchase_date || 'N/A'}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
