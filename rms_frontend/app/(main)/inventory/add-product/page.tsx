"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
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
import { PlusCircle, Trash2, ShoppingCart } from "lucide-react";
import {
  useCreateProduct,
  useCategories,
  useSuppliers,
} from "@/hooks/queries/useInventory";
import type { CreateProductDTO } from "@/types/inventory";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { HydrationWrapper } from "@/components/hydration-wrapper";
import { globalSizes, COLORS } from "./constants";

// Define the form schema using Zod
const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  category: z.string({ required_error: "Please select a category" }),
  supplier: z.string({ required_error: "Please select a supplier" }).optional(),
  cost_price: z.string().min(1, "Cost price is required"),
  selling_price: z.string().min(1, "Selling price is required"),
  status: z.enum(["active", "inactive", "discontinued"]),
  minimum_stock: z.number().default(10),
  size_type: z.string({ required_error: "Please select a size type" }),
  gender: z.string({ required_error: "Please select a gender" }),
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

// Define types for our variants
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

export default function AddProductPage() {
  const router = useRouter();
  const createProduct = useCreateProduct();
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

  // Get available sizes based on size type, gender, and size category
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

  // Get available size categories based on size type and gender
  const availableSizeCategories = useMemo(() => {
    if (!watchedSizeType) return [];

    const sizeTypeData =
      globalSizes[watchedSizeType as keyof typeof globalSizes];
    if (!sizeTypeData) return [];

    if (watchedSizeType === "belts" || watchedSizeType === "jersey") {
      return Object.keys(sizeTypeData);
    } else if (
      (watchedSizeType === "pants" ||
        watchedSizeType === "shoes" ||
        watchedSizeType === "underwear" ||
        watchedSizeType === "shirts" ||
        watchedSizeType === "tshirts") &&
      watchedGender
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
      return genderData ? Object.keys(genderData) : [];
    }

    return [];
  }, [watchedSizeType, watchedGender]);

  // Reset variants when size type or gender changes
  const handleSizeTypeChange = (value: string) => {
    form.setValue("size_type", value);
    setVariants([]);
    setSizeCategory("");
  };

  const handleGenderChange = (value: string) => {
    form.setValue("gender", value);
    setVariants([]);
    setSizeCategory("");
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

    if (!validateSizeCategory(sizeType, gender, value)) {
      toast({
        title: "Invalid Size Category",
        description:
          "Please select a valid size category for the chosen product type and gender",
        variant: "destructive",
      });
      return;
    }

    setSizeCategory(value);
    // Clear existing variants when size category changes
    setVariants([]);
  };

  // Function to add a new size variant
  const addSizeVariant = () => {
    if (!sizeCategory) {
      toast({
        title: "Size Category Required",
        description: "Please select a size category first",
        variant: "destructive",
      });
      return;
    }

    const existingSizes = variants.map((v) => v.size);
    const availableSizes = getAvailableSizesForVariant("");
    const unusedSizes = availableSizes.filter(
      (size) => !existingSizes.includes(size)
    );

    if (unusedSizes.length === 0) {
      toast({
        title: "No Available Sizes",
        description: "All sizes for this category have been added",
        variant: "destructive",
      });
      return;
    }

    const newVariant: SizeVariant = {
      id: crypto.randomUUID(),
      size: unusedSizes[0],
      colors: [],
    };

    setVariants([...variants, newVariant]);
  };

  // Function to add a new color to a size variant
  const addColorVariant = (sizeId: string) => {
    setVariants(
      variants.map((variant) => {
        if (variant.id === sizeId) {
          return {
            ...variant,
            colors: [
              ...variant.colors,
              {
                id: Date.now().toString() + "-color",
                color: "Black",
                colorHex: "#000000",
                stock: 0,
              },
            ],
          };
        }
        return variant;
      })
    );
  };

  // Function to update a size variant
  const updateSizeVariant = (id: string, size: string) => {
    setVariants(
      variants.map((variant) =>
        variant.id === id ? { ...variant, size } : variant
      )
    );
  };

  // Function to update a color variant
  const updateColorVariant = (
    sizeId: string,
    colorId: string,
    field: keyof ColorVariant,
    value: string | number
  ) => {
    setVariants(
      variants.map((variant) => {
        if (variant.id === sizeId) {
          return {
            ...variant,
            colors: variant.colors.map((color) => {
              if (color.id === colorId) {
                // If updating color name, also update the hex
                if (field === "color" && typeof value === "string") {
                  return {
                    ...color,
                    [field]: value,
                    colorHex:
                      COLORS[value as keyof typeof COLORS] || color.colorHex,
                  };
                }
                return { ...color, [field]: value };
              }
              return color;
            }),
          };
        }
        return variant;
      })
    );
  };

  // Function to remove a size variant
  const removeSizeVariant = (id: string) => {
    setVariants(variants.filter((variant) => variant.id !== id));
  };

  // Function to remove a color variant
  const removeColorVariant = (sizeId: string, colorId: string) => {
    setVariants(
      variants.map((variant) => {
        if (variant.id === sizeId) {
          return {
            ...variant,
            colors: variant.colors.filter((color) => color.id !== colorId),
          };
        }
        return variant;
      })
    );
  };

  // Function to get available sizes for a specific variant
  const getAvailableSizesForVariant = (currentVariantId: string) => {
    const usedSizes = variants
      .filter((v) => v.id !== currentVariantId)
      .map((v) => v.size);
    return availableSizes.filter((size) => !usedSizes.includes(size));
  };

  // Function to handle form submission
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

      // Prepare the product data
      const productData: CreateProductDTO = {
        name: data.name,
        description: data.description || "",
        category: parseInt(data.category),
        supplier: data.supplier ? parseInt(data.supplier) : undefined,
        cost_price: parseFloat(data.cost_price),
        selling_price: parseFloat(data.selling_price),
        minimum_stock: data.minimum_stock,
        is_active: data.status === "active",
        size_type: data.size_type,
        size_category: sizeCategory, // Add size category explicitly
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

      // Create the product
      await createProduct.mutateAsync(productData);

      toast({
        title: "Success",
        description: "Product created successfully",
      });

      // Redirect to products page
      router.push("/inventory/products");
    } catch (error) {
      console.error("Error creating product:", error);
      toast({
        title: "Error",
        description: "Failed to create product. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Add New Product
              </h1>
              <p className="text-gray-600 mt-1">
                Add a new product to your inventory with variants and stock
                information
              </p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg hover:bg-white/90"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createProduct.isPending}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg"
              >
                {createProduct.isPending ? "Creating..." : "Save Product"}
              </Button>
            </div>

            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Product Information
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Enter the basic details of your product
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">
                          Product Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Classic Oxford Shirt"
                            {...field}
                            className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-colors"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter product description"
                          rows={3}
                          {...field}
                          className="border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-colors"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">
                          Category
                        </FormLabel>
                        <FormControl>
                          {isLoadingCategories ? (
                            <Skeleton className="h-12 w-full rounded-xl" />
                          ) : (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-colors">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((cat) => (
                                  <SelectItem
                                    key={cat.id}
                                    value={cat.id.toString()}
                                  >
                                    {cat.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="supplier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">
                          Supplier
                        </FormLabel>
                        <FormControl>
                          {isLoadingSuppliers ? (
                            <Skeleton className="h-12 w-full rounded-xl" />
                          ) : (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-colors">
                                <SelectValue placeholder="Select supplier" />
                              </SelectTrigger>
                              <SelectContent>
                                {suppliers.map((sup) => (
                                  <SelectItem
                                    key={sup.id}
                                    value={sup.id.toString()}
                                  >
                                    {sup.company_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Size Type and Gender */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="size_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">
                          Size Type
                        </FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={handleSizeTypeChange}
                          >
                            <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-colors">
                              <SelectValue placeholder="Select size type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pants">Pants</SelectItem>
                              <SelectItem value="shoes">Shoes</SelectItem>
                              <SelectItem value="belts">Belts</SelectItem>
                              <SelectItem value="underwear">
                                Underwear
                              </SelectItem>
                              <SelectItem value="jersey">Jersey</SelectItem>
                              <SelectItem value="shirts">Shirts</SelectItem>
                              <SelectItem value="tshirts">T-Shirts</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Gender</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={handleGenderChange}
                            disabled={
                              watchedSizeType === "belts" ||
                              watchedSizeType === "jersey"
                            }
                          >
                            <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-colors">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="MALE">Men</SelectItem>
                              <SelectItem value="FEMALE">Women</SelectItem>
                              <SelectItem value="UNISEX">Unisex</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Size Category Selection */}
                {availableSizeCategories.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Size Category
                      </label>
                      <Select
                        value={sizeCategory}
                        onValueChange={handleSizeCategoryChange}
                      >
                        <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-colors">
                          <SelectValue placeholder="Select size category" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableSizeCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category.toUpperCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="cost_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">
                          Cost Price
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-colors"
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
                        <FormLabel className="text-gray-700">
                          Selling Price
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-colors"
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
                        <FormLabel className="text-gray-700">Status</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-colors">
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
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Size and Color Options */}
            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold text-gray-900">
                      Size & Color Options
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Add size variants and their color options
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addSizeVariant}
                    disabled={!sizeCategory || availableSizes.length === 0}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Size
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {variants.map((variant) => (
                    <div
                      key={variant.id}
                      className="border border-gray-200 rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm"
                    >
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Select
                            value={variant.size}
                            onValueChange={(value) =>
                              updateSizeVariant(variant.id, value)
                            }
                          >
                            <SelectTrigger className="w-24 h-10 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-colors">
                              <SelectValue />
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
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addColorVariant(variant.id)}
                            className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg hover:bg-white/90"
                          >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add Color
                          </Button>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSizeVariant(variant.id)}
                          className="hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                      <div className="p-4">
                        <table className="w-full">
                          <thead>
                            <tr className="text-sm text-gray-600">
                              <th className="text-left font-medium">Color</th>
                              <th className="text-left font-medium">Stock</th>
                              <th className="w-10"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {variant.colors.map((color) => (
                              <tr
                                key={color.id}
                                className="hover:bg-gray-50/50"
                              >
                                <td className="py-3">
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="w-6 h-6 rounded-full border border-gray-200 shadow-sm"
                                      style={{
                                        backgroundColor: color.colorHex,
                                      }}
                                    />
                                    <div className="flex-1 space-y-2">
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
                                        <SelectTrigger className="w-32 h-10 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-colors">
                                          <SelectValue placeholder="Select color" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {Object.entries(COLORS).map(
                                            ([name, hex]) => (
                                              <SelectItem
                                                key={name}
                                                value={name}
                                              >
                                                <div className="flex items-center gap-2">
                                                  <div
                                                    className="w-4 h-4 rounded-full border border-gray-200"
                                                    style={{
                                                      backgroundColor: hex,
                                                    }}
                                                  />
                                                  <span>{name}</span>
                                                </div>
                                              </SelectItem>
                                            )
                                          )}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3">
                                  <Input
                                    type="number"
                                    value={color.stock}
                                    onChange={(e) =>
                                      updateColorVariant(
                                        variant.id,
                                        color.id,
                                        "stock",
                                        parseInt(e.target.value) || 0
                                      )
                                    }
                                    className="w-24 h-10 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-colors"
                                  />
                                </td>
                                <td className="py-3 text-center">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      removeColorVariant(variant.id, color.id)
                                    }
                                    className="hover:bg-red-50"
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
                  ))}
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}
