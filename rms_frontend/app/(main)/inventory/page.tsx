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
} from "lucide-react";
import Link from "next/link";
import { useDashboardOverview } from "@/hooks/queries/useInventory";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardCharts } from "@/components/inventory/dashboard-charts";
import { StockAlerts } from "@/components/inventory/stock-alerts";
import React from "react";

export default function InventoryPage() {
  const { data: overview, isLoading } = useDashboardOverview("day");
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
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Inventory Management
          </h1>
          <p className="text-lg text-muted-foreground">
            Monitor your stock levels, manage products, and track inventory
            performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Link href="/inventory/add-product">
            <Button size="lg" className="shadow-lg">
              <PlusCircle className="h-5 w-5 mr-2" />
              Add New Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/50 dark:to-blue-900/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Total Products
            </CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
              {overview?.metrics.total_products}
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-xs text-green-600 font-medium">
                {overview?.metrics.active_products} Active
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/50 dark:to-green-900/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
              Total Value
            </CardTitle>
            <div className="p-2 bg-green-500/10 rounded-lg">
              <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900 dark:text-green-100">
              ${overview?.metrics.total_inventory_value.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-xs text-green-600 font-medium">
                Current Inventory Value
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/50 dark:to-orange-900/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
              Low Stock Items
            </CardTitle>
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">
              {overview?.metrics.low_stock_products}
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingDown className="h-3 w-3 text-orange-600" />
              <span className="text-xs text-orange-600 font-medium">
                Needs attention
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/50 dark:to-red-900/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300">
              Out of Stock
            </CardTitle>
            <div className="p-2 bg-red-500/10 rounded-lg">
              <Package className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-900 dark:text-red-100">
              {overview?.metrics.out_of_stock_products}
            </div>
            <div className="flex items-center gap-1 mt-2">
              <AlertTriangle className="h-3 w-3 text-red-600" />
              <span className="text-xs text-red-600 font-medium">
                Immediate action required
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stock Health Overview */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Stock Health Overview</CardTitle>
              <CardDescription>
                Current inventory status and performance metrics
              </CardDescription>
            </div>
            <Badge
              variant={
                stockHealth > 80
                  ? "default"
                  : stockHealth > 60
                  ? "secondary"
                  : "destructive"
              }
            >
              {stockHealth > 80
                ? "Healthy"
                : stockHealth > 60
                ? "Moderate"
                : "Critical"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Stock Availability</span>
              <span className="font-medium">{stockHealth.toFixed(1)}%</span>
            </div>
            <Progress value={stockHealth} className="h-2" />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-950/20">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">In Stock</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                  {overview?.metrics?.total_products &&
                  overview?.metrics?.out_of_stock_products
                    ? overview.metrics.total_products -
                      overview.metrics.out_of_stock_products
                    : 0}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Low Stock</p>
                <p className="text-2xl font-bold text-orange-700 dark:text-orange-400">
                  {overview?.metrics.low_stock_products}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-red-50 dark:bg-red-950/20">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <Package className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Out of Stock</p>
                <p className="text-2xl font-bold text-red-700 dark:text-red-400">
                  {overview?.metrics.out_of_stock_products}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stock Alerts */}
      <StockAlerts />

      {/* Charts */}
      <DashboardCharts />

      {/* Navigation Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Link href="/inventory/products" className="group">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/50 dark:to-purple-900/30">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-purple-500/10 rounded-xl">
                  <Package className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <ArrowUpRight className="h-5 w-5 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100">
                  Products
                </h3>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Manage your product inventory and stock levels
                </p>
              </div>
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                    View All
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                    Add New
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/inventory/categories" className="group">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-950/50 dark:to-indigo-900/30">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-indigo-500/10 rounded-xl">
                  <Tag className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <ArrowUpRight className="h-5 w-5 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-100">
                  Categories
                </h3>
                <p className="text-sm text-indigo-700 dark:text-indigo-300">
                  Organize products into logical categories
                </p>
              </div>
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-indigo-600" />
                  <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                    Organize
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-indigo-600" />
                  <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                    Manage
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/inventory/suppliers" className="group">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] bg-gradient-to-br from-teal-50 to-teal-100/50 dark:from-teal-950/50 dark:to-teal-900/30">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-teal-500/10 rounded-xl">
                  <Users className="h-8 w-8 text-teal-600 dark:text-teal-400" />
                </div>
                <ArrowUpRight className="h-5 w-5 text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h3 className="text-xl font-bold text-teal-900 dark:text-teal-100">
                  Suppliers
                </h3>
                <p className="text-sm text-teal-700 dark:text-teal-300">
                  Track and manage your product suppliers
                </p>
              </div>
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-teal-600" />
                  <span className="text-sm font-medium text-teal-700 dark:text-teal-300">
                    Track
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-teal-600" />
                  <span className="text-sm font-medium text-teal-700 dark:text-teal-300">
                    Order
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Quick Actions</CardTitle>
          <CardDescription>
            Frequently used inventory management tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/inventory/add-product">
              <Button
                variant="outline"
                className="w-full h-16 flex-col gap-2 hover:bg-primary/5 hover:border-primary/20"
              >
                <PlusCircle className="h-5 w-5" />
                <span className="font-medium">Add Product</span>
              </Button>
            </Link>
            <Link href="/inventory/categories">
              <Button
                variant="outline"
                className="w-full h-16 flex-col gap-2 hover:bg-primary/5 hover:border-primary/20"
              >
                <Tag className="h-5 w-5" />
                <span className="font-medium">Manage Categories</span>
              </Button>
            </Link>
            <Link href="/inventory/suppliers">
              <Button
                variant="outline"
                className="w-full h-16 flex-col gap-2 hover:bg-primary/5 hover:border-primary/20"
              >
                <Users className="h-5 w-5" />
                <span className="font-medium">Manage Suppliers</span>
              </Button>
            </Link>
            <Link href="/inventory/reports">
              <Button
                variant="outline"
                className="w-full h-16 flex-col gap-2 hover:bg-primary/5 hover:border-primary/20"
              >
                <BarChart3 className="h-5 w-5" />
                <span className="font-medium">View Reports</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
