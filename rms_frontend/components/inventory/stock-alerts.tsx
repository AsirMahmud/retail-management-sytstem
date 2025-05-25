import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStockAlerts } from "@/hooks/queries/useInventory";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/inventory";

export function StockAlerts() {
  const { data: alerts, isLoading } = useStockAlerts();

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-[300px]" />
        <Skeleton className="h-[300px]" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Low Stock Items</CardTitle>
            <Badge variant="secondary" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              {alerts?.low_stock.length || 0} Items
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts?.low_stock.map((product: Product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/10 rounded-lg">
                    <Package className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.stock_quantity} units remaining
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-orange-600">
                  Min: {product.minimum_stock}
                </Badge>
              </div>
            ))}
            {(!alerts?.low_stock || alerts.low_stock.length === 0) && (
              <p className="text-center text-muted-foreground py-4">
                No low stock items
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Out of Stock Items</CardTitle>
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              {alerts?.out_of_stock.length || 0} Items
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts?.out_of_stock.map((product: Product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-950/20"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/10 rounded-lg">
                    <Package className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      SKU: {product.sku}
                    </p>
                  </div>
                </div>
                <Badge variant="destructive">Out of Stock</Badge>
              </div>
            ))}
            {(!alerts?.out_of_stock || alerts.out_of_stock.length === 0) && (
              <p className="text-center text-muted-foreground py-4">
                No out of stock items
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
