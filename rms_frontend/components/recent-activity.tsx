import { Clock, ShoppingBag, Users, Package, AlertCircle, CreditCard, RefreshCw } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"

type Activity = {
  id: string
  type: "sale" | "customer" | "inventory" | "alert" | "payment"
  title: string
  description: string
  time: string
}

const recentActivities: Activity[] = [
  {
    id: "act-1",
    type: "sale",
    title: "New sale completed",
    description: "Classic Oxford Shirt (White, M) x1, Silk Tie (Burgundy) x1",
    time: "Just now",
  },
  {
    id: "act-2",
    type: "customer",
    title: "New customer registered",
    description: "Sarah Miller created an account",
    time: "15 minutes ago",
  },
  {
    id: "act-3",
    type: "inventory",
    title: "Inventory updated",
    description: "Received 24 units of Wool Dress Socks (Charcoal)",
    time: "32 minutes ago",
  },
  {
    id: "act-4",
    type: "alert",
    title: "Low stock alert",
    description: "Wool Blazer (Charcoal, 40R) is running low (2 left)",
    time: "45 minutes ago",
  },
  {
    id: "act-5",
    type: "payment",
    title: "Payment received",
    description: "Invoice #INV-2023-0042 paid by Robert Johnson",
    time: "1 hour ago",
  },
  {
    id: "act-6",
    type: "sale",
    title: "New sale completed",
    description: "Leather Belt (Black, 34) x1, Dress Pants (Navy, 32x32) x2",
    time: "1.5 hours ago",
  },
  {
    id: "act-7",
    type: "inventory",
    title: "Product updated",
    description: "Price updated for Cashmere Sweater collection",
    time: "2 hours ago",
  },
  {
    id: "act-8",
    type: "customer",
    title: "Customer feedback",
    description: "New 5-star review from James Davis",
    time: "3 hours ago",
  },
]

export function RecentActivity() {
  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "sale":
        return <ShoppingBag className="h-4 w-4" />
      case "customer":
        return <Users className="h-4 w-4" />
      case "inventory":
        return <Package className="h-4 w-4" />
      case "alert":
        return <AlertCircle className="h-4 w-4" />
      case "payment":
        return <CreditCard className="h-4 w-4" />
    }
  }

  const getActivityColor = (type: Activity["type"]) => {
    switch (type) {
      case "sale":
        return "bg-blue-100 text-blue-600"
      case "customer":
        return "bg-orange-100 text-orange-600"
      case "inventory":
        return "bg-green-100 text-green-600"
      case "alert":
        return "bg-red-100 text-red-600"
      case "payment":
        return "bg-purple-100 text-purple-600"
    }
  }

  return (
    <div className="space-y-4">
      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex gap-3">
              <div className="relative">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${getActivityColor(activity.type)}`}
                >
                  {getActivityIcon(activity.type)}
                </div>
                {activity.type === "sale" && (
                  <span className="absolute top-0 right-0 flex h-2 w-2 rounded-full bg-green-600"></span>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.title}</span> - {activity.description}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="flex justify-center">
        <Button variant="ghost" size="sm" className="w-full">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Activity
        </Button>
      </div>
    </div>
  )
}
