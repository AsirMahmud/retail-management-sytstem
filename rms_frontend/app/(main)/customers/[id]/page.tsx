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
              <Avatar className="h-24 w-24">
                <AvatarImage src={`https://avatar.vercel.sh/${customer.id}`} />
                <AvatarFallback className="text-2xl">
                  {`${customer.first_name || ""} ${customer.last_name || ""}`
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-xl font-bold">
                  {customer.first_name} {customer.last_name}
                </h2>
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
                      {customer.purchase_history.map((purchase) => (
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
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
                              <span>
                                {new Date(purchase.date).toLocaleDateString()}
                              </span>
                              <span className="font-medium">
                                {new Intl.NumberFormat("en-US", {
                                  style: "currency",
                                  currency: "USD",
                                }).format(parseFloat(purchase.total_amount))}
                              </span>
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
                                {purchase.items.map((item, index) => (
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
