"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  PlusCircle,
  Trash2,
  ArrowLeft,
  Package,
  Tag,
  DollarSign,
  Warehouse,
  Calendar,
} from "lucide-react";
import {
  useProduct,
  useUpdateProduct,
  useCategories,
  useSuppliers,
} from "@/hooks/queries/useInventory";
import type { UpdateProductDTO } from "@/types/inventory";

import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

// Define types for our variants
type Variant = {
  id: string;
  size: string;
  color: string;
  stock: number;
};

export default function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { data: product, isLoading: isLoadingProduct } = useProduct(
    parseInt(params.id)
  );
  const updateProduct = useUpdateProduct();
  const { data: categories = [] } = useCategories();
  const { data: suppliers = [] } = useSuppliers();

  // State for basic product info
  const [productName, setProductName] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [supplier, setSupplier] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [status, setStatus] = useState<"active" | "inactive" | "discontinued">(
    "active"
  );

  // State for variants
  const [variants, setVariants] = useState<Variant[]>([]);
  const { toast } = useToast();

  // Load product data when available
  useEffect(() => {
    if (product) {
      setProductName(product.name);
      setSku(product.sku);
      setDescription(product.description || "");
      setCategory(product.category?.toString() || "");
      setSupplier(product.supplier?.toString() || "");
      setCostPrice(product.cost_price.toString());
      setPrice(product.selling_price.toString());
      setStock(product.stock_quantity.toString());
      setStatus(product.is_active ? "active" : "inactive");

      // Load existing variations
      if (product.variations) {
        const loadedVariants = product.variations.map((variation) => ({
          id: `var-${variation.id}`,
          size: variation.size,
          color: variation.color,
          stock: variation.stock,
        }));
        setVariants(loadedVariants);
      }
    }
  }, [product]);

  // Function to add a new variant
  const addVariant = () => {
    const newVariant: Variant = {
      id: `new-${variants.length + 1}`,
      size: "S",
      color: "Black",
      stock: 0,
    };
    setVariants([...variants, newVariant]);
  };

  // Function to update a variant
  const updateVariant = (
    id: string,
    field: keyof Variant,
    value: string | number
  ) => {
    setVariants(
      variants.map((variant) =>
        variant.id === id ? { ...variant, [field]: value } : variant
      )
    );
  };

  // Function to remove a variant
  const removeVariant = (id: string) => {
    setVariants(variants.filter((variant) => variant.id !== id));
  };

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const productData: UpdateProductDTO = {
        id: parseInt(params.id),
        name: productName,
        sku,
        description,
        selling_price: parseFloat(price),
        cost_price: parseFloat(costPrice),
        stock_quantity: parseInt(stock),
        category: parseInt(category),
        supplier: supplier ? parseInt(supplier) : undefined,
        is_active: status === "active",
        variations: variants.map((variant) => ({
          size: variant.size,
          color: variant.color,
          stock: variant.stock,
        })),
      };

      await updateProduct.mutateAsync(productData);
      toast({
        variant: "default",
        title: "Success",
        description: "Product updated successfully",
      });
      router.push("/inventory/products");
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to update product",
      });
      console.error("Error updating product:", error);
    }
  };

  if (isLoadingProduct) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="container mx-auto py-6 space-y-8">
      {/* Header with navigation and actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit Product</h1>
            <p className="text-muted-foreground">
              Update product information and variations
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={updateProduct.isPending}>
            {updateProduct.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Product overview card */}
      <Card className="overflow-hidden border-0 shadow-lg">
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 p-6 border-b">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">Product Information</h2>
              </div>
              <p className="text-muted-foreground">
                Update the basic details of your product
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left column */}
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-500" />
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      placeholder="Classic Oxford Shirt"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      placeholder="MEN-SHIRT-OXF-001"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter product description"
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Separator className="my-2" />

              {/* Pricing */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  Pricing
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="costPrice">Cost Price</Label>
                    <Input
                      id="costPrice"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={costPrice}
                      onChange={(e) => setCostPrice(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Selling Price</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Categories and Suppliers */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Tag className="h-5 w-5 text-purple-500" />
                  Categories & Suppliers
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supplier">Supplier</Label>
                    <Select value={supplier} onValueChange={setSupplier}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map((sup) => (
                          <SelectItem key={sup.id} value={sup.id.toString()}>
                            {sup.company_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator className="my-2" />

              {/* Stock Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Warehouse className="h-5 w-5 text-orange-500" />
                  Stock Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stock">Current Stock</Label>
                    <Input
                      id="stock"
                      type="number"
                      placeholder="0"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={status}
                      onValueChange={(
                        value: "active" | "inactive" | "discontinued"
                      ) => setStatus(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="discontinued">
                          Discontinued
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Product variations */}
      <Card className="overflow-hidden border-0 shadow-lg">
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 p-6 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Tag className="h-5 w-5 text-blue-500" />
              Product Variations
            </h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addVariant}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Add Variation
            </Button>
          </div>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-6 py-3 text-left font-medium text-sm text-muted-foreground">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-sm text-muted-foreground">
                    Color
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-sm text-muted-foreground">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-center font-medium text-sm text-muted-foreground w-10">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {variants.map((variant) => (
                  <tr
                    key={variant.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <Select
                        value={variant.size}
                        onValueChange={(value) =>
                          updateVariant(variant.id, "size", value)
                        }
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="XS">XS</SelectItem>
                          <SelectItem value="S">S</SelectItem>
                          <SelectItem value="M">M</SelectItem>
                          <SelectItem value="L">L</SelectItem>
                          <SelectItem value="XL">XL</SelectItem>
                          <SelectItem value="XXL">XXL</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-6 py-4">
                      <Input
                        value={variant.color}
                        onChange={(e) =>
                          updateVariant(variant.id, "color", e.target.value)
                        }
                        className="w-32"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <Input
                        type="number"
                        value={variant.stock}
                        onChange={(e) =>
                          updateVariant(
                            variant.id,
                            "stock",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-24"
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVariant(variant.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </form>
  );
}
