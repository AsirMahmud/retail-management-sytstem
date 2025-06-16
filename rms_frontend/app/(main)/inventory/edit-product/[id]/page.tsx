"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PlusCircle, Trash2, ShoppingCart, ArrowLeft } from "lucide-react";
import {
  useUpdateProduct,
  useProduct,
  useCategories,
  useSuppliers,
} from "@/hooks/queries/useInventory";
import type {
  CreateProductDTO,
  Product,
  ProductVariation as ImportedProductVariation,
} from "@/types/inventory";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { HydrationWrapper } from "@/components/hydration-wrapper";
import { COLORS, globalSizes } from "../../add-product/constants";

// Import the same global sizes and colors from add-product

// Add type definitions for globalSizes
type SizeType = keyof typeof globalSizes;
type GenderType = "MALE" | "FEMALE" | "UNISEX";
type SizeCategoryType = "US" | "EU" | "UK" | "Asia" | "international";

// Define the form schema using Zod (same as add-product)
const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  category: z.string({ required_error: "Please select a category" }),
  supplier: z.string({ required_error: "Please select a supplier" }).optional(),
  cost_price: z.string().min(1, "Cost price is required"),
  selling_price: z.string().min(1, "Selling price is required"),
  status: z.enum(["active", "inactive", "discontinued"]),
  minimum_stock: z.number().default(10),
  size_type: z.enum(
    [
      "pants",
      "shoes",
      "belts",
      "underwear",
      "jersey",
      "shirts",
      "tshirts",
    ] as const,
    {
      required_error: "Please select a size type",
    }
  ),
  gender: z.enum(["MALE", "FEMALE", "UNISEX"] as const, {
    required_error: "Please select a gender",
  }),
  size_category: z
    .string({ required_error: "Please select a size category" })
    .optional(),
  variations: z
    .array(
      z.object({
        size: z.string().min(1, "Size is required"),
        color: z.string().min(1, "Color is required"),
        stock: z.number().min(0, "Stock must be 0 or greater"),
      })
    )
    .optional(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

// Define types for our variants (same as add-product)
type ColorVariant = {
  id: string;
  color: string;
  colorHex: string;
  stock: number;
};

type SizeVariant = {
  id: string;
  size: string;
  colors: ColorVariant[];
};

// Add type guards
const isValidSizeType = (value: string): value is SizeType => {
  return [
    "pants",
    "shoes",
    "belts",
    "underwear",
    "jersey",
    "shirts",
    "tshirts",
  ].includes(value);
};

const isValidGender = (value: string): value is GenderType => {
  return ["MALE", "FEMALE", "UNISEX"].includes(value);
};

// Add gender mapping
const genderToSizeKey = {
  MALE: "men",
  FEMALE: "women",
  UNISEX: "men", // Use men's sizes for unisex
} as const;

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = typeof params.id === "string" ? parseInt(params.id) : 0;
  const updateProduct = useUpdateProduct();
  const { data: product, isLoading: isLoadingProduct } = useProduct(productId);
  const { toast } = useToast();
  const { data: categories = [], isLoading: isLoadingCategories } =
    useCategories();
  const { data: suppliers = [], isLoading: isLoadingSuppliers } =
    useSuppliers();

  // Initialize form with react-hook-form and zod resolver
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      category: undefined,
      supplier: undefined,
      cost_price: "",
      selling_price: "",
      status: "active",
      minimum_stock: 10,
      size_type: undefined,
      gender: undefined,
    },
  });

  // State for variants
  const [variants, setVariants] = useState<SizeVariant[]>([]);
  const [sizeCategory, setSizeCategory] = useState<string>("");

  // Watch form values for dynamic updates
  const watchedSizeType = form.watch("size_type");
  const watchedGender = form.watch("gender");

  // Load product data into form when available
  useEffect(() => {
    if (product) {
      // Set form values with proper type assertions
      form.reset({
        name: product.name,
        description: product.description || "",
        category: product.category?.id.toString(),
        supplier: product.supplier?.id.toString(),
        cost_price: product.cost_price.toString(),
        selling_price: product.selling_price.toString(),
        status: product.is_active ? "active" : "inactive",
        minimum_stock: product.minimum_stock,
        size_type: (product.size_type || "pants") as SizeType,
        gender: (product.gender || "MALE") as GenderType,
      });

      // Set size category
      setSizeCategory(product.size_category || "");

      // Set variants with proper typing
      if (product.variations) {
        const sizeVariants: SizeVariant[] = [];
        const sizeMap = new Map<string, SizeVariant>();

        product.variations.forEach((variation: ImportedProductVariation) => {
          if (!sizeMap.has(variation.size)) {
            const sizeVariant: SizeVariant = {
              id: Math.random().toString(36).substr(2, 9),
              size: variation.size,
              colors: [],
            };
            sizeMap.set(variation.size, sizeVariant);
            sizeVariants.push(sizeVariant);
          }

          const sizeVariant = sizeMap.get(variation.size)!;
          sizeVariant.colors.push({
            id: Math.random().toString(36).substr(2, 9),
            color: variation.color,
            colorHex: (variation as any).color_hax || "#000000", // Use type assertion for color_hax
            stock: variation.stock,
          });
        });

        setVariants(sizeVariants);
      }
    }
  }, [product, form]);

  // Update the availableSizes useMemo with proper typing and data access
  const availableSizes = useMemo(() => {
    if (!watchedSizeType || !sizeCategory) return [];

    const sizeTypeData =
      globalSizes[watchedSizeType as keyof typeof globalSizes];
    if (!sizeTypeData) return [];

    // Handle different size type structures
    if (watchedSizeType === "belts" || watchedSizeType === "jersey") {
      return sizeTypeData[sizeCategory as keyof typeof sizeTypeData] || [];
    } else if (
      watchedSizeType === "pants" ||
      watchedSizeType === "shoes" ||
      watchedSizeType === "underwear" ||
      watchedSizeType === "shirts" ||
      watchedSizeType === "tshirts"
    ) {
      // Convert backend gender values to frontend gender values
      const frontendGender =
        watchedGender === "MALE"
          ? "men"
          : watchedGender === "FEMALE"
          ? "women"
          : "unisex";
      const genderData =
        sizeTypeData[frontendGender as keyof typeof sizeTypeData];
      if (genderData) {
        return genderData[sizeCategory as keyof typeof genderData] || [];
      }
    }

    return [];
  }, [watchedSizeType, watchedGender, sizeCategory]);

  // Update the size category select content
  <SelectContent>
    {watchedSizeType &&
      watchedGender &&
      (() => {
        try {
          const sizeTypeData =
            globalSizes[watchedSizeType as keyof typeof globalSizes];
          if (!sizeTypeData) return null;

          let categories: string[] = [];

          if (watchedSizeType === "belts" || watchedSizeType === "jersey") {
            // For belts and jersey, categories are direct keys
            categories = Object.keys(sizeTypeData);
          } else if (
            watchedSizeType === "pants" ||
            watchedSizeType === "shoes" ||
            watchedSizeType === "underwear" ||
            watchedSizeType === "shirts" ||
            watchedSizeType === "tshirts"
          ) {
            // Convert backend gender values to frontend gender values
            const frontendGender =
              watchedGender === "MALE"
                ? "men"
                : watchedGender === "FEMALE"
                ? "women"
                : "unisex";
            const genderData =
              sizeTypeData[frontendGender as keyof typeof sizeTypeData];
            if (genderData) {
              categories = Object.keys(genderData);
            }
          }

          return categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ));
        } catch (error) {
          console.error("Error getting size categories:", error);
          return null;
        }
      })()}
  </SelectContent>;

  // Update the handler functions to use proper typing
  const handleSizeTypeChange = (value: string) => {
    if (isValidSizeType(value)) {
      form.setValue("size_type", value);
      setSizeCategory(""); // Reset size category when size type changes
    }
  };

  const handleGenderChange = (value: string) => {
    if (isValidGender(value)) {
      form.setValue("gender", value);
      setSizeCategory(""); // Reset size category when gender changes
    }
  };

  const validateSizeCategory = (
    sizeType: string,
    gender: string,
    category: string
  ) => {
    const sizeTypeData = globalSizes[sizeType as keyof typeof globalSizes];
    if (!sizeTypeData) return false;

    if (sizeType === "belts" || sizeType === "jersey") {
      return category in sizeTypeData;
    } else if (
      ["pants", "shoes", "underwear", "shirts", "tshirts"].includes(sizeType)
    ) {
      const genderKey =
        gender === "MALE" ? "men" : gender === "FEMALE" ? "women" : "unisex";
      return (
        category in (sizeTypeData[genderKey as keyof typeof sizeTypeData] || {})
      );
    }
    return false;
  };

  const handleSizeCategoryChange = (value: string) => {
    const sizeType = form.getValues("size_type");
    const gender = form.getValues("gender");

    if (!sizeType || !gender) {
      toast({
        title: "Selection Required",
        description: "Please select both size type and gender first",
        variant: "destructive",
      });
      return;
    }

    if (!validateSizeCategory(sizeType, gender, value)) {
      toast({
        title: "Invalid Selection",
        description:
          "This size category is not valid for the selected type and gender",
        variant: "destructive",
      });
      return;
    }

    setSizeCategory(value);
  };

  const addSizeVariant = () => {
    const newVariant: SizeVariant = {
      id: Math.random().toString(36).substr(2, 9),
      size: "",
      colors: [],
    };
    setVariants([...variants, newVariant]);
  };

  const addColorVariant = (sizeId: string) => {
    setVariants(
      variants.map((variant) =>
        variant.id === sizeId
          ? {
              ...variant,
              colors: [
                ...variant.colors,
                {
                  id: Math.random().toString(36).substr(2, 9),
                  color: "",
                  colorHex: "#000000",
                  stock: 0,
                },
              ],
            }
          : variant
      )
    );
  };

  const updateSizeVariant = (id: string, size: string) => {
    setVariants(
      variants.map((variant) =>
        variant.id === id ? { ...variant, size } : variant
      )
    );
  };

  const updateColorVariant = (
    sizeId: string,
    colorId: string,
    field: keyof ColorVariant,
    value: string | number
  ) => {
    setVariants(
      variants.map((variant) =>
        variant.id === sizeId
          ? {
              ...variant,
              colors: variant.colors.map((color) =>
                color.id === colorId ? { ...color, [field]: value } : color
              ),
            }
          : variant
      )
    );
  };

  const removeSizeVariant = (id: string) => {
    setVariants(variants.filter((variant) => variant.id !== id));
  };

  const removeColorVariant = (sizeId: string, colorId: string) => {
    setVariants(
      variants.map((variant) =>
        variant.id === sizeId
          ? {
              ...variant,
              colors: variant.colors.filter((color) => color.id !== colorId),
            }
          : variant
      )
    );
  };

  const getAvailableSizesForVariant = (currentVariantId: string): string[] => {
    return availableSizes.filter(
      (size: string) =>
        !variants.some(
          (variant) => variant.id !== currentVariantId && variant.size === size
        )
    );
  };

  // Submit handler
  const onSubmit = async (data: ProductFormValues) => {
    try {
      if (!sizeCategory) {
        toast({
          title: "Size Category Required",
          description: "Please select a size category",
          variant: "destructive",
        });
        return;
      }

      if (variants.length === 0) {
        toast({
          title: "Variants Required",
          description: "Please add at least one size variant",
          variant: "destructive",
        });
        return;
      }

      // Validate that each variant has at least one color
      const invalidVariants = variants.filter((v) => v.colors.length === 0);
      if (invalidVariants.length > 0) {
        toast({
          title: "Color Required",
          description: `Please add at least one color for size ${invalidVariants[0].size}`,
          variant: "destructive",
        });
        return;
      }

      // Prepare the product data with proper typing
      const productData = {
        name: data.name,
        description: data.description || "",
        category: parseInt(data.category),
        supplier: data.supplier ? parseInt(data.supplier) : undefined,
        cost_price: parseFloat(data.cost_price),
        selling_price: parseFloat(data.selling_price),
        minimum_stock: data.minimum_stock,
        is_active: data.status === "active",
        size_type: data.size_type,
        size_category: sizeCategory as SizeCategoryType,
        gender: data.gender,
        variations: variants.flatMap((sizeVariant) =>
          sizeVariant.colors.map((colorVariant) => ({
            size: sizeVariant.size,
            color: colorVariant.color,
            color_hax: colorVariant.colorHex,
            stock: colorVariant.stock,
          }))
        ),
      };

      // Update the product with proper typing
      await updateProduct.mutateAsync({
        id: productId,
        ...productData,
      });

      toast({
        title: "Product Updated",
        description: "The product has been updated successfully",
      });

      router.push("/inventory/products");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoadingProduct || isLoadingCategories || isLoadingSuppliers) {
    return <ProductFormSkeleton />;
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <ShoppingCart className="h-16 w-16 text-muted-foreground opacity-30" />
        <p className="text-xl font-medium text-muted-foreground">
          Product not found
        </p>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
          <p className="text-muted-foreground">
            Update product information and inventory
          </p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Enter the basic details of the product
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter product description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={product.category?.id.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category">
                              {product.category?.name}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id.toString()}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="supplier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supplier</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={product.supplier?.id.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a supplier">
                              {product.supplier?.company_name}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {suppliers.map((supplier) => (
                            <SelectItem
                              key={supplier.id}
                              value={supplier.id.toString()}
                            >
                              {supplier.company_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing and Stock Card */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing and Stock</CardTitle>
              <CardDescription>
                Set the product pricing and stock levels
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="cost_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Enter cost price"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="selling_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selling Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Enter selling price"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="minimum_stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Stock Level</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter minimum stock level"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="discontinued">
                            Discontinued
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Size and Variations Card */}
          <Card>
            <CardHeader>
              <CardTitle>Size and Variations</CardTitle>
              <CardDescription>
                Configure product sizes and variations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="size_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size Type</FormLabel>
                      <Select
                        onValueChange={handleSizeTypeChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select size type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pants">Pants</SelectItem>
                          <SelectItem value="shoes">Shoes</SelectItem>
                          <SelectItem value="belts">Belts</SelectItem>
                          <SelectItem value="underwear">Underwear</SelectItem>
                          <SelectItem value="jersey">Jersey</SelectItem>
                          <SelectItem value="shirts">Shirts</SelectItem>
                          <SelectItem value="tshirts">T-Shirts</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={handleGenderChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                          <SelectItem value="UNISEX">Unisex</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel>Size Category</FormLabel>
                  <Select
                    value={sizeCategory}
                    onValueChange={handleSizeCategoryChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select size category" />
                    </SelectTrigger>
                    <SelectContent>
                      {watchedSizeType &&
                        watchedGender &&
                        (() => {
                          try {
                            const sizeTypeData =
                              globalSizes[watchedSizeType as SizeType];
                            if (!sizeTypeData) return null;

                            let categories: string[] = [];

                            if (
                              watchedSizeType === "belts" ||
                              watchedSizeType === "jersey"
                            ) {
                              // For belts and jersey, categories are direct keys
                              categories = Object.keys(sizeTypeData);
                            } else if (
                              watchedSizeType === "pants" ||
                              watchedSizeType === "shoes" ||
                              watchedSizeType === "underwear" ||
                              watchedSizeType === "shirts" ||
                              watchedSizeType === "tshirts"
                            ) {
                              // Convert backend gender values to frontend gender values
                              const frontendGender =
                                watchedGender === "MALE"
                                  ? "men"
                                  : watchedGender === "FEMALE"
                                  ? "women"
                                  : "unisex";
                              const genderData =
                                sizeTypeData[
                                  frontendGender as keyof typeof sizeTypeData
                                ];
                              if (genderData) {
                                categories = Object.keys(genderData);
                              }
                            }

                            return categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ));
                          } catch (error) {
                            console.error(
                              "Error getting size categories:",
                              error
                            );
                            return null;
                          }
                        })()}
                    </SelectContent>
                  </Select>
                </FormItem>
              </div>

              {/* Size Variants */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Size Variants</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addSizeVariant}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Size
                  </Button>
                </div>

                {variants.map((variant) => (
                  <Card key={variant.id} className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <FormItem className="flex-1">
                          <FormLabel>Size</FormLabel>
                          <Select
                            value={variant.size}
                            onValueChange={(value) =>
                              updateSizeVariant(variant.id, value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                            <SelectContent>
                              {getAvailableSizesForVariant(variant.id).map(
                                (size) => (
                                  <SelectItem key={size} value={size}>
                                    {size}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        </FormItem>

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addColorVariant(variant.id)}
                          className="mt-8"
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add Color
                        </Button>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSizeVariant(variant.id)}
                          className="mt-8 text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Color Variants */}
                      <div className="space-y-4 pl-4">
                        {variant.colors.map((color) => (
                          <div
                            key={color.id}
                            className="flex items-center gap-4"
                          >
                            <FormItem className="flex-1">
                              <FormLabel>Color</FormLabel>
                              <Select
                                value={color.color}
                                onValueChange={(value) =>
                                  updateColorVariant(
                                    variant.id,
                                    color.id,
                                    "color",
                                    value
                                  )
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select color" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(COLORS).map(([name, hex]) => (
                                    <SelectItem key={name} value={name}>
                                      <div className="flex items-center gap-2">
                                        <div
                                          className="w-4 h-4 rounded-full border"
                                          style={{
                                            backgroundColor: hex,
                                          }}
                                        />
                                        {name}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>

                            <FormItem className="w-32">
                              <FormLabel>Stock</FormLabel>
                              <Input
                                type="number"
                                min="0"
                                value={color.stock}
                                onChange={(e) =>
                                  updateColorVariant(
                                    variant.id,
                                    color.id,
                                    "stock",
                                    parseInt(e.target.value)
                                  )
                                }
                              />
                            </FormItem>

                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                removeColorVariant(variant.id, color.id)
                              }
                              className="mt-8 text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" className="w-full md:w-auto">
              Update Product
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

function ProductFormSkeleton() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </div>
        <Skeleton className="h-10 w-[100px]" />
      </div>

      <div className="space-y-8">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-[200px]" />
              <Skeleton className="h-4 w-[300px]" />
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="space-y-2">
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
