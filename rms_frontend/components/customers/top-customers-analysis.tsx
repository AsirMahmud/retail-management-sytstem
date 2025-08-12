import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Trophy, Medal, Award, Star, Crown } from "lucide-react";
import Link from "next/link";
import { useTopCustomers } from "@/hooks/queries/use-customer";
import { Skeleton } from "@/components/ui/skeleton";

const rankingIcons = [
  { icon: Crown, color: "text-yellow-500", bgColor: "bg-yellow-100" },
  { icon: Trophy, color: "text-gray-500", bgColor: "bg-gray-100" },
  { icon: Medal, color: "text-amber-600", bgColor: "bg-amber-100" },
  { icon: Award, color: "text-blue-500", bgColor: "bg-blue-100" },
  { icon: Star, color: "text-purple-500", bgColor: "bg-purple-100" },
];

export function TopCustomersAnalysis() {
  const { data: topCustomers, isLoading, error } = useTopCustomers();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Top 5 Customers
          </CardTitle>
          <CardDescription>
            Your highest-value customers based on total sales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-3 w-[150px]" />
                </div>
                <Skeleton className="h-8 w-[100px]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Top 5 Customers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Failed to load top customers</p>
        </CardContent>
      </Card>
    );
  }

  if (!topCustomers || topCustomers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Top 5 Customers
          </CardTitle>
          <CardDescription>
            Your highest-value customers based on total sales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No customers with sales found</p>
        </CardContent>
      </Card>
    );
  }

  const maxSales = Math.max(...topCustomers.map(c => c.total_sales));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Top 5 Customers
        </CardTitle>
        <CardDescription>
          Your highest-value customers based on total sales
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topCustomers.map((customer, index) => {
            const rankingIcon = rankingIcons[index];
            const IconComponent = rankingIcon.icon;
            const salesPercentage = (customer.total_sales / maxSales) * 100;
            const name = `${customer.first_name} ${customer.last_name}`;

            return (
              <div
                key={customer.id}
                className="flex items-center space-x-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className={`p-2 rounded-full ${rankingIcon.bgColor}`}>
                  <IconComponent className={`h-5 w-5 ${rankingIcon.color}`} />
                </div>
                
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={`https://avatar.vercel.sh/${customer.id}`}
                    alt={name}
                  />
                  <AvatarFallback>
                    {name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/customers/${customer.id}`}
                      className="font-medium hover:underline truncate"
                    >
                      {name}
                    </Link>
                    <Badge variant="secondary" className="text-xs">
                      #{customer.ranking}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span>{customer.sales_count} orders</span>
                    <span>•</span>
                    <span>
                      Avg: ${customer.average_order_value.toFixed(2)}
                    </span>
                    {customer.last_purchase_date && (
                      <>
                        <span>•</span>
                        <span>
                          Last: {new Date(customer.last_purchase_date).toLocaleDateString()}
                        </span>
                      </>
                    )}
                  </div>
                  
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Sales Performance</span>
                      <span className="font-medium">
                        ${customer.total_sales.toFixed(2)}
                      </span>
                    </div>
                    <Progress value={salesPercentage} className="h-2" />
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">
                    ${customer.total_sales.toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Total Sales
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Total Revenue</div>
              <div className="font-semibold">
                ${topCustomers.reduce((sum, c) => sum + c.total_sales, 0).toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Average Order Value</div>
              <div className="font-semibold">
                ${(topCustomers.reduce((sum, c) => sum + c.average_order_value, 0) / topCustomers.length).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}






