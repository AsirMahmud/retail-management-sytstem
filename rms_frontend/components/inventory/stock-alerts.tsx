import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { AlertTriangle, Package, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useStockAlerts } from "@/hooks/queries/useInventory";
import React from "react";

interface StockAlert {
  id: string;
  name: string;
  quantity: number;
}

interface AlertItem {
  id: string;
  name: string;
  stock_quantity?: number;
}

interface AlertsData {
  low_stock?: AlertItem[];
  out_of_stock?: AlertItem[];
}

export function StockAlerts() {
  const { data: alertsData, isLoading } = useStockAlerts();

  // Transform and combine alerts data
  const alerts: StockAlert[] = React.useMemo(() => {
    if (!alertsData) return [];

    // Combine low stock and out of stock items
    const lowStock = ((alertsData as AlertsData).low_stock || []).map(
      (item: AlertItem) => ({
        id: item.id,
        name: item.name,
        quantity: item.stock_quantity || 0,
      })
    );

    const outOfStock = ((alertsData as AlertsData).out_of_stock || []).map(
      (item: AlertItem) => ({
        id: item.id,
        name: item.name,
        quantity: 0,
      })
    );

    return [...lowStock, ...outOfStock];
  }, [alertsData]);

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg animate-pulse">
        <CardHeader>
          <div className="h-6 w-48 bg-gray-200 rounded" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-10 w-10 bg-gray-200 rounded-full" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-3/4 bg-gray-200 rounded" />
                  <div className="h-3 w-1/2 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-900">
              Stock Alerts
            </CardTitle>
            <CardDescription>Products requiring attention</CardDescription>
          </div>
          <Badge variant="destructive" className="px-3 py-1">
            {alerts.length} Alerts
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No stock alerts at the moment
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-red-50 to-rose-50 border border-red-100"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-rose-500 rounded-full flex items-center justify-center">
                    {alert.quantity === 0 ? (
                      <Package className="h-5 w-5 text-white" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {alert.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <TrendingDown className="h-3 w-3 text-red-500" />
                      <p className="text-xs text-red-600">
                        {alert.quantity === 0
                          ? "Out of stock"
                          : `${alert.quantity} units remaining`}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={alert.quantity === 0 ? "destructive" : "secondary"}
                    className="ml-auto"
                  >
                    {alert.quantity === 0 ? "Critical" : "Low Stock"}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
