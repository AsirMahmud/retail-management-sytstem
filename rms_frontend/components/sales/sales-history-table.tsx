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

// Extended sample data
const salesHistory = [
  {
    id: 24,
    invoice_number: "INV-C53D6D8A",
    customer: {
      id: 6,
      first_name: "asdfs",
      phone: "0124464664",
    },
    date: "2025-05-31T13:17:33.970571Z",
    subtotal: "2000.00",
    tax: "165.00",
    discount: "0.00",
    total: "2165.00",
    payment_method: "cash",
    status: "completed",
    items: [
      {
        product: {
          name: "Mereclrene",
          sku: "SHI-250531-ef18",
          category_name: "Shirt",
        },
        size: "XS",
        color: "Black",
        quantity: 1,
        unit_price: "2000.00",
        total: "2000.00",
        profit: "1000.00",
      },
    ],
  },
  {
    id: 23,
    invoice_number: "INV-40FFAB25",
    customer: {
      id: 6,
      first_name: "asdfs",
      phone: "0124464664",
    },
    date: "2025-05-31T12:46:50.425063Z",
    subtotal: "49.99",
    tax: "4.12",
    discount: "0.00",
    total: "54.11",
    payment_method: "cash",
    status: "completed",
    items: [
      {
        product: {
          name: "Classic Oxford Shirt",
          sku: "MEN-SHIRT-OXF-001",
          category_name: "Pant",
        },
        size: "S",
        color: "White",
        quantity: 1,
        unit_price: "49.99",
        total: "49.99",
        profit: "20.00",
      },
    ],
  },
  {
    id: 17,
    invoice_number: "INV-1605A9C0",
    customer: {
      id: 6,
      first_name: "asdfs",
      phone: "0124464664",
    },
    date: "2025-05-31T12:37:43.598005Z",
    subtotal: "6199.96",
    tax: "511.50",
    discount: "0.00",
    total: "6711.46",
    payment_method: "cash",
    status: "completed",
    items: [
      {
        product: {
          name: "Classic Oxford Shirt",
          sku: "MEN-SHIRT-OXF-001",
          category_name: "Pant",
        },
        size: "S",
        color: "White",
        quantity: 2,
        unit_price: "49.99",
        total: "99.98",
        profit: "40.00",
      },
      {
        product: {
          name: "Denim Jacket",
          sku: "SHI-250531-6606",
          category_name: "Shirt",
        },
        size: "M",
        color: "Black",
        quantity: 3,
        unit_price: "2000.00",
        total: "6000.00",
        profit: "3000.00",
      },
    ],
  },
  {
    id: 16,
    invoice_number: "INV-A0387568",
    customer: {
      id: 5,
      first_name: "Customer",
      phone: "+8801816295333",
    },
    date: "2025-05-31T10:50:06.685646Z",
    subtotal: "49.99",
    tax: "4.12",
    discount: "0.00",
    total: "54.11",
    payment_method: "cash",
    status: "completed",
    items: [
      {
        product: {
          name: "Classic Oxford Shirt",
          sku: "MEN-SHIRT-OXF-001",
          category_name: "Pant",
        },
        size: "S",
        color: "White",
        quantity: 1,
        unit_price: "49.99",
        total: "49.99",
        profit: "20.00",
      },
    ],
  },
  {
    id: 13,
    invoice_number: "INV-BC101318",
    customer: {
      id: 5,
      first_name: "Customer",
      phone: "+8801816295333",
    },
    date: "2025-05-31T10:37:46.250238Z",
    subtotal: "49.99",
    tax: "4.12",
    discount: "0.00",
    total: "54.11",
    payment_method: "cash",
    status: "pending",
    items: [
      {
        product: {
          name: "Classic Oxford Shirt",
          sku: "MEN-SHIRT-OXF-001",
          category_name: "Pant",
        },
        size: "S",
        color: "White",
        quantity: 1,
        unit_price: "49.99",
        total: "49.99",
        profit: "0.00",
      },
    ],
  },
];

export default function SalesHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  const filteredSales = useMemo(() => {
    const filtered = salesHistory.filter((sale) => {
      const matchesSearch =
        sale.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.customer?.first_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        sale.customer?.phone?.includes(searchTerm);

      const matchesStatus =
        statusFilter === "all" || sale.status === statusFilter;
      const matchesPayment =
        paymentFilter === "all" || sale.payment_method === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "date":
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
        case "total":
          aValue = Number.parseFloat(a.total);
          bValue = Number.parseFloat(b.total);
          break;
        case "customer":
          aValue = a.customer?.first_name || "";
          bValue = b.customer?.first_name || "";
          break;
        default:
          aValue = a.invoice_number;
          bValue = b.invoice_number;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [searchTerm, statusFilter, paymentFilter, sortBy, sortOrder]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200">
            Completed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200">
            Pending
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48 h-12 bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-48 h-12 bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Payment Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
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
                  Showing {filteredSales.length} of {salesHistory.length}{" "}
                  transactions
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
                        onClick={() => handleSort("invoice")}
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
                  {filteredSales.map((sale) => (
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
                        {formatDate(sale.date)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200"
                        >
                          {sale.items.length} item
                          {sale.items.length !== 1 ? "s" : ""}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="capitalize text-gray-700 bg-gray-100 px-2 py-1 rounded-md text-sm">
                          {sale.payment_method}
                        </span>
                      </TableCell>
                      <TableCell className="font-semibold text-gray-900">
                        ${Number.parseFloat(sale.total).toFixed(2)}
                      </TableCell>
                      <TableCell className="font-semibold text-emerald-600">
                        ${calculateOrderProfit(sale.items).toFixed(2)}
                      </TableCell>
                      <TableCell>{getStatusBadge(sale.status)}</TableCell>
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
                                          {formatDate(selectedOrder.date)}
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
                                        {getStatusBadge(selectedOrder.status)}
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
                                      {selectedOrder.items.map(
                                        (item: any, index: number) => (
                                          <div
                                            key={index}
                                            className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200"
                                          >
                                            <div className="space-y-1">
                                              <div className="font-semibold text-gray-900">
                                                {item.product.name}
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
                                                {item.product.sku}
                                              </div>
                                            </div>
                                            <div className="text-right space-y-1">
                                              <div className="font-semibold text-gray-900">
                                                $
                                                {Number.parseFloat(
                                                  item.total
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
                                              selectedOrder.subtotal
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
                                              selectedOrder.tax
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
                                              selectedOrder.discount
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
                                              selectedOrder.total
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
                                              selectedOrder.items
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
                    {filteredSales
                      .reduce(
                        (sum, sale) => sum + Number.parseFloat(sale.total),
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
                  <p className="text-3xl font-bold">{filteredSales.length}</p>
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
                    {filteredSales
                      .reduce(
                        (sum, sale) => sum + calculateOrderProfit(sale.items),
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
                    {filteredSales.length > 0
                      ? (
                          filteredSales.reduce(
                            (sum, sale) => sum + Number.parseFloat(sale.total),
                            0
                          ) / filteredSales.length
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
