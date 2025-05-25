"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/ui/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Download,
  Search,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalSpent: number;
  orderCount: number;
  lastPurchase: string;
  loyaltyPoints: number;
  status: "active" | "inactive";
};

const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-medium"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={`https://avatar.vercel.sh/${row.original.id}`}
              alt={name}
            />
            <AvatarFallback>
              {name
                .split(" ")
                .map((n: string) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <Link
            href={`/customers/${row.original.id}`}
            className="font-medium hover:underline"
          >
            {name}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "totalSpent",
    header: "Total Spent",
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("totalSpent"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return formatted;
    },
  },
  {
    accessorKey: "orderCount",
    header: "Orders",
  },
  {
    accessorKey: "lastPurchase",
    header: "Last Purchase",
  },
  {
    accessorKey: "loyaltyPoints",
    header: "Loyalty Points",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div
          className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${
            status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {status === "active" ? "Active" : "Inactive"}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const customer = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/customers/${customer.id}`}>View</Link>
          </Button>
          <Button variant="ghost" size="sm">
            <Mail className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Phone className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];

const customers: Customer[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "(555) 123-4567",
    totalSpent: 1245.67,
    orderCount: 8,
    lastPurchase: "May 12, 2023",
    loyaltyPoints: 450,
    status: "active",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "(555) 987-6543",
    totalSpent: 3567.89,
    orderCount: 15,
    lastPurchase: "Jun 23, 2023",
    loyaltyPoints: 1200,
    status: "active",
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael.b@example.com",
    phone: "(555) 456-7890",
    totalSpent: 789.45,
    orderCount: 4,
    lastPurchase: "Apr 5, 2023",
    loyaltyPoints: 200,
    status: "inactive",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.d@example.com",
    phone: "(555) 234-5678",
    totalSpent: 2456.78,
    orderCount: 12,
    lastPurchase: "Jun 30, 2023",
    loyaltyPoints: 850,
    status: "active",
  },
  {
    id: "5",
    name: "David Wilson",
    email: "david.w@example.com",
    phone: "(555) 876-5432",
    totalSpent: 567.89,
    orderCount: 3,
    lastPurchase: "Mar 15, 2023",
    loyaltyPoints: 150,
    status: "active",
  },
];

export default function CustomersPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customer Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage your customer relationships and track their activity
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" /> Add Customer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <div className="flex items-center gap-2 mt-1">
              <Progress value={15} className="h-2" />
              <p className="text-xs text-muted-foreground">
                +15% from last month
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Active Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">876</div>
            <div className="flex items-center gap-2 mt-1">
              <Progress value={70} className="h-2" />
              <p className="text-xs text-muted-foreground">70% of total</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Spend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$245.67</div>
            <div className="flex items-center gap-2 mt-1">
              <Progress value={5} className="h-2" />
              <p className="text-xs text-muted-foreground">
                +5% from last month
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Loyalty Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">543</div>
            <div className="flex items-center gap-2 mt-1">
              <Progress value={43} className="h-2" />
              <p className="text-xs text-muted-foreground">43% of total</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Customers</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
          <TabsTrigger value="loyalty">Loyalty Members</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Customer List</CardTitle>
              <CardDescription>
                Manage your customers and view their purchase history.
              </CardDescription>
              <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search customers..."
                    className="pl-8"
                  />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Customers</SelectItem>
                      <SelectItem value="recent">Recent Customers</SelectItem>
                      <SelectItem value="high-value">High Value</SelectItem>
                      <SelectItem value="low-value">Low Value</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={customers} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segments">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Segments</CardTitle>
                <CardDescription>
                  View and manage customer segments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">High Value Customers</p>
                      <p className="text-sm text-muted-foreground">
                        Spent over $1000
                      </p>
                    </div>
                    <Badge>245 customers</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Loyal Customers</p>
                      <p className="text-sm text-muted-foreground">
                        5+ purchases
                      </p>
                    </div>
                    <Badge>432 customers</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">At Risk</p>
                      <p className="text-sm text-muted-foreground">
                        No purchase in 3 months
                      </p>
                    </div>
                    <Badge>89 customers</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest customer interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customers.slice(0, 3).map((customer) => (
                    <div key={customer.id} className="flex items-center gap-4">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={`https://avatar.vercel.sh/${customer.id}`}
                          alt={customer.name}
                        />
                        <AvatarFallback>
                          {customer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Last purchase: {customer.lastPurchase}
                        </p>
                      </div>
                      <Badge variant="outline">${customer.totalSpent}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
