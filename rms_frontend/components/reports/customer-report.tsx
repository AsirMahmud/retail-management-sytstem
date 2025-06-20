"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
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
import { DateRange } from "react-day-picker";
import { Skeleton } from "@/components/ui/skeleton";

export function CustomerReport({
  dateRange,
}: {
  dateRange: { from: Date | undefined; to: Date | undefined };
}) {
  const { data: customerData, isLoading } = useCustomerReport(dateRange);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
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
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[200px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!customerData) return null;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customerData.total_customers}
            </div>
            <p className="text-xs text-muted-foreground">
              {customerData.new_customers} new this period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${parseFloat(customerData.total_sales).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {customerData.top_customers.length} active customers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Customer Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${parseFloat(customerData.average_customer_value).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Per customer</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Acquisition</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={customerData.customer_acquisition}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="new_customers"
                  stroke="#8884d8"
                  name="New Customers"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Total Sales</TableHead>
                <TableHead>Items Purchased</TableHead>
                <TableHead>Unique Products</TableHead>
                <TableHead className="text-right">Last Purchase</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customerData.top_customers.map((customer) => (
                <TableRow key={`${customer.first_name}-${customer.last_name}`}>
                  <TableCell>{`${customer.first_name} ${customer.last_name}`}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>
                    ${parseFloat(customer.total_sales).toFixed(2)}
                  </TableCell>
                  <TableCell>{customer.items_purchased}</TableCell>
                  <TableCell>{customer.unique_products}</TableCell>
                  <TableCell className="text-right">
                    {customer.last_purchase_date}
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
