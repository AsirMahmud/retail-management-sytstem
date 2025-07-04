"use client";

import { useState } from "react";
import {
  usePreorders,
  useUpdatePreorderStatus,
  useDeletePreorder,
  useCompletePreorder,
  useCancelPreorder,
  useUpdatePreorder,
} from "@/hooks/queries/use-preorder";
import { useSales } from "@/hooks/queries/use-sales";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  Trash2,
  MoreHorizontal,
  Edit,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
import { Preorder } from "@/types/preorder";
import axios from "@/lib/api/axios-config";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "ARRIVED", label: "Arrived" },
  { value: "FULLY_PAID", label: "Fully Paid" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "COMPLETED", label: "Completed" },
];

export function PreorderList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [productFilter, setProductFilter] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [preorderToDelete, setPreorderToDelete] = useState<any>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [preorderToView, setPreorderToView] = useState<Preorder | null>(null);
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [preorderToAddDeposit, setPreorderToAddDeposit] =
    useState<Preorder | null>(null);
  const [additionalDeposit, setAdditionalDeposit] = useState("");
  const { data: preorders, isLoading } = usePreorders(
    statusFilter === "all" ? undefined : statusFilter
  );
  const updateStatus = useUpdatePreorderStatus();
  const deletePreorder = useDeletePreorder();
  const completePreorder = useCompletePreorder();
  const cancelPreorder = useCancelPreorder();
  const { createSale } = useSales();
  const updatePreorder = useUpdatePreorder();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleCompletePreorder = async (preorderId: number) => {
    try {
      // Find the preorder data
      const preorder = preorders?.data?.find(
        (p: Preorder) => p.id === preorderId
      );
      if (!preorder) {
        console.error("Preorder not found");
        toast({
          title: "Error",
          description: "Preorder not found",
          variant: "destructive",
        });
        return;
      }

      // Update preorder status to COMPLETED
      await updateStatus.mutateAsync({ id: preorderId, status: "COMPLETED" });

      // Create sale from preorder items array
      await createSale({
        customer_phone: preorder.customer_phone,
        customer_name: preorder.customer_name,
        subtotal: preorder.total_amount,
        tax: 0,
        discount: 0,
        total: preorder.total_amount,
        payment_method: "cash",
        items: preorder.items,
        notes: `Completed preorder #${preorder.id} - ${preorder.notes || ""}`,
      } as any);

      toast({
        title: "Success",
        description: "Preorder completed and converted to sale successfully!",
      });
    } catch (error) {
      console.error("Error completing preorder:", error);
      toast({
        title: "Error",
        description: "Failed to complete preorder",
        variant: "destructive",
      });
    }
  };

  const handleDeletePreorder = async () => {
    if (preorderToDelete) {
      try {
        await deletePreorder.mutateAsync(preorderToDelete.id);
        setDeleteDialogOpen(false);
        setPreorderToDelete(null);
      } catch (error) {
        console.error("Error deleting preorder:", error);
      }
    }
  };

  const openDeleteDialog = (preorder: any) => {
    setPreorderToDelete(preorder);
    setDeleteDialogOpen(true);
  };

  const openViewDialog = (preorder: Preorder) => {
    setPreorderToView(preorder);
    setViewDialogOpen(true);
  };

  const handleMarkAsDelivered = async (preorder: Preorder) => {
    try {
      await updateStatus.mutateAsync({ id: preorder.id, status: "DELIVERED" });
      // Create sale after marking as delivered
      await createSale({
        customer_phone: preorder.customer_phone,
        customer_name: preorder.customer_name,
        subtotal: preorder.total_amount,
        tax: 0,
        discount: 0,
        total: preorder.total_amount,
        payment_method: "cash",
        items: preorder.items,
        notes: preorder.notes,
      } as any);
    } catch (error) {
      console.error("Error marking as delivered and creating sale:", error);
    }
  };

  const handleStatusChange = async (preorderId: number, newStatus: string) => {
    try {
      await updateStatus.mutateAsync({ id: preorderId, status: newStatus });
      if (newStatus === "COMPLETED") {
        // Find the preorder data
        const preorder = preorders?.data?.find(
          (p: Preorder) => p.id === preorderId
        );
        if (!preorder) {
          console.error("Preorder not found");
          toast({
            title: "Error",
            description: "Preorder not found",
            variant: "destructive",
          });
          return;
        }
        // Create sale from preorder items array
        const salePayload = {
          customer_phone: preorder.customer_phone,
          customer_name: preorder.customer_name,
          subtotal: preorder.total_amount,
          tax: 0,
          discount: 0,
          total: preorder.total_amount,
          payment_method: "cash",
          items: preorder.items,
          notes: `Completed preorder #${preorder.id} - ${preorder.notes || ""}`,
        };
        console.log("Creating sale with payload:", salePayload);
        await createSale(salePayload as any);
        toast({
          title: "Success",
          description: "Preorder completed and converted to sale successfully!",
        });
      }
    } catch (error) {
      console.error("Error updating preorder status or creating sale:", error);
      toast({
        title: "Error",
        description: "Failed to update status or create sale",
        variant: "destructive",
      });
    }
  };

  const handleAddDeposit = async () => {
    if (!preorderToAddDeposit || !additionalDeposit) return;

    try {
      const currentDeposit = parseFloat(
        preorderToAddDeposit.deposit_paid.toString()
      );
      const additionalAmount = parseFloat(additionalDeposit);
      const newDeposit = parseFloat(
        (currentDeposit + additionalAmount).toFixed(2)
      );

      // Use PATCH request to update only the deposit field
      await axios.patch(`/preorder/orders/${preorderToAddDeposit.id}/`, {
        deposit_paid: newDeposit,
      });

      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["preorders"] });

      setDepositDialogOpen(false);
      setPreorderToAddDeposit(null);
      setAdditionalDeposit("");
    } catch (error) {
      console.error("Error adding deposit:", error);
    }
  };

  const openDepositDialog = (preorder: Preorder) => {
    setPreorderToAddDeposit(preorder);
    setDepositDialogOpen(true);
    setAdditionalDeposit("");
  };

  const filteredPreorders =
    preorders?.data?.filter((preorder: Preorder) => {
      const matchesSearch =
        preorder.customer_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        preorder.customer_phone.includes(searchTerm) ||
        preorder.customer_email
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        preorder.preorder_product.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter && statusFilter !== "all"
          ? preorder.status === statusFilter
          : true;

      const matchesProduct =
        productFilter === "all" ||
        preorder.preorder_product.id.toString() === productFilter;

      return matchesSearch && matchesStatus && matchesProduct;
    }) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800";
      case "DEPOSIT_PAID":
        return "bg-purple-100 text-purple-800";
      case "FULLY_PAID":
        return "bg-green-100 text-green-800";
      case "ARRIVED":
        return "bg-indigo-100 text-indigo-800";
      case "DELIVERED":
        return "bg-emerald-100 text-emerald-800";
      case "COMPLETED":
        return "bg-gray-100 text-gray-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Preorders
            </CardTitle>
            <CardDescription>
              Manage customer preorders and track their status
            </CardDescription>
          </div>
          <Link href="/preorder/create">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              Create Preorder
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by customer name, phone, email, or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Deposit Paid</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPreorders?.map((preorder: Preorder) => (
                <TableRow key={preorder.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {preorder.customer_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {preorder.customer_phone}
                      </div>
                      {preorder.customer_email && (
                        <div className="text-sm text-gray-500">
                          {preorder.customer_email}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {preorder.preorder_product.name}
                      </div>
                      {preorder.variation && (
                        <div className="text-sm text-gray-500">
                          {preorder.variation.size} - {preorder.variation.color}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{preorder.quantity}</TableCell>
                  <TableCell>{formatCurrency(preorder.total_amount)}</TableCell>
                  <TableCell>{formatCurrency(preorder.deposit_paid)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(preorder.status)}>
                      {preorder.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(preorder.created_at).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openViewDialog(preorder)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {preorder.status === "DELIVERED" && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleCompletePreorder(preorder.id)
                              }
                              className="text-green-600"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Complete & Convert to Sale
                            </DropdownMenuItem>
                          )}
                          {preorder.status !== "DELIVERED" &&
                            preorder.status !== "COMPLETED" && (
                              <DropdownMenuItem
                                onClick={() => handleMarkAsDelivered(preorder)}
                                className="text-blue-600"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Mark as Delivered
                              </DropdownMenuItem>
                            )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => openDepositDialog(preorder)}
                            className="text-purple-600"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Add Deposit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="text-blue-600">
                              <Edit className="h-4 w-4 mr-2" />
                              Change Status
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                              {STATUS_OPTIONS.filter(
                                (option) => option.value !== "all"
                              ).map((status) => (
                                <DropdownMenuItem
                                  key={status.value}
                                  onClick={() =>
                                    handleStatusChange(
                                      preorder.id,
                                      status.value
                                    )
                                  }
                                  className={
                                    preorder.status === status.value
                                      ? "bg-blue-50"
                                      : ""
                                  }
                                >
                                  {status.label}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => openDeleteDialog(preorder)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredPreorders?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No preorders found</p>
          </div>
        )}
      </CardContent>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Preorder</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this preorder? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePreorder}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Preorder Modal */}
      <AlertDialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Preorder Details</AlertDialogTitle>
            <AlertDialogDescription>
              {preorderToView && (
                <div className="space-y-2 mt-2">
                  <div>
                    <span className="font-semibold">Customer:</span>{" "}
                    {preorderToView.customer_name} <br />
                    <span className="font-semibold">Phone:</span>{" "}
                    {preorderToView.customer_phone} <br />
                    {preorderToView.customer_email && (
                      <>
                        <span className="font-semibold">Email:</span>{" "}
                        {preorderToView.customer_email} <br />
                      </>
                    )}
                  </div>
                  <div>
                    <span className="font-semibold">Product:</span>{" "}
                    {preorderToView.preorder_product.name} <br />
                    {preorderToView.variation && (
                      <span className="text-sm text-gray-500">
                        {preorderToView.variation.size} -{" "}
                        {preorderToView.variation.color}
                        <br />
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="font-semibold">Quantity:</span>{" "}
                    {preorderToView.quantity} <br />
                    <span className="font-semibold">Total Amount:</span>{" "}
                    {formatCurrency(preorderToView.total_amount)} <br />
                    <span className="font-semibold">Deposit Paid:</span>{" "}
                    {formatCurrency(preorderToView.deposit_paid)} <br />
                  </div>
                  <div>
                    <span className="font-semibold">Status:</span>{" "}
                    {preorderToView.status} <br />
                    <span className="font-semibold">Created At:</span>{" "}
                    {new Date(preorderToView.created_at).toLocaleString()}{" "}
                    <br />
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Deposit Modal */}
      <AlertDialog open={depositDialogOpen} onOpenChange={setDepositDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add Deposit</AlertDialogTitle>
            <AlertDialogDescription>
              {preorderToAddDeposit && (
                <div className="space-y-4 mt-2">
                  <div>
                    <p className="text-sm text-gray-600">
                      Customer: {preorderToAddDeposit.customer_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Current Deposit:{" "}
                      {formatCurrency(preorderToAddDeposit.deposit_paid)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Total Amount:{" "}
                      {formatCurrency(preorderToAddDeposit.total_amount)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Additional Deposit Amount
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Enter amount"
                      value={additionalDeposit}
                      onChange={(e) => setAdditionalDeposit(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAddDeposit}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Add Deposit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
