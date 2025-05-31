"use client";

import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SalesOverviewChart } from "@/components/sales/sales-overview-chart";
import { SalesHistoryTable } from "@/components/sales/sales-history-table";
import { SalesByProductTable } from "@/components/sales/sales-by-product-table";
import { SalesByStaffTable } from "@/components/sales/sales-by-staff-table";
import { SalesSummaryCards } from "@/components/sales/sales-summary-cards";
import { SalesFilterBar } from "@/components/sales/sales-filter-bar";
import { useSales, useDashboardStats } from "@/hooks/queries/use-sales";
import { useState } from "react";

export default function SalesPage() {
  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    status: "",
    payment_method: "",
    customer_phone: "",
    search: "",
    ordering: "-date",
  });

  const { sales, isLoading: isLoadingSales } = useSales(filters);
  const { data: dashboardStats, isLoading: isLoadingStats } =
    useDashboardStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sales</h1>
        <p className="text-muted-foreground">View and manage your sales data</p>
      </div>

      <SalesFilterBar onFilterChange={setFilters} />

      <SalesSummaryCards stats={dashboardStats} isLoading={isLoadingStats} />

      <SalesOverviewChart
        data={dashboardStats?.sales_overview}
        isLoading={isLoadingStats}
      />

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Top Products</TabsTrigger>
          <TabsTrigger value="history">Sales History</TabsTrigger>
          <TabsTrigger value="staff">Staff Performance</TabsTrigger>
        </TabsList>
        <TabsContent value="products" className="space-y-4">
          <SalesByProductTable
            data={dashboardStats?.top_products}
            isLoading={isLoadingStats}
          />
        </TabsContent>
        <TabsContent value="history" className="space-y-4">
          <SalesHistoryTable data={sales} isLoading={isLoadingSales} />
        </TabsContent>
        <TabsContent value="staff" className="space-y-4">
          <SalesByStaffTable
            data={dashboardStats?.staff_performance}
            isLoading={isLoadingStats}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
