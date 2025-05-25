import { AlertCircle, ChevronRight } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const lowStockItems = [
  {
    id: "SKU-42578",
    name: "Classic Navy Blazer",
    variant: "40R / Navy",
    stock: 2,
    threshold: 5,
    status: "critical",
  },
  {
    id: "SKU-38765",
    name: "Oxford Dress Shirt",
    variant: "M / White",
    stock: 3,
    threshold: 10,
    status: "critical",
  },
  {
    id: "SKU-39245",
    name: "Silk Tie",
    variant: "Standard / Red Stripe",
    stock: 4,
    threshold: 8,
    status: "warning",
  },
  {
    id: "SKU-56821",
    name: "Leather Belt",
    variant: "34 / Black",
    stock: 5,
    threshold: 10,
    status: "warning",
  },
  {
    id: "SKU-78213",
    name: "Wool Dress Socks",
    variant: "One Size / Charcoal",
    stock: 6,
    threshold: 15,
    status: "warning",
  },
]

export function LowStockAlert() {
  return (
    <Card className="border-orange-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center text-orange-700">
          <AlertCircle className="mr-2 h-5 w-5" /> Low Stock Items
        </CardTitle>
        <CardDescription>Items that need to be restocked soon</CardDescription>
      </CardHeader>
      <CardContent className="pb-1">
        <div className="space-y-4">
          {lowStockItems.slice(0, 4).map((item) => (
            <div key={item.id} className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{item.name}</p>
                <div className="flex items-center pt-1">
                  <Badge
                    variant={item.status === "critical" ? "destructive" : "outline"}
                    className={item.status === "warning" ? "border-orange-500 text-orange-500" : ""}
                  >
                    {item.stock} left
                  </Badge>
                  <span className="ml-2 text-xs text-muted-foreground">{item.variant}</span>
                </div>
              </div>
              <div className="flex items-center justify-end">
                <p className="text-sm font-medium text-muted-foreground mr-2">{item.id}</p>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" className="w-full text-[#1E3A8A]" asChild>
          <Link href="/inventory/low-stock">
            View all low stock items
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
