"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProducts, useDeleteProduct } from "@/hooks/queries/useInventory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PlusCircle,
  Search,
  SortAsc,
  Grid3X3,
  List,
  Package,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  MoreHorizontal,
  Edit3,
  Eye,
  Trash2,
  Barcode,
  Tag,
  Building2,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import type { Product } from "@/types/inventory";
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
import { toast } from "sonner";

export default function ProductsPage() {
  const router = useRouter();
  const { data: products = [], isLoading } = useProducts();
  const deleteProduct = useDeleteProduct();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct.mutateAsync(productToDelete.id);
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Failed to delete product");
      console.error("Error deleting product:", error);
    } finally {
      setProductToDelete(null);
    }
  };

  // Filter products based on search and filters
  const filteredProducts = products.filter((product: Product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || product.category_name === categoryFilter;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && product.is_active) ||
      (statusFilter === "inactive" && !product.is_active);

    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "low" &&
        product.stock_quantity <= product.minimum_stock) ||
      (stockFilter === "out" && product.stock_quantity === 0) ||
      (stockFilter === "in" && product.stock_quantity > product.minimum_stock);

    return matchesSearch && matchesCategory && matchesStatus && matchesStock;
  });

  // Calculate statistics
  const totalProducts = products.length;
  const activeProducts = products.filter((p: Product) => p.is_active).length;
  const lowStockProducts = products.filter(
    (p: Product) => p.stock_quantity <= p.minimum_stock
  ).length;
  const outOfStockProducts = products.filter(
    (p: Product) => p.stock_quantity === 0
  ).length;
  const totalValue = products.reduce(
    (sum: number, product: Product) =>
      sum + parseFloat(product.selling_price) * product.stock_quantity,
    0
  );

  // Get unique categories for filter
  const categories = Array.from(
    new Set(products.map((p: Product) => p.category_name).filter(Boolean))
  );

  if (isLoading) {
    return (
      <div className="space-y-6 ">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-80" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>

        <div className="grid gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const ProductCard = ({ product }: { product: Product }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-border">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-1">
                  {product.name}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Barcode className="h-3 w-3" />
                  {product.sku}
                </div>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href={`/inventory/products/${product.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href={`/inventory/products/${product.id}/edit`}>
                  <Edit3 className="mr-2 h-4 w-4" />
                  Edit Product
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive cursor-pointer">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Product
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Tag className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Category</span>
            </div>
            <p className="font-medium">
              {product.category_name || "Uncategorized"}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Building2 className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Supplier</span>
            </div>
            <p className="font-medium">
              {typeof product.supplier === "object"
                ? product.supplier_name
                : "N/A"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Cost Price</p>
            <p className="text-lg font-bold text-red-600">
              ${product.cost_price}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Selling Price</p>
            <p className="text-lg font-bold text-green-600">
              ${product.selling_price}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <Badge
              variant={
                product.stock_quantity <= product.minimum_stock
                  ? "destructive"
                  : "default"
              }
              className="text-xs"
            >
              Stock: {product.stock_quantity}
            </Badge>
            <Badge
              variant={product.is_active ? "default" : "secondary"}
              className="text-xs"
            >
              {product.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground">
            Min: {product.minimum_stock}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <div className="space-y-6 max-w-[1980px] w-full overflow-hidden">
        {/* Header */}
        <div className="flex flex-col  md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Products</h1>
            <p className="text-muted-foreground">
              Manage your product inventory and track stock levels
            </p>
          </div>
          <Link href="/inventory/add-product">
            <Button className="w-fit">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Product
            </Button>
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories
                    .filter((category): category is string => !!category)
                    .map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Stock" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stock</SelectItem>
                  <SelectItem value="in">In Stock</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="out">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <SortAsc className="mr-2 h-4 w-4" />
              Sort
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("table")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Products
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                +5 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Products
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeProducts}</div>
              <p className="text-xs text-muted-foreground">
                {((activeProducts / totalProducts) * 100).toFixed(1)}% of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalValue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Inventory value</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {lowStockProducts}
              </div>
              <p className="text-xs text-muted-foreground">Need restocking</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Out of Stock
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {outOfStockProducts}
              </div>
              <p className="text-xs text-muted-foreground">
                Urgent action needed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredProducts.length} of {totalProducts} products
          </p>
          {(searchQuery ||
            categoryFilter !== "all" ||
            statusFilter !== "all" ||
            stockFilter !== "all") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter("all");
                setStatusFilter("all");
                setStockFilter("all");
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Content */}
        <Tabs
          value={viewMode}
          onValueChange={(value) => setViewMode(value as "table" | "grid")}
          className=" "
        >
          <TabsContent value="table" className="space-y-4 ">
            <Card>
              <div
                className=" overflow-x-scroll
          "
              >
                <Table className=" ">
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="font-semibold">Product</TableHead>
                      <TableHead className="font-semibold">SKU</TableHead>
                      <TableHead className="font-semibold">Category</TableHead>
                      <TableHead className="font-semibold">Supplier</TableHead>
                      <TableHead className="font-semibold text-right">
                        Cost Price
                      </TableHead>
                      <TableHead className="font-semibold text-right">
                        Selling Price
                      </TableHead>
                      <TableHead className="font-semibold text-center">
                        Stock
                      </TableHead>
                      <TableHead className="font-semibold text-center">
                        Status
                      </TableHead>
                      <TableHead className="w-[70px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product: Product) => (
                      <TableRow key={product.id} className="group">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                              <Package className="h-4 w-4" />
                            </div>
                            <div>
                              <Link
                                href={`/inventory/products/${product.id}`}
                                className="font-medium hover:text-primary transition-colors"
                              >
                                {product.name}
                              </Link>
                              {/* <div className="text-sm text-muted-foreground">
                                {product.barcode && (
                                  <span className="flex items-center gap-1">
                                    <Barcode className="h-3 w-3" />
                                    {product.barcode}
                                  </span>
                                )}
                              </div> */}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="font-mono max-w-[100px] whitespace-normal break-all text-xs"
                          >
                            {product.sku}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-muted-foreground" />
                            {product.category_name || "Uncategorized"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            {typeof product.supplier === "object"
                              ? product.supplier?.company_name
                              : "N/A"}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium text-red-600">
                          ${product.cost_price}
                        </TableCell>
                        <TableCell className="text-right font-medium text-green-600">
                          ${product.selling_price}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center gap-1">
                            <Badge
                              variant={
                                product.stock_quantity <= product.minimum_stock
                                  ? "destructive"
                                  : "default"
                              }
                              className="text-xs"
                            >
                              {product.stock_quantity}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Min: {product.minimum_stock}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={
                              product.is_active ? "default" : "secondary"
                            }
                          >
                            {product.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem
                                asChild
                                className="cursor-pointer"
                              >
                                <Link
                                  href={`/inventory/products/${product.id}`}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                asChild
                                className="cursor-pointer"
                              >
                                <Link
                                  href={`/inventory/products/${product.id}/edit`}
                                >
                                  <Edit3 className="mr-2 h-4 w-4" />
                                  Edit Product
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive cursor-pointer"
                                onClick={() => setProductToDelete(product)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Product
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="grid" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Empty State */}
        {filteredProducts.length === 0 && !isLoading && (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ||
                categoryFilter !== "all" ||
                statusFilter !== "all" ||
                stockFilter !== "all"
                  ? "No products match your current filters."
                  : "Get started by adding your first product."}
              </p>
              {!searchQuery &&
              categoryFilter === "all" &&
              statusFilter === "all" &&
              stockFilter === "all" ? (
                <Link href="/inventory/add-product">
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setCategoryFilter("all");
                    setStatusFilter("all");
                    setStockFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
      <AlertDialog
        open={!!productToDelete}
        onOpenChange={() => setProductToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              product
              {productToDelete && ` "${productToDelete.name}"`} and remove it
              from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProduct}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
