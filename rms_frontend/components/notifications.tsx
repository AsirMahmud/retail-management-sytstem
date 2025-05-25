import { Bell, CheckCircle, Clock, PackageIcon, RefreshCw, ShoppingCart } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const notifications = [
  {
    id: 1,
    title: "New order placed",
    description: "Order #1084 - Thomas Anderson - $289.99",
    time: "10 minutes ago",
    icon: ShoppingCart,
    color: "text-green-600",
  },
  {
    id: 2,
    title: "Inventory shipment arrived",
    description: "PO #4582 - Summer Collection - 124 items",
    time: "45 minutes ago",
    icon: PackageIcon,
    color: "text-blue-600",
  },
  {
    id: 3,
    title: "Staff schedule updated",
    description: "Changes to weekend shifts - May 8-9",
    time: "2 hours ago",
    icon: RefreshCw,
    color: "text-orange-500",
  },
  {
    id: 4,
    title: "Return processed",
    description: "Order #1062 - Michael Brown - Refund issued",
    time: "3 hours ago",
    icon: CheckCircle,
    color: "text-purple-600",
  },
]

export function Notifications() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center">
          <Bell className="mr-2 h-5 w-5" /> Recent Notifications
        </CardTitle>
        <CardDescription>Important system notifications and alerts</CardDescription>
      </CardHeader>
      <CardContent className="pb-1">
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id} className="flex gap-3">
              <div className={`mt-0.5 rounded-full p-1.5 ${notification.color} bg-opacity-10`}>
                <notification.icon className={`h-4 w-4 ${notification.color}`} />
              </div>
              <div className="space-y-1 flex-1">
                <p className="text-sm font-medium leading-none">{notification.title}</p>
                <p className="text-xs text-muted-foreground">{notification.description}</p>
                <div className="flex items-center pt-1">
                  <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{notification.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" className="w-full text-[#1E3A8A]" asChild>
          <Link href="/notifications">View all notifications</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
