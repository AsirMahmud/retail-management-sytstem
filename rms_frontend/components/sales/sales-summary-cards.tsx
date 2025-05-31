"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowDown,
  ArrowUp,
  DollarSign,
  ShoppingBag,
  Users,
  CreditCard,
} from "lucide-react";

// Import the sales context
import { useSales } from "@/context/sales-context";

export function SalesSummaryCards() {
  // Use the sales context for real data
  const { salesSummary } = useSales();

  // Sample previous period data for comparison
  const previousPeriod = {
    totalRevenue: salesSummary.totalRevenue * 0.9,
    totalSales: salesSummary.totalSales * 0.92,
    avgOrderValue: salesSummary.avgOrderValue * 0.97,
    uniqueCustomers: salesSummary.uniqueCustomers * 0.95,
  };

  // Calculate percentage changes
  const revenueChange =
    ((salesSummary.totalRevenue - previousPeriod.totalRevenue) /
      previousPeriod.totalRevenue) *
    100;
  const salesChange =
    ((salesSummary.totalSales - previousPeriod.totalSales) /
      previousPeriod.totalSales) *
    100;
  const avgOrderChange =
    ((salesSummary.avgOrderValue - previousPeriod.avgOrderValue) /
      previousPeriod.avgOrderValue) *
    100;
  const customersChange =
    ((salesSummary.uniqueCustomers - previousPeriod.uniqueCustomers) /
      previousPeriod.uniqueCustomers) *
    100;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${salesSummary.totalRevenue.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">
            <span
              className={
                revenueChange >= 0
                  ? "text-emerald-500 flex items-center"
                  : "text-rose-500 flex items-center"
              }
            >
              {revenueChange >= 0 ? (
                <ArrowUp className="mr-1 h-4 w-4" />
              ) : (
                <ArrowDown className="mr-1 h-4 w-4" />
              )}
              {Math.abs(revenueChange).toFixed(1)}%
            </span>{" "}
            from last period
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sales Count</CardTitle>
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{salesSummary.totalSales}</div>
          <p className="text-xs text-muted-foreground">
            <span
              className={
                salesChange >= 0
                  ? "text-emerald-500 flex items-center"
                  : "text-rose-500 flex items-center"
              }
            >
              {salesChange >= 0 ? (
                <ArrowUp className="mr-1 h-4 w-4" />
              ) : (
                <ArrowDown className="mr-1 h-4 w-4" />
              )}
              {Math.abs(salesChange).toFixed(1)}%
            </span>{" "}
            from last period
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Average Order Value
          </CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${salesSummary.avgOrderValue.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">
            <span
              className={
                avgOrderChange >= 0
                  ? "text-emerald-500 flex items-center"
                  : "text-rose-500 flex items-center"
              }
            >
              {avgOrderChange >= 0 ? (
                <ArrowUp className="mr-1 h-4 w-4" />
              ) : (
                <ArrowDown className="mr-1 h-4 w-4" />
              )}
              {Math.abs(avgOrderChange).toFixed(1)}%
            </span>{" "}
            from last period
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Unique Customers
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {salesSummary.uniqueCustomers}
          </div>
          <p className="text-xs text-muted-foreground">
            <span
              className={
                customersChange >= 0
                  ? "text-emerald-500 flex items-center"
                  : "text-rose-500 flex items-center"
              }
            >
              {customersChange >= 0 ? (
                <ArrowUp className="mr-1 h-4 w-4" />
              ) : (
                <ArrowDown className="mr-1 h-4 w-4" />
              )}
              {Math.abs(customersChange).toFixed(1)}%
            </span>{" "}
            from last period
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
