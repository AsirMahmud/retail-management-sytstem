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

// Mock data for products with status
const mockProducts = [
  {
    id: 1,
    name: "Red Running Shoes",
    sku: "RS-001",
    image: "/placeholder.jpg",
    category: "Footwear",
    price: 89.99,
    stock: 25,
    isNewArrival: true,
    isTrending: false,
    isFeatured: true,
    status: "active",
  },
  {
    id: 2,
    name: "Vintage Camera",
    sku: "VC-012",
    image: "/placeholder.jpg",
    category: "Electronics",
    price: 299.99,
    stock: 8,
    isNewArrival: false,
    isTrending: true,
    isFeatured: false,
    status: "active",
  },
  {
    id: 3,
    name: "Wireless Headphones",
    sku: "WH-055",
    image: "/placeholder.jpg",
    category: "Electronics",
    price: 149.99,
    stock: 15,
    isNewArrival: false,
    isTrending: false,
    isFeatured: true,
    status: "active",
  },
  {
    id: 4,
    name: "Blue Jeans",
    sku: "BJ-023",
    image: "/placeholder.jpg",
    category: "Clothing",
    price: 59.99,
    stock: 30,
    isNewArrival: true,
    isTrending: true,
    isFeatured: false,
    status: "active",
  },
  {
    id: 5,
    name: "Smart Watch",
    sku: "SW-078",
    image: "/placeholder.jpg",
    category: "Electronics",
    price: 199.99,
    stock: 0,
    isNewArrival: false,
    isTrending: false,
    isFeatured: false,
    status: "inactive",
  },
];

export default function ProductStatusPage() {
  const [products, setProducts] = useState(mockProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [featureFilter, setFeatureFilter] = useState("all");

  const handleToggleStatus = (productId: number, status: 'newArrival' | 'trending' | 'featured') => {
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, [`is${status.charAt(0).toUpperCase() + status.slice(1)}`]: !product[`is${status.charAt(0).toUpperCase() + status.slice(1)}`] }
        : product
    ));
  };

  const handleSaveChanges = () => {
    toast.success("Product status changes saved successfully!");
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setStatusFilter("all");
    setFeatureFilter("all");
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || product.status === statusFilter;
    const matchesFeature = featureFilter === "all" || 
                          (featureFilter === "new" && product.isNewArrival) ||
                          (featureFilter === "trending" && product.isTrending) ||
                          (featureFilter === "featured" && product.isFeatured);
    
    return matchesSearch && matchesCategory && matchesStatus && matchesFeature;
  });

  const categories = Array.from(new Set(products.map(p => p.category)));

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
                  Showing {filteredProducts.length} of {products.length} products
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
                  onClick={handleSaveChanges}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardHeader>
            <CardContent>
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
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Image 
                          src={product.image} 
                          alt={product.name}
                          width={32}
                          height={32}
                          className="object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.jpg';
                          }}
                        />
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
                        checked={product.isNewArrival}
                        onCheckedChange={() => handleToggleStatus(product.id, 'newArrival')}
                        className="data-[state=checked]:bg-blue-600"
                      />
                    </div>
                    
                    <div className="col-span-1 flex justify-center">
                      <Switch
                        checked={product.isTrending}
                        onCheckedChange={() => handleToggleStatus(product.id, 'trending')}
                        className="data-[state=checked]:bg-blue-600"
                      />
                    </div>
                    
                    <div className="col-span-1 flex justify-center">
                      <Switch
                        checked={product.isFeatured}
                        onCheckedChange={() => handleToggleStatus(product.id, 'featured')}
                        className="data-[state=checked]:bg-blue-600"
                      />
                    </div>
                    
                    <div className="col-span-1 text-center">
                      <div className="flex justify-center space-x-1">
                        {product.isNewArrival && (
                          <Sparkles className="h-4 w-4 text-blue-500" title="New Arrival" />
                        )}
                        {product.isTrending && (
                          <TrendingUp className="h-4 w-4 text-green-500" title="Trending" />
                        )}
                        {product.isFeatured && (
                          <Star className="h-4 w-4 text-yellow-500" title="Featured" />
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

