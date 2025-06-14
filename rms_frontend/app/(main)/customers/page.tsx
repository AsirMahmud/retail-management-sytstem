"use client";
import { useState } from "react";
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
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  useCustomers,
  useActiveCustomers,
  useSearchCustomers,
  useDeleteCustomer,
} from "@/hooks/queries/use-customer";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";

type Customer = {
  id: number;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  total_sales: number;
  sales_count: number;
  last_sale_date: string | null;
  is_active: boolean;
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
      const name = `${row.original.first_name} ${row.original.last_name}`;
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
    accessorKey: "total_sales",
    header: "Total Sales",
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("total_sales"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return formatted;
    },
  },
  {
    accessorKey: "sales_count",
    header: "Sales Count",
  },
  {
    accessorKey: "last_sale_date",
    header: "Last Sale",
    cell: ({ row }) => {
      const date = row.getValue("last_sale_date");
      return date ? new Date(date as string).toLocaleDateString() : "No sales";
    },
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("is_active") as boolean;
      return (
        <div
          className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${
            status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {status ? "Active" : "Inactive"}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const customer = row.original;
      const deleteCustomer = useDeleteCustomer();
      const { toast } = useToast();

      const handleDeleteCustomer = async (customerId: number) => {
        try {
          await deleteCustomer.mutateAsync(customerId);
          toast({
            title: "Success",
            description: "Customer deleted successfully",
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to delete customer",
            variant: "destructive",
          });
        }
      };

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
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  customer and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDeleteCustomer(customer.id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: customers, isLoading: isLoadingCustomers } = useCustomers();
  const { data: activeCustomers, isLoading: isLoadingActive } =
    useActiveCustomers();
  const { data: searchResults, isLoading: isLoadingSearch } =
    useSearchCustomers(searchQuery);
  const deleteCustomer = useDeleteCustomer();
  const { toast } = useToast();

  const handleDeleteCustomer = async (customerId: number) => {
    try {
      await deleteCustomer.mutateAsync(customerId);
      toast({
        title: "Success",
        description: "Customer deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete customer",
        variant: "destructive",
      });
    }
  };

  const displayCustomers = searchQuery ? searchResults || [] : customers || [];

  const stats = {
    total: displayCustomers.length,
    active: activeCustomers?.length || 0,
    averageSpend:
      displayCustomers.reduce((acc, curr) => acc + (curr.total_sales || 0), 0) /
        (displayCustomers.length || 1) || 0,
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customer Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage your customer relationships and track their activity
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingCustomers ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="flex items-center gap-2 mt-1">
                  <Progress value={15} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    +15% from last month
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Active Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingActive ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.active}</div>
                <div className="flex items-center gap-2 mt-1">
                  <Progress
                    value={(stats.active / stats.total) * 100}
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    {Math.round((stats.active / stats.total) * 100)}% of total
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Spend</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingCustomers ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(stats.averageSpend)}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Progress value={5} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    +5% from last month
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Customers</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
              {isLoadingCustomers || isLoadingSearch ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <DataTable columns={columns} data={displayCustomers || []} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
