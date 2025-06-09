"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { DollarSign } from "lucide-react";
import {
  useExpenses,
  useDeleteExpense,
  useApproveExpense,
  useRejectExpense,
} from "@/hooks/queries/use-expenses";
import { useCategories } from "@/hooks/queries/use-expenses";
import { Expense, ExpenseCategory } from "@/lib/api/expenses";
import { formatCurrency } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

export function ExpenseList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [approvalFilter, setApprovalFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");

  const { data: expenses, isLoading: isLoadingExpenses } = useExpenses();
  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  const deleteExpense = useDeleteExpense();
  const approveExpense = useApproveExpense();
  const rejectExpense = useRejectExpense();

  if (isLoadingExpenses || isLoadingCategories) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading expenses...</p>
        </div>
      </div>
    );
  }

  const filteredExpenses =
    expenses?.filter((expense) => {
      const matchesSearch = expense.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || expense.category_name === categoryFilter;
      const matchesApproval =
        approvalFilter === "all" ||
        expense.status === approvalFilter.toUpperCase();

      return matchesSearch && matchesCategory && matchesApproval;
    }) || [];

  const pendingExpenses =
    expenses?.filter((expense) => expense.status === "PENDING") || [];
  const approvedExpenses =
    expenses?.filter((expense) => expense.status === "APPROVED") || [];
  const rejectedExpenses =
    expenses?.filter((expense) => expense.status === "REJECTED") || [];

  const handleDelete = (expenseId: number) => {
    deleteExpense.mutate(expenseId, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Expense deleted successfully",
        });
      },
    });
  };

  const handleApprove = (expenseId: number) => {
    approveExpense.mutate(expenseId, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Expense approved successfully",
        });
      },
    });
  };

  const handleReject = (expenseId: number) => {
    rejectExpense.mutate(expenseId, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Expense rejected successfully",
        });
      },
    });
  };

  const totalAmount = filteredExpenses.reduce(
    (sum, expense) => sum + (Number(expense.amount) || 0),
    0
  );

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Search className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Expense Management</CardTitle>
                <CardDescription className="text-blue-100">
                  View, filter, and manage all expenses
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Approval Status Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-yellow-50 to-amber-100 border-0 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-yellow-800">
                  Pending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-900">
                  {pendingExpenses.length}
                </div>
                <p className="text-sm text-yellow-700">Awaiting approval</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-0 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-green-800">
                  Approved
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-900">
                  {approvedExpenses.length}
                </div>
                <p className="text-sm text-green-700">Approved expenses</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-red-50 to-rose-100 border-0 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-red-800">
                  Rejected
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-900">
                  {rejectedExpenses.length}
                </div>
                <p className="text-sm text-red-700">Rejected expenses</p>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Filters */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-colors"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-56 h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-0 shadow-2xl">
                <SelectItem value="all" className="rounded-lg">
                  All Categories
                </SelectItem>
                {categories?.map((category: ExpenseCategory) => (
                  <SelectItem
                    key={category.id}
                    value={category.name}
                    className="rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={approvalFilter}
              onValueChange={(value) =>
                setApprovalFilter(
                  value as "all" | "pending" | "approved" | "rejected"
                )
              }
            >
              <SelectTrigger className="w-full md:w-56 h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-0 shadow-2xl">
                <SelectItem value="all" className="rounded-lg">
                  All Status
                </SelectItem>
                <SelectItem value="pending" className="rounded-lg">
                  Pending
                </SelectItem>
                <SelectItem value="approved" className="rounded-lg">
                  Approved
                </SelectItem>
                <SelectItem value="rejected" className="rounded-lg">
                  Rejected
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Enhanced Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-white">
                  {filteredExpenses.length}
                </span>
              </div>
              <p className="text-sm text-gray-600 font-medium">
                Total Expenses
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(totalAmount)}
              </p>
              <p className="text-sm text-gray-600 font-medium">Total Amount</p>
            </div>
          </div>

          {/* Enhanced Expense Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 border-0">
                  <TableHead className="font-semibold text-gray-700 py-4">
                    Description
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Category
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Date
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Amount
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
                {filteredExpenses.map((expense) => (
                  <TableRow
                    key={expense.id}
                    className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-colors"
                  >
                    <TableCell className="font-medium py-4">
                      {expense.description}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: expense.category_color }}
                        />
                        <span>{expense.category_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{expense.date}</TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(expense.amount)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          expense.status === "APPROVED"
                            ? "bg-green-100 text-green-800"
                            : expense.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {expense.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedExpense(expense)}
                          className="hover:bg-blue-50"
                        >
                          <Eye className="h-4 w-4 text-blue-600" />
                        </Button>
                        {expense.status === "PENDING" && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleApprove(expense.id)}
                              className="hover:bg-green-50"
                            >
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleReject(expense.id)}
                              className="hover:bg-red-50"
                            >
                              <XCircle className="h-4 w-4 text-red-600" />
                            </Button>
                          </>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(expense.id)}
                          className="hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
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

      {/* Expense Details Dialog */}
      <Dialog
        open={!!selectedExpense}
        onOpenChange={() => setSelectedExpense(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Expense Details</DialogTitle>
            <DialogDescription>
              View detailed information about this expense
            </DialogDescription>
          </DialogHeader>
          {selectedExpense && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Description
                </h4>
                <p className="mt-1">{selectedExpense.description}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Amount</h4>
                <p className="mt-1">{formatCurrency(selectedExpense.amount)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Category</h4>
                <div className="mt-1 flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: selectedExpense.category_color }}
                  />
                  <span>{selectedExpense.category_name}</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Date</h4>
                <p className="mt-1">{selectedExpense.date}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Payment Method
                </h4>
                <p className="mt-1">{selectedExpense.payment_method}</p>
              </div>
              {selectedExpense.reference_number && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Reference Number
                  </h4>
                  <p className="mt-1">{selectedExpense.reference_number}</p>
                </div>
              )}
              {selectedExpense.notes && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Notes</h4>
                  <p className="mt-1">{selectedExpense.notes}</p>
                </div>
              )}
              {selectedExpense.status === "PENDING" && (
                <div className="flex space-x-2 pt-4">
                  <Button
                    onClick={() => handleApprove(selectedExpense.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleReject(selectedExpense.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
