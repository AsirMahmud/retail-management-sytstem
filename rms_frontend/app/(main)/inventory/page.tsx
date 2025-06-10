"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import {
  Package,
  Tag,
  Users,
  PlusCircle,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  DollarSign,
  BarChart3,
  ShoppingCart,
  Activity,
  ArrowUpRight,
  Eye,
  Settings,
  LineChart,
  PieChart,
  ArrowDownRight,
  Clock,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useDashboardOverview } from "@/hooks/queries/useInventory";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardCharts } from "@/components/inventory/dashboard-charts";
import { StockAlerts } from "@/components/inventory/stock-alerts";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function InventoryPage() {
  const { data: overview, isLoading } = useDashboardOverview("month");
  const { toast } = useToast();

  // Add toast notifications when data loads
  React.useEffect(() => {
    if (!isLoading && overview) {
      // Show stock health status
      const stockHealth =
        (overview?.metrics?.total_products || 0) > 0
          ? (((overview?.metrics?.total_products || 0) -
              (overview?.metrics?.out_of_stock_products || 0)) /
              (overview?.metrics?.total_products || 1)) *
            100
          : 0;

      if (stockHealth <= 60) {
        toast({
          variant: "destructive",
          title: "Critical Stock Health",
          description: `Your inventory health is at ${stockHealth.toFixed(
            1
          )}%. Immediate action required.`,
        });
      }

      // Show low stock warning
      if (overview?.metrics?.low_stock_products > 0) {
        toast({
          variant: "default",
          title: "Low Stock Alert",
          description: `${overview.metrics.low_stock_products} items are running low on stock.`,
        });
      }

      // Show out of stock warning
      if (overview?.metrics?.out_of_stock_products > 0) {
        toast({
          variant: "destructive",
          title: "Out of Stock Alert",
          description: `${overview.metrics.out_of_stock_products} items are out of stock.`,
        });
      }
    }
  }, [isLoading, overview, toast]);

  if (isLoading) {
    return (
      <div className="space-y-8 p-6">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const stockHealth =
    (overview?.metrics?.total_products || 0) > 0
      ? (((overview?.metrics?.total_products || 0) -
          (overview?.metrics?.out_of_stock_products || 0)) /
          (overview?.metrics?.total_products || 1)) *
        100
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Inventory Management
              </h1>
              <p className="text-gray-600 mt-1">
                Monitor your stock levels, manage products, and track inventory
                performance
              </p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Total Products
              </CardTitle>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <Package className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {overview?.metrics.total_products}
              </div>
              <p className="text-xs text-blue-600 font-medium mt-1">
                {overview?.metrics.active_products} Active Products
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-teal-100 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Total Value
              </CardTitle>
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                ${overview?.metrics.total_inventory_value.toLocaleString()}
              </div>
              <p className="text-xs text-emerald-600 font-medium mt-1">
                Current Inventory Value
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-amber-100 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Low Stock Items
              </CardTitle>
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {overview?.metrics.low_stock_products}
              </div>
              <p className="text-xs text-orange-600 font-medium mt-1">
                Needs attention
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-rose-100 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Out of Stock
              </CardTitle>
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-rose-500 rounded-full flex items-center justify-center">
                <Package className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {overview?.metrics.out_of_stock_products}
              </div>
              <p className="text-xs text-red-600 font-medium mt-1">
                Immediate action required
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="mt-8">
          <DashboardCharts />
        </div>

        {/* Stock Alerts */}
        <div className="mt-8">
          <StockAlerts />
        </div>
      </div>
    </div>
  );
}
