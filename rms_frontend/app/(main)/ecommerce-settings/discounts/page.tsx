"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Percent,
  Tag,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { 
  useDiscounts, 
  useCreateDiscount, 
  useUpdateDiscount, 
  useDeleteDiscount 
} from "@/hooks/queries/useEcommerce";

interface Discount {
  id: number;
  name: string;
  discount_type: string;
  value: number;
  start_date: string;
  end_date: string;
  status: string;
  description: string;
  is_active: boolean;
}

export default function DiscountManagementPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "APP_WIDE",
    value: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  // Use React Query hooks
  const { data: discounts = [], isLoading, refetch } = useDiscounts();
  const createDiscountMutation = useCreateDiscount();
  const updateDiscountMutation = useUpdateDiscount();
  const deleteDiscountMutation = useDeleteDiscount();

  const handleCreateDiscount = async () => {
    if (!formData.name || !formData.value || !formData.startDate || !formData.endDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createDiscountMutation.mutateAsync({
        name: formData.name,
        discount_type: formData.type as 'APP_WIDE' | 'CATEGORY' | 'PRODUCT',
        value: parseInt(formData.value),
        start_date: formData.startDate,
        end_date: formData.endDate,
        description: formData.description,
        is_active: true,
        status: 'ACTIVE',
      });
      
      setFormData({
        name: "",
        type: "APP_WIDE",
        value: "",
        startDate: "",
        endDate: "",
        description: "",
      });
      setIsCreating(false);
      toast.success("Discount created successfully!");
    } catch (error) {
      console.error('Error creating discount:', error);
      toast.error("Failed to create discount");
    }
  };

  const handleEditDiscount = (id: number) => {
    const discount = discounts.find(d => d.id === id);
    if (discount) {
      setFormData({
        name: discount.name,
        type: discount.discount_type,
        value: discount.value.toString(),
        startDate: discount.start_date,
        endDate: discount.end_date,
        description: discount.description,
      });
      setEditingId(id);
    }
  };

  const handleUpdateDiscount = async () => {
    if (!formData.name || !formData.value || !formData.startDate || !formData.endDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await updateDiscountMutation.mutateAsync({
        id: editingId!,
        name: formData.name,
        discount_type: formData.type as 'APP_WIDE' | 'CATEGORY' | 'PRODUCT',
        value: parseInt(formData.value),
        start_date: formData.startDate,
        end_date: formData.endDate,
        description: formData.description,
      });

      setFormData({
        name: "",
        type: "APP_WIDE",
        value: "",
        startDate: "",
        endDate: "",
        description: "",
      });
      setEditingId(null);
      toast.success("Discount updated successfully!");
    } catch (error) {
      console.error('Error updating discount:', error);
      toast.error("Failed to update discount");
    }
  };

  const handleDeleteDiscount = async (id: number) => {
    try {
      await deleteDiscountMutation.mutateAsync(id);
      toast.success("Discount deleted successfully!");
    } catch (error) {
      console.error('Error deleting discount:', error);
      toast.error("Failed to delete discount");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "expired":
        return <Badge className="bg-red-100 text-red-800">Expired</Badge>;
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "APP_WIDE":
        return "App-Wide";
      case "CATEGORY":
        return "Category";
      case "PRODUCT":
        return "Product";
      default:
        return type;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Percent className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Discount Management
              </h1>
              <p className="text-gray-600 mt-1">
                Create and manage discount campaigns for your products.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8">
          {/* Create/Edit Discount Form */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">
                {editingId ? "Edit Discount" : isCreating ? "Create New Discount" : "Discount Management"}
              </CardTitle>
              <CardDescription>
                {editingId ? "Update discount details" : isCreating ? "Add a new discount campaign" : "Manage your discount campaigns"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isCreating || editingId ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Discount Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter discount name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="type">Discount Type</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => setFormData({ ...formData, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="APP_WIDE">App-Wide Discount</SelectItem>
                          <SelectItem value="CATEGORY">Category Discount</SelectItem>
                          <SelectItem value="PRODUCT">Product Discount</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="value">Discount Value (%)</Label>
                      <div className="relative">
                        <Input
                          id="value"
                          type="number"
                          value={formData.value}
                          onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                          placeholder="Enter discount percentage"
                          className="pl-10"
                        />
                        <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="start-date">Start Date</Label>
                      <div className="relative">
                        <Input
                          id="start-date"
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                          className="pl-10"
                        />
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="end-date">End Date</Label>
                      <div className="relative">
                        <Input
                          id="end-date"
                          type="date"
                          value={formData.endDate}
                          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                          className="pl-10"
                        />
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter discount description"
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsCreating(false);
                        setEditingId(null);
                        setFormData({
                          name: "",
                          type: "APP_WIDE",
                          value: "",
                          startDate: "",
                          endDate: "",
                          description: "",
                        });
                      }}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                    <Button
                      onClick={editingId ? handleUpdateDiscount : handleCreateDiscount}
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {editingId ? "Update Discount" : "Create Discount"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-end">
                  <Button
                    onClick={() => setIsCreating(true)}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Discount
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Discounts List */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Active Discounts
              </CardTitle>
              <CardDescription>
                Manage your existing discount campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
                  <span className="ml-2 text-gray-600">Loading discounts...</span>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {discounts.map((discount) => (
                      <TableRow key={discount.id}>
                        <TableCell className="font-medium">{discount.name}</TableCell>
                        <TableCell>{getTypeLabel(discount.discount_type)}</TableCell>
                        <TableCell>{discount.value}%</TableCell>
                        <TableCell>{new Date(discount.start_date).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(discount.end_date).toLocaleDateString()}</TableCell>
                        <TableCell>{getStatusBadge(discount.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditDiscount(discount.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteDiscount(discount.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


