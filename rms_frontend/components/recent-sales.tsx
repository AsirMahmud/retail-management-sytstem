import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const recentSales = [
  {
    customer: "John Smith",
    email: "john.smith@example.com",
    amount: "$349.99",
    time: "15 min ago",
    items: "Navy Slim Fit Suit",
    initials: "JS",
  },
  {
    customer: "Alex Johnson",
    email: "alex.j@example.com",
    amount: "$159.95",
    time: "42 min ago",
    items: "Dress Shirts (2)",
    initials: "AJ",
  },
  {
    customer: "Michael Chen",
    email: "m.chen@example.com",
    amount: "$89.50",
    time: "1.5 hours ago",
    items: "Silk Tie + Pocket Square",
    initials: "MC",
  },
  {
    customer: "Robert Williams",
    email: "rob.w@example.com",
    amount: "$245.00",
    time: "2 hours ago",
    items: "Leather Oxford Shoes",
    initials: "RW",
  },
]

export function RecentSales() {
  return (
    <div className="space-y-8">
      {recentSales.map((sale, index) => (
        <div key={index} className="flex items-center gap-4">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-[#F1F5F9] text-[#1E3A8A]">{sale.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{sale.customer}</p>
            <p className="text-xs text-muted-foreground">{sale.items}</p>
            <p className="text-xs text-muted-foreground">{sale.time}</p>
          </div>
          <div className="font-medium">{sale.amount}</div>
        </div>
      ))}
    </div>
  )
}
