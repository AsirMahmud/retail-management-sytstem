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
import { Skeleton } from "@/components/ui/skeleton";

interface SalesSummaryCardsProps {
  stats: {
    total_revenue: number;
    total_sales: number;
    average_order_value: number;
    unique_customers: number;
    previous_period: {
      total_revenue: number;
      total_sales: number;
      average_order_value: number;
      unique_customers: number;
    };
  } | null;
  isLoading: boolean;
}

export function SalesSummaryCards({
  stats,
  isLoading,
}: SalesSummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[120px] mb-2" />
              <Skeleton className="h-4 w-[80px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  // Calculate percentage changes
  const revenueChange =
    ((stats.total_revenue - stats.previous_period.total_revenue) /
      stats.previous_period.total_revenue) *
    100;
  const salesChange =
    ((stats.total_sales - stats.previous_period.total_sales) /
      stats.previous_period.total_sales) *
    100;
  const avgOrderChange =
    ((stats.average_order_value - stats.previous_period.average_order_value) /
      stats.previous_period.average_order_value) *
    100;
  const customersChange =
    ((stats.unique_customers - stats.previous_period.unique_customers) /
      stats.previous_period.unique_customers) *
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
            ${stats.total_revenue.toFixed(2)}
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
          <div className="text-2xl font-bold">{stats.total_sales}</div>
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
            ${stats.average_order_value.toFixed(2)}
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
          <div className="text-2xl font-bold">{stats.unique_customers}</div>
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
