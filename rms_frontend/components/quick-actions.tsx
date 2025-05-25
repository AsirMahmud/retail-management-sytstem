import type React from "react"
import { Plus, Search, Tag, Download, BarChart4, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type QuickAction = {
  id: string
  icon: React.ReactNode
  label: string
  description: string
  href: string
  variant: "default" | "outline" | "secondary" | "ghost"
}

const quickActions: QuickAction[] = [
  {
    id: "new-sale",
    icon: <Plus className="h-4 w-4" />,
    label: "New Sale",
    description: "Create a new sales transaction",
    href: "/pos",
    variant: "default",
  },
  {
    id: "add-product",
    icon: <Tag className="h-4 w-4" />,
    label: "Add Product",
    description: "Add a new product to inventory",
    href: "/inventory/add-product",
    variant: "outline",
  },
  {
    id: "search-inventory",
    icon: <Search className="h-4 w-4" />,
    label: "Search Inventory",
    description: "Find products in your inventory",
    href: "/inventory",
    variant: "outline",
  },
  {
    id: "export-report",
    icon: <Download className="h-4 w-4" />,
    label: "Export Report",
    description: "Download sales or inventory reports",
    href: "/reports",
    variant: "secondary",
  },
  {
    id: "view-analytics",
    icon: <BarChart4 className="h-4 w-4" />,
    label: "View Analytics",
    description: "See detailed business analytics",
    href: "/reports/analytics",
    variant: "secondary",
  },
  {
    id: "manage-customers",
    icon: <Users className="h-4 w-4" />,
    label: "Manage Customers",
    description: "View and edit customer information",
    href: "/customers",
    variant: "ghost",
  },
]

export function QuickActions() {
  return (
    <div className="grid gap-3">
      {quickActions.map((action) => (
        <Button key={action.id} variant={action.variant} className="justify-start h-auto py-3" asChild>
          <Link href={action.href}>
            <div className="flex items-center">
              <div className="mr-3">{action.icon}</div>
              <div className="text-left">
                <div className="font-medium">{action.label}</div>
                <div className="text-xs text-muted-foreground">{action.description}</div>
              </div>
            </div>
          </Link>
        </Button>
      ))}
    </div>
  )
}
