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
import { PlusCircle, Trash2 } from "lucide-react";
import {
  useProduct,
  useUpdateProduct,
  useCategories,
  useSuppliers,
} from "@/hooks/queries/useInventory";
import type { UpdateProductDTO } from "@/types/inventory";
import { toast } from "sonner";

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

  // Load product data when available
  useEffect(() => {
    if (product) {
      setProductName(product.name);
      setSku(product.sku);
      setDescription(product.description || "");
      setCategory(product.category.toString());
      setSupplier(product.supplier?.toString() || "");
      setCostPrice(product.cost_price.toString());
      setPrice(product.selling_price.toString());
      setStock(product.stock_quantity.toString());
      setStatus(product.is_active ? "active" : "inactive");
    }
  }, [product]);

  // Function to add a new variant
  const addVariant = () => {
    const newVariant: Variant = {
      id: Date.now().toString(),
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
      };

      await updateProduct.mutateAsync(productData);
      toast.success("Product updated successfully");
      router.push("/inventory/products");
    } catch (error) {
      toast.error("Failed to update product");
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
    <form onSubmit={handleSubmit} className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={updateProduct.isPending}>
            {updateProduct.isPending ? "Updating..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>Update the details of your product</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={status}
              onValueChange={(value: "active" | "inactive" | "discontinued") =>
                setStatus(value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="discontinued">Discontinued</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Size and Color Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Size & Color Options</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addVariant}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Combination
              </Button>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium text-sm">
                      Size
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-sm">
                      Color
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-sm">
                      Stock
                    </th>
                    <th className="px-4 py-3 text-center font-medium text-sm w-10">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {variants.map((variant) => (
                    <tr key={variant.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3">
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
                      <td className="px-4 py-3">
                        <Input
                          value={variant.color}
                          onChange={(e) =>
                            updateVariant(variant.id, "color", e.target.value)
                          }
                          className="w-32"
                        />
                      </td>
                      <td className="px-4 py-3">
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
                      <td className="px-4 py-3 text-center">
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
        </CardContent>
      </Card>
    </form>
  );
}
