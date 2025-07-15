"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Download,
  Eye,
  Calendar,
  User,
  Package,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  FileText,
  TrendingUp,
  Trash2,
  Loader2,
  X,
} from "lucide-react";
import { useSales } from "@/hooks/queries/use-sales";
import type { SaleStatus, PaymentMethod } from "@/types/sales";
import type { Sale, SaleItem } from "@/types/sales";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { saveAs } from "file-saver";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import jsPDF from "jspdf";
import "jspdf-autotable";

// The backend returns customer details in a nested object
interface SaleWithCustomerDetails extends Omit<Sale, "customer"> {
  customer?: {
    id: number;
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
  } | null;
}

// Helper function to safely convert to number
const toNumber = (value: number | string | null | undefined): number => {
  if (value === null || value === undefined) return 0;
  if (typeof value === "string") return Number.parseFloat(value) || 0;
  return value;
};

// Debounce hook for search
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function SalesHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<SaleStatus | "all">("all");
  const [paymentFilter, setPaymentFilter] = useState<PaymentMethod | "all">(
    "all"
  );
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedOrder, setSelectedOrder] =
    useState<SaleWithCustomerDetails | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [saleToDelete, setSaleToDelete] =
    useState<SaleWithCustomerDetails | null>(null);
  const [salesToDelete, setSalesToDelete] = useState<number[]>([]);
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [isSearching, setIsSearching] = useState(false);

  // Debounce search term to avoid too many API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { toast } = useToast();

  const {
    sales,
    pagination,
    isLoading,
    error,
    deleteSale,
    deleteAllSales,
    isDeleting,
    isDeletingAll,
  } = useSales({
    status: statusFilter !== "all" ? statusFilter : undefined,
    payment_method: paymentFilter !== "all" ? paymentFilter : undefined,
    search: debouncedSearchTerm || undefined,
    ordering: sortOrder === "desc" ? `-${sortBy}` : sortBy,
    page,
    page_size: pageSize,
    start_date: dateRange.from
      ? format(dateRange.from, "yyyy-MM-dd")
      : undefined,
    end_date: dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : undefined,
  });

  // Show searching indicator when user is typing
  useEffect(() => {
    if (searchTerm !== debouncedSearchTerm) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, [searchTerm, debouncedSearchTerm]);

  // Cast the sales array to the correct type since we know the backend returns customer details
  const typedSales = sales as unknown as SaleWithCustomerDetails[];

  const getStatusBadge = (status: SaleStatus) => {
    const statusConfig = {
      completed: {
        color:
          "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200",
        label: "Completed",
      },
      pending: {
        color:
          "bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200",
        label: "Pending",
      },
      cancelled: {
        color: "bg-red-100 text-red-800 hover:bg-red-100 border-red-200",
        label: "Cancelled",
      },
      refunded: {
        color: "bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200",
        label: "Refunded",
      },
    };
    const config = statusConfig[status];
    return <Badge className={`${config.color}`}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateOrderProfit = (items: SaleItem[]) => {
    return items.reduce((sum, item) => sum + (item.total || 0), 0);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const handleViewSale = (sale: SaleWithCustomerDetails) => {
    setSelectedOrder(sale);
  };

  const handleDeleteSaleClick = (sale: SaleWithCustomerDetails) => {
    setSaleToDelete(sale);
  };

  const handleDeleteSale = async () => {
    if (!saleToDelete?.id) {
      return;
    }
    try {
      await deleteSale(saleToDelete.id);
      toast({
        title: "Success",
        description: "Sale deleted successfully",
      });
      setSaleToDelete(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete sale. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAllClick = () => {
    setShowDeleteAllDialog(true);
  };

  const handleBulkDelete = async () => {
    try {
      await deleteAllSales();
      setShowDeleteAllDialog(false);
    } catch (error) {
      console.error("Error in delete all:", error);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const totalPages = Math.ceil((pagination?.count || 0) / pageSize);

  // CSV Export utility
  function salesToCSV(sales: SaleWithCustomerDetails[]) {
    const header = [
      "Invoice Number",
      "Customer Name",
      "Customer Phone",
      "Date",
      "Status",
      "Payment Method",
      "Total",
      "Profit",
      "Items",
    ];
    const rows = sales.map((sale) => [
      sale.invoice_number,
      sale.customer
        ? `${sale.customer.first_name} ${sale.customer.last_name}`
        : "Guest",
      sale.customer_phone || sale.customer?.phone || "",
      formatDate(sale.date),
      sale.status,
      sale.payment_method,
      sale.total,
      sale.total_profit,
      sale.items?.length || 0,
    ]);
    return [header, ...rows].map((row) => row.join(",")).join("\n");
  }

  function handleExport() {
    const csv = salesToCSV(typedSales);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `sales_export_${Date.now()}.csv`);
  }

  function handleReport() {
    const doc = new jsPDF();
    doc.text("Sales Report", 14, 16);
    const tableColumn = [
      "Invoice Number",
      "Customer Name",
      "Customer Phone",
      "Date",
      "Status",
      "Payment Method",
      "Total",
      "Profit",
      "Items",
    ];
    const tableRows = typedSales.map((sale) => [
      sale.invoice_number,
      sale.customer
        ? `${sale.customer.first_name} ${sale.customer.last_name}`
        : "Guest",
      sale.customer_phone || sale.customer?.phone || "",
      formatDate(sale.date),
      sale.status,
      sale.payment_method,
      sale.total,
      sale.total_profit,
      sale.items?.length || 0,
    ]);
    // @ts-ignore: jsPDF autotable is attached at runtime
    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 24 });
    doc.save(`sales_report_${Date.now()}.pdf`);
  }

  // Loading skeleton for table rows
  const TableSkeleton = () => (
    <>
      {[...Array(pageSize)].map((_, i) => (
        <TableRow key={i} className="border-gray-100">
          <TableCell>
            <Skeleton className="h-4 w-20" />
          </TableCell>
          <TableCell>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-16" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-20" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-16" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-16" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-20" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-8 w-8" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="text-red-500 text-lg font-medium">
              Error loading sales history
            </div>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="p-6 space-y-8">
        {/* Header - Always visible */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Sales History
            </h1>
            <p className="text-lg text-gray-600">
              View and manage all sales transactions
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              className="bg-white border-gray-200 shadow-sm hover:bg-gray-50"
              onClick={handleExport}
              disabled={isLoading}
            >
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <DatePickerWithRange value={dateRange} onChange={setDateRange} />
            <Button
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
              onClick={handleReport}
              disabled={isLoading}
            >
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 shadow-lg flex items-center"
              onClick={handleDeleteAllClick}
              disabled={isLoading || isDeletingAll}
            >
              {isDeletingAll ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Delete All
            </Button>
          </div>
        </div>

        {/* Filters - Always visible */}
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search by invoice, customer name, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-10 h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                  />
                  {/* Search indicators */}
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                    {isSearching && (
                      <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                    )}
                    {searchTerm && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearSearch}
                        className="h-6 w-6 p-0 hover:bg-gray-200"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
                {/* Search results indicator */}
                {debouncedSearchTerm && (
                  <div className="mt-2 text-sm text-gray-600">
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Searching...
                      </span>
                    ) : (
                      <span>
                        Found {pagination?.count || 0} results for "
                        {debouncedSearchTerm}"
                      </span>
                    )}
                  </div>
                )}
              </div>
              <Select
                value={statusFilter}
                onValueChange={(value: SaleStatus | "all") =>
                  setStatusFilter(value)
                }
                disabled={isLoading}
              >
                <SelectTrigger className="w-48 h-12 bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={paymentFilter}
                onValueChange={(value: PaymentMethod | "all") =>
                  setPaymentFilter(value)
                }
                disabled={isLoading}
              >
                <SelectTrigger className="w-48 h-12 bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Payment Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="mobile_money">Mobile Money</SelectItem>
                  <SelectItem value="credit">Credit</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="h-12 px-6 bg-gray-50 border-gray-200 hover:bg-gray-100"
                disabled={isLoading}
              >
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sales Table */}
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Transaction History
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Loading transactions...
                    </span>
                  ) : (
                    `Showing ${sales.length} of ${
                      pagination?.count || 0
                    } transactions`
                  )}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <Select
                  value={sortBy}
                  onValueChange={setSortBy}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="total">Amount</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200">
                    <TableHead className="font-semibold text-gray-700">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("invoice_number")}
                        className="h-auto p-0 font-semibold text-gray-700 hover:text-gray-900"
                        disabled={isLoading}
                      >
                        Invoice
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("customer")}
                        className="h-auto p-0 font-semibold text-gray-700 hover:text-gray-900"
                        disabled={isLoading}
                      >
                        Customer
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("date")}
                        className="h-auto p-0 font-semibold text-gray-700 hover:text-gray-900"
                        disabled={isLoading}
                      >
                        Date
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Items
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Payment
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("total")}
                        className="h-auto p-0 font-semibold text-gray-700 hover:text-gray-900"
                        disabled={isLoading}
                      >
                        Total
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Profit
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Status
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableSkeleton />
                  ) : typedSales.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-12">
                        <div className="space-y-3">
                          <div className="text-gray-500 text-lg">
                            No sales found
                          </div>
                          {debouncedSearchTerm && (
                            <div className="text-sm text-gray-400">
                              Try adjusting your search terms or filters
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    typedSales.map((sale) => (
                      <TableRow
                        key={sale.id}
                        className="hover:bg-gray-50 transition-colors border-gray-100"
                      >
                        <TableCell className="font-medium text-blue-600">
                          {sale.invoice_number}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium text-gray-900">
                              {sale.customer
                                ? `${sale.customer.first_name} ${sale.customer.last_name}`
                                : "Guest"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {sale.customer_phone || sale.customer?.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {formatDate(sale.date)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700 border-blue-200"
                          >
                            {sale.items?.length || 0} item
                            {sale.items?.length !== 1 ? "s" : ""}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="capitalize text-gray-700 bg-gray-100 px-2 py-1 rounded-md text-sm">
                            {sale.payment_method}
                          </span>
                        </TableCell>
                        <TableCell className="font-semibold text-gray-900">
                          ${Number(sale.total).toFixed(2)}
                        </TableCell>
                        <TableCell className="font-semibold text-emerald-600">
                          ${Number(sale.total_profit || 0).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {sale.status && getStatusBadge(sale.status)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleViewSale(sale)}
                                className="cursor-pointer"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteSaleClick(sale)}
                                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Sale
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Rows per page:</span>
                <Select
                  value={pageSize.toString()}
                  onValueChange={(value) => {
                    setPageSize(Number(value));
                    setPage(1);
                  }}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className={
                        page === 1 || isLoading
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => {
                      return (
                        p === 1 || p === totalPages || Math.abs(p - page) <= 1
                      );
                    })
                    .map((p, i, arr) => {
                      if (i > 0 && p - arr[i - 1] > 1) {
                        return (
                          <React.Fragment key={`ellipsis-${p}`}>
                            <PaginationItem>
                              <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink
                                onClick={() => setPage(p)}
                                isActive={page === p}
                              >
                                {p}
                              </PaginationLink>
                            </PaginationItem>
                          </React.Fragment>
                        );
                      }
                      return (
                        <PaginationItem key={p}>
                          <PaginationLink
                            onClick={() => setPage(p)}
                            isActive={page === p}
                          >
                            {p}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      className={
                        page === totalPages || isLoading
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!saleToDelete}
        onOpenChange={(open) => {
          if (!open) setSaleToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Sale</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the sale{" "}
              {saleToDelete?.invoice_number}. This action cannot be undone. Are
              you sure you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSale}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Sale"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete All Dialog */}
      <AlertDialog
        open={showDeleteAllDialog}
        onOpenChange={setShowDeleteAllDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete All Sales</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete ALL sales data from the system, including
              completed, pending, and cancelled sales. This action cannot be
              undone. Are you absolutely sure you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeletingAll}
            >
              {isDeletingAll ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete All Sales"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Order Details Dialog */}
      {selectedOrder && (
        <Dialog
          open={!!selectedOrder}
          onOpenChange={(open) => {
            if (!open) setSelectedOrder(null);
          }}
        >
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                Order Details - {selectedOrder.invoice_number}
              </DialogTitle>
              <DialogDescription>
                Complete transaction information
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-gray-900">
                      Customer
                    </span>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="font-medium text-gray-900">
                      {selectedOrder.customer
                        ? `${selectedOrder.customer.first_name} ${selectedOrder.customer.last_name}`
                        : "Guest Customer"}
                    </div>
                    <div className="text-sm text-gray-600">
                      {selectedOrder.customer_phone ||
                        selectedOrder.customer?.phone}
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-gray-900">
                      Date & Time
                    </span>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">
                      {formatDate(selectedOrder.date)}
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold text-gray-900">Status</span>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    {selectedOrder.status &&
                      getStatusBadge(selectedOrder.status)}
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Package className="w-5 h-5 text-orange-600" />
                  <span className="font-semibold text-gray-900">
                    Items Purchased
                  </span>
                </div>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200"
                    >
                      <div className="space-y-1">
                        <div className="font-semibold text-gray-900">
                          {item.product?.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="bg-gray-200 px-2 py-1 rounded mr-2">
                            {item.size}
                          </span>
                          <span className="bg-gray-200 px-2 py-1 rounded mr-2">
                            {item.color}
                          </span>
                          <span className="font-medium">
                            Qty: {item.quantity}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 font-mono">
                          {item.product?.sku}
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="font-semibold text-gray-900">
                          ${toNumber(item.total).toFixed(2)}
                        </div>
                        <div className="text-sm text-emerald-600 font-medium">
                          Profit: ${toNumber(item.profit).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Summary */}
              <div className="border-t pt-6">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">
                        ${toNumber(selectedOrder.subtotal).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax:</span>
                      <span className="font-medium">
                        ${toNumber(selectedOrder.tax).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discount:</span>
                      <span className="font-medium">
                        -${toNumber(selectedOrder.discount).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment:</span>
                      <span className="font-medium capitalize">
                        {selectedOrder.payment_method}
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-green-300 mt-4 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">
                        Total:
                      </span>
                      <span className="text-2xl font-bold text-gray-900">
                        ${toNumber(selectedOrder.total).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-lg font-semibold text-emerald-700">
                        Total Profit:
                      </span>
                      <span className="text-2xl font-bold text-emerald-700">
                        ${toNumber(selectedOrder.total_profit).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
