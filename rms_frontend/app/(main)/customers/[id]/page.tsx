"use client";
import { use } from "react";
import {
  ArrowLeft,
  Calendar,
  Download,
  Mail,
  MapPin,
  Phone,
  ShoppingBag,
  CreditCard,
  Package,
  Crown,
  Trophy,
  Medal,
  Award,
  Star,
  AlertTriangle,
  DollarSign,
  Percent,
  Clock,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useCustomer } from "@/hooks/queries/use-customer";
import { Skeleton } from "@/components/ui/skeleton";
import type { Customer } from "@/types/customer";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const rankingIcons = [
  { icon: Crown, color: "text-yellow-500", bgColor: "bg-yellow-100", label: "Top 5" },
  { icon: Trophy, color: "text-gray-500", bgColor: "bg-gray-100", label: "Top 10" },
  { icon: Medal, color: "text-amber-600", bgColor: "bg-amber-100", label: "Top 20" },
  { icon: Award, color: "text-blue-500", bgColor: "bg-blue-100", label: "Top 30" },
  { icon: Star, color: "text-purple-500", bgColor: "bg-purple-100", label: "Top 50" },
];

const getRankingIcon = (ranking: number) => {
  if (ranking <= 5) return rankingIcons[0];
  if (ranking <= 10) return rankingIcons[1];
  if (ranking <= 20) return rankingIcons[2];
  if (ranking <= 30) return rankingIcons[3];
  if (ranking <= 50) return rankingIcons[4];
  if (ranking <= 100) return { icon: Users, color: "text-green-500", bgColor: "bg-green-100", label: "Top 100" };
  return null;
};

export default function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: customer, isLoading } = useCustomer(parseInt(id));

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" asChild>
              <Link href="/customers">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-3">
                <Skeleton className="h-24 w-24 rounded-full" />
                <Skeleton className="h-6 w-32" />
              </div>
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Customer Not Found</h1>
          <p className="text-muted-foreground mt-2">
            The customer you're looking for doesn't exist or has been removed.
          </p>
          <Button className="mt-4" asChild>
            <Link href="/customers">Back to Customers</Link>
          </Button>
        </div>
      </div>
    );
  }

  const isTopCustomer = customer.is_top_customer;
  const ranking = customer.ranking;
  const rankingIcon = ranking ? getRankingIcon(ranking) : null;
  const IconComponent = rankingIcon?.icon;

  // Debug logging for discount data
  console.log('Customer data:', {
    average_discount: customer.average_discount,
    purchase_history: customer.purchase_history?.length,
    sample_purchase: customer.purchase_history?.[0]
  });

  // Calculate due details
  const dueDetails = customer.purchase_history?.reduce((acc: any, sale: any) => {
    const amountDue = parseFloat(sale.amount_due?.toString() || '0') || 0;
    if (amountDue > 0) {
      acc.totalDue += amountDue;
      acc.dueSales.push(sale);
    }
    return acc;
  }, { totalDue: 0, dueSales: [] }) || { totalDue: 0, dueSales: [] };

  // Calculate discount details from purchase history
  const discountDetails = customer.purchase_history?.reduce((acc: any, sale: any) => {
    const discount = parseFloat(sale.discount?.toString() || '0') || 0;
    const total = parseFloat(sale.total_amount?.toString() || '0') || 0;
    if (total > 0) {
      acc.totalDiscount += discount;
      acc.totalSales += total;
      acc.salesWithDiscount += discount > 0 ? 1 : 0;
      acc.totalSalesCount += 1;
    }
    return acc;
  }, { totalDiscount: 0, totalSales: 0, salesWithDiscount: 0, totalSalesCount: 0 }) || { totalDiscount: 0, totalSales: 0, salesWithDiscount: 0, totalSalesCount: 0 };

  // Use backend-calculated average discount if available, otherwise calculate from purchase history
  const averageDiscount = customer.average_discount || (discountDetails.totalSales > 0 ? (discountDetails.totalDiscount / discountDetails.totalSales) * 100 : 0);
  const averageDiscountAmount = discountDetails.totalSalesCount > 0 ? discountDetails.totalDiscount / discountDetails.totalSalesCount : 0;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/customers">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Customer Details</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button variant="outline">Edit Customer</Button>
          <Button>New Sale</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-3">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={`https://avatar.vercel.sh/${customer.id}`} />
                  <AvatarFallback className="text-2xl">
                    {`${customer.first_name || ""} ${customer.last_name || ""}`
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {isTopCustomer && (
                  <div className="absolute -top-2 -right-2">
                    <Crown className="h-6 w-6 text-yellow-500" />
                  </div>
                )}
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <h2 className="text-xl font-bold">
                    {customer.first_name} {customer.last_name}
                  </h2>
                  {isTopCustomer && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      Top Customer
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Customer since{" "}
                  {new Date(customer.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{customer.email || "No email"}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{customer.address || "No address"}</span>
              </div>
              {customer.date_of_birth && (
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    DOB: {new Date(customer.date_of_birth).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant={customer.is_active ? "default" : "destructive"}>
                  {customer.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              
              {/* Ranking Information */}
              {ranking && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Ranking:</span>
                  <div className="flex items-center gap-2">
                    {rankingIcon && IconComponent && (
                      <div className={`p-1 rounded-full ${rankingIcon.bgColor}`}>
                        <IconComponent className={`h-4 w-4 ${rankingIcon.color}`} />
                      </div>
                    )}
                    <Badge variant="outline">
                      #{ranking} of all customers
                    </Badge>
                    {rankingIcon && (
                      <span className="text-xs text-muted-foreground">
                        {rankingIcon.label}
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Sales:</span>
                <span className="font-medium">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(customer.total_sales)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sales Count:</span>
                <span className="font-medium">{customer.sales_count}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Sale:</span>
                <span className="font-medium">
                  {customer.last_sale_date
                    ? new Date(customer.last_sale_date).toLocaleDateString()
                    : "No sales yet"}
                </span>
              </div>
              {customer.sales_count > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Order Value:</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(customer.total_sales / customer.sales_count)}
                  </span>
                </div>
              )}
            </div>

            <Separator />

            {/* Due Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <span className="font-medium">Due Details</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Due:</span>
                <span className={`font-medium ${dueDetails.totalDue > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(dueDetails.totalDue)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Due Sales:</span>
                <span className="font-medium">
                  {dueDetails.dueSales.length} sales
                </span>
              </div>
              
              {dueDetails.totalDue > 0 && (
                <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center gap-2 text-orange-800">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">Payment Required</span>
                  </div>
                  <p className="text-xs text-orange-700 mt-1">
                    This customer has outstanding payments totaling {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(dueDetails.totalDue)}
                  </p>
                </div>
              )}
            </div>

            <Separator />

            {/* Discount Information */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Percent className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Discount History</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg Discount %:</span>
                <span className="font-medium text-blue-600">
                  {averageDiscount.toFixed(1)}%
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg Discount Amount:</span>
                <span className="font-medium">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(averageDiscountAmount)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Discount Given:</span>
                <span className="font-medium">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(discountDetails.totalDiscount)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sales with Discount:</span>
                <span className="font-medium">
                  {discountDetails.salesWithDiscount} of {discountDetails.totalSalesCount}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Discount Rate:</span>
                <span className="font-medium text-blue-600">
                  {discountDetails.totalSalesCount > 0 ? ((discountDetails.salesWithDiscount / discountDetails.totalSalesCount) * 100).toFixed(1) : 0}%
                </span>
              </div>
              
              {/* Discount Summary Card */}
              {discountDetails.totalDiscount > 0 && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-800">
                    <Percent className="h-4 w-4" />
                    <span className="text-sm font-medium">Discount Summary</span>
                  </div>
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-blue-700">
                      This customer has received <strong>{averageDiscount.toFixed(1)}%</strong> average discount
                    </p>
                    <p className="text-xs text-blue-700">
                      Total savings: <strong>{new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(discountDetails.totalDiscount)}</strong>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="purchases" className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="purchases">Purchase History</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
            <TabsContent value="purchases" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Purchase History</CardTitle>
                  <CardDescription>
                    Customer's previous orders and transactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-6">
                      {customer.purchase_history.map((purchase: any) => (
                        <Card key={purchase.id} className="overflow-hidden">
                          <CardHeader className="bg-muted/50 py-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <ShoppingBag className="h-4 w-4" />
                                <span className="font-medium">
                                  Order #{purchase.id}
                                </span>
                              </div>
                              <div className="flex items-center space-x-4">
                                <Badge variant="outline">
                                  {purchase.payment_method}
                                </Badge>
                                <Badge
                                  variant={
                                    purchase.status === "completed"
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {purchase.status}
                                </Badge>
                                {purchase.amount_due && purchase.amount_due > 0 && (
                                  <Badge variant="destructive" className="text-xs">
                                    Due: {new Intl.NumberFormat("en-US", {
                                      style: "currency",
                                      currency: "USD",
                                    }).format(purchase.amount_due)}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
                              <span>
                                {new Date(purchase.date).toLocaleDateString()}
                              </span>
                              <div className="flex items-center gap-4">
                                {parseFloat(purchase.discount?.toString() || '0') > 0 && (
                                  <Badge variant="secondary" className="text-blue-600 bg-blue-50">
                                    <Percent className="h-3 w-3 mr-1" />
                                    Discount: {new Intl.NumberFormat("en-US", {
                                      style: "currency",
                                      currency: "USD",
                                    }).format(parseFloat(purchase.discount))}
                                  </Badge>
                                )}
                                <span className="font-medium">
                                  {new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                  }).format(parseFloat(purchase.total_amount))}
                                </span>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="p-4">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Product</TableHead>
                                  <TableHead>Size</TableHead>
                                  <TableHead>Color</TableHead>
                                  <TableHead className="text-right">
                                    Quantity
                                  </TableHead>
                                  <TableHead className="text-right">
                                    Price
                                  </TableHead>
                                  <TableHead className="text-right">
                                    Total
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {purchase.items.map((item: any, index: number) => (
                                  <TableRow key={index}>
                                    <TableCell>{item.product_name}</TableCell>
                                    <TableCell>{item.size}</TableCell>
                                    <TableCell>{item.color}</TableCell>
                                    <TableCell className="text-right">
                                      {item.quantity}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      {new Intl.NumberFormat("en-US", {
                                        style: "currency",
                                        currency: "USD",
                                      }).format(parseFloat(item.unit_price))}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      {new Intl.NumberFormat("en-US", {
                                        style: "currency",
                                        currency: "USD",
                                      }).format(parseFloat(item.total))}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="preferences" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Preferences</CardTitle>
                  <CardDescription>Coming soon...</CardDescription>
                </CardHeader>
              </Card>
            </TabsContent>
            <TabsContent value="notes" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Notes</CardTitle>
                  <CardDescription>Coming soon...</CardDescription>
                </CardHeader>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
