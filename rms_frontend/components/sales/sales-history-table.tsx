"use client";

import { useState, useMemo } from "react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  Download,
  Eye,
  Calendar,
  DollarSign,
  User,
  Package,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  FileText,
  TrendingUp,
} from "lucide-react";
import { useSales } from "@/hooks/queries/use-sales";
import { Sale, SaleStatus, PaymentMethod } from "@/types/sales";

interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  phone?: string;
}

interface Sale {
  id: number;
  invoice_number: string;
  customer?: Customer;
  date: string;
  subtotal: string;
  tax: string;
  discount: string;
  total: string;
  payment_method: string;
  status: SaleStatus;
  items: Array<{
    id: number;
    product: {
      id: number;
      name: string;
      sku: string;
    };
    size: string;
    color: string;
    quantity: number;
    unit_price: string;
    total: string;
    profit: string;
  }>;
}

export default function SalesHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<SaleStatus | "all">("all");
  const [paymentFilter, setPaymentFilter] = useState<PaymentMethod | "all">(
    "all"
  );
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedOrder, setSelectedOrder] = useState<Sale | null>(null);

  const { sales, isLoading, error } = useSales({
    status: statusFilter !== "all" ? statusFilter : undefined,
    payment_method: paymentFilter !== "all" ? paymentFilter : undefined,
    search: searchTerm || undefined,
    ordering: sortOrder === "desc" ? `-${sortBy}` : sortBy,
  });

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateOrderProfit = (items: any[]) => {
    return items.reduce(
      (sum, item) => sum + Number.parseFloat(item.profit || "0"),
      0
    );
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="animate-pulse space-y-8">
          <div className="h-12 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="text-red-500">Error loading sales history</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Sales History
            </h1>
            <p className="text-lg text-gray-600">
              View and manage all sales transactions
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="bg-white border-gray-200 shadow-sm hover:bg-gray-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button
              variant="outline"
              className="bg-white border-gray-200 shadow-sm hover:bg-gray-50"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Date Range
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Filters */}
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
                    className="pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                  />
                </div>
              </div>
              <Select
                value={statusFilter}
                onValueChange={(value: SaleStatus | "all") =>
                  setStatusFilter(value)
                }
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
                  Showing {sales?.length || 0} transactions
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
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
                  {sales?.map((sale) => (
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
                            {sale.customer?.first_name || "Guest"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {sale.customer?.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDate(sale.date || "")}
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
                        ${Number.parseFloat(sale.total || "0").toFixed(2)}
                      </TableCell>
                      <TableCell className="font-semibold text-emerald-600">
                        ${calculateOrderProfit(sale.items || []).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {sale.status && getStatusBadge(sale.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedOrder(sale)}
                                className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="text-xl font-semibold">
                                  Order Details - {sale.invoice_number}
                                </DialogTitle>
                                <DialogDescription>
                                  Complete transaction information
                                </DialogDescription>
                              </DialogHeader>
                              {selectedOrder && (
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
                                          {selectedOrder.customer?.first_name ||
                                            "Guest Customer"}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                          {selectedOrder.customer?.phone}
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
                                          {formatDate(selectedOrder.date || "")}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="space-y-3">
                                      <div className="flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-purple-600" />
                                        <span className="font-semibold text-gray-900">
                                          Status
                                        </span>
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
                                      {selectedOrder.items?.map(
                                        (item: any, index: number) => (
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
                                                $
                                                {Number.parseFloat(
                                                  item.total || "0"
                                                ).toFixed(2)}
                                              </div>
                                              <div className="text-sm text-emerald-600 font-medium">
                                                Profit: $
                                                {Number.parseFloat(
                                                  item.profit || "0"
                                                ).toFixed(2)}
                                              </div>
                                            </div>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>

                                  {/* Financial Summary */}
                                  <div className="border-t pt-6">
                                    <div className="flex items-center gap-2 mb-4">
                                      <DollarSign className="w-5 h-5 text-green-600" />
                                      <span className="font-semibold text-gray-900">
                                        Financial Summary
                                      </span>
                                    </div>
                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                                      <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Subtotal:
                                          </span>
                                          <span className="font-medium">
                                            $
                                            {Number.parseFloat(
                                              selectedOrder.subtotal || "0"
                                            ).toFixed(2)}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Tax:
                                          </span>
                                          <span className="font-medium">
                                            $
                                            {Number.parseFloat(
                                              selectedOrder.tax || "0"
                                            ).toFixed(2)}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Discount:
                                          </span>
                                          <span className="font-medium">
                                            -$
                                            {Number.parseFloat(
                                              selectedOrder.discount || "0"
                                            ).toFixed(2)}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Payment:
                                          </span>
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
                                            $
                                            {Number.parseFloat(
                                              selectedOrder.total || "0"
                                            ).toFixed(2)}
                                          </span>
                                        </div>
                                        <div className="flex justify-between items-center mt-2">
                                          <span className="text-lg font-semibold text-emerald-700">
                                            Total Profit:
                                          </span>
                                          <span className="text-xl font-bold text-emerald-700">
                                            $
                                            {calculateOrderProfit(
                                              selectedOrder.items || []
                                            ).toFixed(2)}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-gray-100"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">
                    Total Revenue
                  </p>
                  <p className="text-3xl font-bold">
                    $
                    {sales
                      ?.reduce(
                        (sum, sale) =>
                          sum + Number.parseFloat(sale.total || "0"),
                        0
                      )
                      .toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">
                    Total Orders
                  </p>
                  <p className="text-3xl font-bold">{sales?.length || 0}</p>
                </div>
                <Package className="h-8 w-8 text-emerald-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">
                    Total Profit
                  </p>
                  <p className="text-3xl font-bold">
                    $
                    {sales
                      ?.reduce(
                        (sum, sale) =>
                          sum + calculateOrderProfit(sale.items || []),
                        0
                      )
                      .toFixed(2)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">
                    Avg Order Value
                  </p>
                  <p className="text-3xl font-bold">
                    $
                    {sales && sales.length > 0
                      ? (
                          sales.reduce(
                            (sum, sale) =>
                              sum + Number.parseFloat(sale.total || "0"),
                            0
                          ) / sales.length
                        ).toFixed(2)
                      : "0.00"}
                  </p>
                </div>
                <User className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
