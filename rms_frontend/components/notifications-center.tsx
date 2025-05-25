import { Bell, CheckCircle, AlertCircle, Info } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type Notification = {
  id: string
  type: "success" | "warning" | "info" | "error"
  title: string
  description: string
  time: string
  read: boolean
}

const notifications: Notification[] = [
  {
    id: "notif-1",
    type: "warning",
    title: "Low Stock Alert",
    description: "5 products are running low on inventory",
    time: "Just now",
    read: false,
  },
  {
    id: "notif-2",
    type: "success",
    title: "Daily Sales Goal Reached",
    description: "Congratulations! You've reached your daily sales target.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "notif-3",
    type: "info",
    title: "New Feature Available",
    description: "Check out the new discount management system",
    time: "Yesterday",
    read: true,
  },
  {
    id: "notif-4",
    type: "error",
    title: "Payment Failed",
    description: "A customer payment for order #4582 has failed",
    time: "Yesterday",
    read: true,
  },
  {
    id: "notif-5",
    type: "info",
    title: "Staff Meeting Reminder",
    description: "Don't forget about the team meeting tomorrow at 10 AM",
    time: "2 days ago",
    read: true,
  },
]

export function NotificationsCenter() {
  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4" />
      case "warning":
        return <AlertCircle className="h-4 w-4" />
      case "info":
        return <Info className="h-4 w-4" />
      case "error":
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-600"
      case "warning":
        return "bg-orange-100 text-orange-600"
      case "info":
        return "bg-blue-100 text-blue-600"
      case "error":
        return "bg-red-100 text-red-600"
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Bell className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">Notifications</span>
        </div>
        {unreadCount > 0 && (
          <Badge variant="secondary" className="text-xs">
            {unreadCount} new
          </Badge>
        )}
      </div>

      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex gap-3 p-3 rounded-lg ${!notification.read ? "bg-muted/50" : ""}`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${getNotificationColor(
                  notification.type,
                )}`}
              >
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{notification.title}</p>
                  {!notification.read && <div className="h-2 w-2 rounded-full bg-blue-600"></div>}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{notification.description}</p>
                <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <Button variant="outline" size="sm" className="w-full">
        Mark all as read
      </Button>
    </div>
  )
}
