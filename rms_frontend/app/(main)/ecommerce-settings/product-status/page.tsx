"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
import {
  Search,
  Star,
  TrendingUp,
  Sparkles,
  Filter,
  Save,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { useProducts } from "@/hooks/queries/useInventory";
import { useUpdateProductEcommerceStatus } from "@/hooks/queries/useEcommerce";

interface Product {
  id: number;
  name: string;
  sku: string;
  image: string;
  image_url?: string;
  category: string;
  online_category_name?: string;
  price: number;
  selling_price: number;
  stock: number;
  stock_quantity: number;
  is_new_arrival: boolean;
  is_trending: boolean;
  is_featured: boolean;
  status: string;
  assign_to_online: boolean;
}

export default function ProductStatusPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [featureFilter, setFeatureFilter] = useState("all");

  // Use React Query hooks
  const { data: products = [], isLoading, error, refetch } = useProducts();

  // Transform products data
  const transformedProducts = products.map((product: any) => ({
    id: product.id,
    name: product.name,
    sku: product.sku,
    image: product.image || product.image_url || "/placeholder.jpg",
    category: (product.online_categories && product.online_categories.length > 0)
      ? product.online_categories[0].name
      : (product.category_name || "Uncategorized"),
    price: product.selling_price || product.cost_price || 0,
    stock: product.stock_quantity || 0,
    is_new_arrival: product.is_new_arrival || false,
    is_trending: product.is_trending || false,
    is_featured: product.is_featured || false,
    status: product.assign_to_online ? "active" : "inactive",
    assign_to_online: product.assign_to_online || false,
  }));

  // Update product status using React Query mutation
  const updateProductStatusMutation = useUpdateProductEcommerceStatus();

  const updateProductStatus = async (productId: number, field: string, value: boolean) => {
    try {
      await updateProductStatusMutation.mutateAsync({
        productId,
        status: { [field]: value }
      });
      toast.success(`${field.replace('_', ' ')} status updated successfully`);
    } catch (error: any) {
      console.error('Error updating product status:', error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to update product status";
      toast.error(errorMessage);
    }
  };

  const handleToggleStatus = (productId: number, status: 'new_arrival' | 'trending' | 'featured') => {
    const currentValue = transformedProducts.find(p => p.id === productId)?.[`is_${status}`] || false;
    updateProductStatus(productId, `is_${status}`, !currentValue);
  };

  const handleSaveChanges = () => {
    toast.success("All changes are saved automatically!");
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setStatusFilter("all");
    setFeatureFilter("all");
  };

  const filteredProducts = transformedProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || product.status === statusFilter;
    const matchesFeature = featureFilter === "all" ||
      (featureFilter === "new" && product.is_new_arrival) ||
      (featureFilter === "trending" && product.is_trending) ||
      (featureFilter === "featured" && product.is_featured);

    return matchesSearch && matchesCategory && matchesStatus && matchesFeature;
  });

  const categories = Array.from(new Set(transformedProducts.map(p => p.category)));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "inactive":
        return <Badge className="bg-red-100 text-red-800">Inactive</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return <Badge className="bg-red-100 text-red-800">Out of Stock</Badge>;
    } else if (stock < 10) {
      return <Badge className="bg-yellow-100 text-yellow-800">Low Stock</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-800">In Stock</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Star className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Product Status Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage product visibility and promotional statuses.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8">
          {/* Filters and Search */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Filters & Search
              </CardTitle>
              <CardDescription>
                Filter and search products to manage their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search Products</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by name or SKU..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Feature</label>
                  <Select value={featureFilter} onValueChange={setFeatureFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Features</SelectItem>
                      <SelectItem value="new">New Arrival</SelectItem>
                      <SelectItem value="trending">Trending</SelectItem>
                      <SelectItem value="featured">Featured</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-gray-500">
                  Showing {filteredProducts.length} of {transformedProducts.length} products
                </div>
                <Button
                  variant="outline"
                  onClick={handleResetFilters}
                  className="flex items-center space-x-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Reset Filters</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Products List */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    Products
                  </CardTitle>
                  <CardDescription>
                    Manage product status and promotional features
                  </CardDescription>
                </div>
                <Button
                  onClick={() => refetch()}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
                  <span className="ml-2 text-gray-600">Loading products...</span>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="text-red-500 mb-4">
                    <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load products</h3>
                  <p className="text-gray-500 mb-4">There was an error loading the products data.</p>
                  <Button onClick={() => refetch()} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500 border-b pb-2">
                    <div className="col-span-4">Product</div>
                    <div className="col-span-2 text-center">Status</div>
                    <div className="col-span-2 text-center">Stock</div>
                    <div className="col-span-1 text-center">New</div>
                    <div className="col-span-1 text-center">Trending</div>
                    <div className="col-span-1 text-center">Featured</div>
                    <div className="col-span-1 text-center">Actions</div>
                  </div>

                  {/* Products */}
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="grid grid-cols-12 gap-4 items-center py-4 border-b border-gray-100 hover:bg-gray-50 rounded-lg px-2">
                      <div className="col-span-4 flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                          {product.image && product.image !== "/placeholder.jpg" ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={48}
                              height={48}
                              className="object-cover w-full h-full"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder.jpg';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                              No Image
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                          <div className="text-sm text-gray-500">${product.price}</div>
                        </div>
                      </div>

                      <div className="col-span-2 text-center">
                        {getStatusBadge(product.status)}
                      </div>

                      <div className="col-span-2 text-center">
                        {getStockBadge(product.stock)}
                      </div>

                      <div className="col-span-1 flex justify-center">
                        <Switch
                          checked={product.is_new_arrival}
                          onCheckedChange={() => handleToggleStatus(product.id, 'new_arrival')}
                          className="data-[state=checked]:bg-blue-600"
                          disabled={updateProductStatusMutation.isPending}
                        />
                      </div>

                      <div className="col-span-1 flex justify-center">
                        <Switch
                          checked={product.is_trending}
                          onCheckedChange={() => handleToggleStatus(product.id, 'trending')}
                          className="data-[state=checked]:bg-blue-600"
                          disabled={updateProductStatusMutation.isPending}
                        />
                      </div>

                      <div className="col-span-1 flex justify-center">
                        <Switch
                          checked={product.is_featured}
                          onCheckedChange={() => handleToggleStatus(product.id, 'featured')}
                          className="data-[state=checked]:bg-blue-600"
                          disabled={updateProductStatusMutation.isPending}
                        />
                      </div>

                      <div className="col-span-1 text-center">
                        <div className="flex justify-center space-x-1">
                          {product.is_new_arrival && (
                            <Sparkles className="h-4 w-4 text-blue-500" />
                          )}
                          {product.is_trending && (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          )}
                          {product.is_featured && (
                            <Star className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredProducts.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No products found matching your criteria.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


