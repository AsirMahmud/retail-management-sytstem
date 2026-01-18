"use client";

import { useState, useEffect } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Calendar,
  Percent,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Package,
  FolderTree,
  Check,
  ChevronsUpDown,
  RefreshCw,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import {
  useDiscounts,
  useCreateDiscount,
  useUpdateDiscount,
  useDeleteDiscount
} from "@/hooks/queries/useEcommerce";
import { categoriesApi, onlineCategoriesApi, productsApi } from "@/lib/api/inventory";
import { Category, Product } from "@/types/inventory";

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
  category?: number;
  online_category?: number;
  product?: number;
}

export default function DiscountManagementPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [openProductCombobox, setOpenProductCombobox] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "APP_WIDE",
    value: "",
    startDate: "",
    endDate: "",
    description: "",
    category: "",
    onlineCategory: "",
    product: "",
  });

  // Data for selectors
  const [categories, setCategories] = useState<Category[]>([]);
  const [onlineCategories, setOnlineCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  // Use React Query hooks
  const { data: discounts = [], isLoading, refetch } = useDiscounts();
  const createDiscountMutation = useCreateDiscount();
  const updateDiscountMutation = useUpdateDiscount();
  const deleteDiscountMutation = useDeleteDiscount();

  // Load categories and products for selectors
  useEffect(() => {
    const loadOptions = async () => {
      setLoadingOptions(true);
      try {
        const [cats, onlineCats, prods] = await Promise.all([
          categoriesApi.getAll(),
          onlineCategoriesApi.getAll(),
          productsApi.getAll(),
        ]);
        setCategories(cats);
        setOnlineCategories(onlineCats);
        setProducts(prods);
      } catch (error) {
        console.error('Error loading options:', error);
      } finally {
        setLoadingOptions(false);
      }
    };
    loadOptions();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      type: "APP_WIDE",
      value: "",
      startDate: "",
      endDate: "",
      description: "",
      category: "",
      onlineCategory: "",
      product: "",
    });
  };

  const handleCreateDiscount = async () => {
    if (!formData.name || !formData.value || !formData.startDate || !formData.endDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate category/product selection based on type
    if (formData.type === "CATEGORY" && !formData.category && !formData.onlineCategory) {
      toast.error("Please select a category for category discount");
      return;
    }
    if (formData.type === "PRODUCT" && !formData.product) {
      toast.error("Please select a product for product discount");
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
        category: formData.category ? parseInt(formData.category) : undefined,
        online_category: formData.onlineCategory ? parseInt(formData.onlineCategory) : undefined,
        product: formData.product ? parseInt(formData.product) : undefined,
      });

      resetForm();
      setIsCreating(false);
      toast.success("Discount created successfully!");
    } catch (error) {
      console.error('Error creating discount:', error);
      toast.error("Failed to create discount");
    }
  };

  const handleEditDiscount = (id: number) => {
    const discount = discounts.find((d: Discount) => d.id === id);
    if (discount) {
      setFormData({
        name: discount.name,
        type: discount.discount_type,
        value: discount.value.toString(),
        startDate: discount.start_date,
        endDate: discount.end_date,
        description: discount.description || "",
        category: discount.category?.toString() || "",
        onlineCategory: discount.online_category?.toString() || "",
        product: discount.product?.toString() || "",
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
        category: formData.category ? parseInt(formData.category) : undefined,
        online_category: formData.onlineCategory ? parseInt(formData.onlineCategory) : undefined,
        product: formData.product ? parseInt(formData.product) : undefined,
      });

      resetForm();
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
        return "Global";
      case "CATEGORY":
        return "Category";
      case "PRODUCT":
        return "Product";
      default:
        return type;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "APP_WIDE":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Global</Badge>;
      case "CATEGORY":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Category</Badge>;
      case "PRODUCT":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Product</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getTargetName = (discount: Discount) => {
    if (discount.discount_type === "APP_WIDE") return "All Products";
    if (discount.discount_type === "CATEGORY") {
      if (discount.online_category) {
        const cat = onlineCategories.find(c => c.id === discount.online_category);
        return cat?.name || `Online Category #${discount.online_category}`;
      }
      if (discount.category) {
        const cat = categories.find(c => c.id === discount.category);
        return cat?.name || `Category #${discount.category}`;
      }
      return "Unknown Category";
    }
    if (discount.discount_type === "PRODUCT") {
      const prod = products.find(p => p.id === discount.product);
      return prod?.name || `Product #${discount.product}`;
    }
    return "-";
  };

  // Helper to get consistent image URL
  const getProductImage = (product: Product | undefined) => {
    if (!product) return "/placeholder.svg";
    const img = product.image || product.first_variation_image;
    if (!img) return "/placeholder.svg";
    if (img.startsWith("/")) {
      return `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"}${img}`;
    }
    return img;
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

        {/* Priority Info Alert */}
        <Alert className="mb-6 bg-amber-50 border-amber-200">
          <Info className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Discount Priority:</strong> Product discounts override Category discounts, which override Global (App-Wide) discounts.
            Only one discount applies per product based on this priority.
          </AlertDescription>
        </Alert>

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
                        onValueChange={(value) => setFormData({
                          ...formData,
                          type: value,
                          category: "",
                          onlineCategory: "",
                          product: ""
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="APP_WIDE">🌐 Global (App-Wide)</SelectItem>
                          <SelectItem value="CATEGORY">📁 Category Discount</SelectItem>
                          <SelectItem value="PRODUCT">📦 Product Discount</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Category Selector - shown only for CATEGORY type */}
                    {formData.type === "CATEGORY" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="online-category">
                            <FolderTree className="inline h-4 w-4 mr-1" />
                            Online Category
                          </Label>
                          <Select
                            value={formData.onlineCategory}
                            onValueChange={(value) => setFormData({
                              ...formData,
                              onlineCategory: value === "_none" ? "" : value,
                              category: ""
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select online category..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="_none">None</SelectItem>
                              {onlineCategories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id.toString()}>
                                  {cat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="category">
                            <FolderTree className="inline h-4 w-4 mr-1" />
                            Or Inventory Category
                          </Label>
                          <Select
                            value={formData.category}
                            onValueChange={(value) => setFormData({
                              ...formData,
                              category: value === "_none" ? "" : value,
                              onlineCategory: ""
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select inventory category..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="_none">None</SelectItem>
                              {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id.toString()}>
                                  {cat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}

                    {/* Product Selector - Searchable Combobox */}
                    {formData.type === "PRODUCT" && (
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="product">
                          <Package className="inline h-4 w-4 mr-1" />
                          Select Product (Searchable)
                        </Label>
                        <Popover open={openProductCombobox} onOpenChange={setOpenProductCombobox}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openProductCombobox}
                              className="w-full justify-between h-14"
                            >
                              {formData.product ? (
                                <div className="flex items-center gap-2">
                                  {(() => {
                                    const selectedProduct = products.find((p) => p.id.toString() === formData.product);
                                    return selectedProduct ? (
                                      <>
                                        <div className="h-10 w-10 relative rounded overflow-hidden border">
                                          <img
                                            src={getProductImage(selectedProduct)}
                                            alt={selectedProduct.name}
                                            className="h-full w-full object-cover"
                                          />
                                        </div>
                                        <div className="flex flex-col items-start">
                                          <span className="font-medium text-sm">{selectedProduct.name}</span>
                                          <span className="text-xs text-muted-foreground">SKU: {selectedProduct.sku}</span>
                                        </div>
                                      </>
                                    ) : (
                                      "Select a product..."
                                    );
                                  })()}
                                </div>
                              ) : (
                                "Select a product..."
                              )}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[400px] p-0" align="start">
                            <Command>
                              <CommandInput placeholder="Search product by name or SKU..." />
                              <CommandList>
                                <CommandEmpty>No product found.</CommandEmpty>
                                <CommandGroup>
                                  {products.map((product) => (
                                    <CommandItem
                                      key={product.id}
                                      value={`${product.name} ${product.sku}`}
                                      onSelect={() => {
                                        setFormData({ ...formData, product: product.id.toString() });
                                        setOpenProductCombobox(false);
                                      }}
                                    >
                                      <HoverCard openDelay={200} closeDelay={100}>
                                        <HoverCardTrigger asChild>
                                          <div className="flex items-center gap-2 w-full cursor-pointer">
                                            <div className="h-8 w-8 relative rounded overflow-hidden border shrink-0">
                                              <img
                                                src={getProductImage(product)}
                                                alt={product.name}
                                                className="h-full w-full object-cover"
                                              />
                                            </div>
                                            <div className="flex flex-col">
                                              <span className="font-medium text-sm">{product.name}</span>
                                              <span className="text-xs text-muted-foreground">SKU: {product.sku}</span>
                                            </div>
                                            <Check
                                              className={cn(
                                                "ml-auto h-4 w-4",
                                                formData.product === product.id.toString() ? "opacity-100" : "opacity-0"
                                              )}
                                            />
                                          </div>
                                        </HoverCardTrigger>
                                        <HoverCardContent className="w-80 p-0" side="right" align="start">
                                          <div className="flex flex-col">
                                            <div className="relative w-full aspect-square overflow-hidden bg-white rounded-t-md">
                                              <img
                                                src={getProductImage(product)}
                                                alt={product.name}
                                                className="w-full h-full object-contain p-2"
                                              />
                                            </div>
                                            <div className="p-4 bg-slate-50 border-t">
                                              <h4 className="font-semibold text-sm">{product.name}</h4>
                                              <p className="text-xs text-muted-foreground mb-2">SKU: {product.sku}</p>
                                              <div className="grid grid-cols-2 gap-2 text-xs">
                                                <div className="flex flex-col">
                                                  <span className="text-muted-foreground">Price</span>
                                                  <span className="font-medium">৳{product.selling_price}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                  <span className="text-muted-foreground">Stock</span>
                                                  <span className="font-medium">{product.stock_quantity}</span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </HoverCardContent>
                                      </HoverCard>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}

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
                          min="1"
                          max="100"
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
                        resetForm();
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
                      <TableHead>Target</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {discounts.map((discount: Discount) => (
                      <TableRow key={discount.id}>
                        <TableCell className="font-medium">{discount.name}</TableCell>
                        <TableCell>{getTypeBadge(discount.discount_type)}</TableCell>
                        <TableCell className="text-sm text-gray-600">{getTargetName(discount)}</TableCell>
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
