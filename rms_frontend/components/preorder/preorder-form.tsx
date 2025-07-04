"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { useProducts } from "@/hooks/queries/useInventory";
import { toast } from "sonner";
import {
  useCreatePreorder,
  useUpdatePreorder,
} from "@/hooks/queries/use-preorder";
import {
  PreorderProduct,
  PreorderVariation,
  CreatePreorderDTO,
  Preorder,
} from "@/types/preorder";
import { ShoppingCart } from "lucide-react";

const formSchema = z.object({
  customer_name: z.string().min(1, "Customer name is required"),
  customer_phone: z.string().min(1, "Customer phone is required"),
  customer_email: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
  preorder_product_id: z.string().min(1, "Product is required"),
  deposit_paid: z.string().optional(),
  notes: z.string().optional(),
  expected_delivery_date: z.string().optional(),
});

export function PreorderForm({
  preorder,
  onSuccess,
}: {
  preorder?: Preorder;
  onSuccess?: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createPreorder = useCreatePreorder();
  const updatePreorder = useUpdatePreorder();
  const { data: products, isLoading } = useProducts();
  const [amountError, setAmountError] = useState("");
  const [selectedVariants, setSelectedVariants] = useState<number[]>(
    preorder && preorder.items
      ? preorder.items
          .map((item) => item.variant_id ?? -1)
          .filter((id) => id !== -1)
      : []
  );
  const [selectAllVariants, setSelectAllVariants] = useState(false);
  const [variantQuantities, setVariantQuantities] = useState<{
    [variantId: number]: number;
  }>(
    preorder && preorder.items
      ? Object.fromEntries(
          preorder.items
            .map((item) => [item.variant_id ?? -1, item.quantity])
            .filter(([id]) => id !== -1)
        )
      : {}
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: preorder
      ? {
          customer_name: preorder.customer_name,
          customer_phone: preorder.customer_phone,
          customer_email: preorder.customer_email,
          preorder_product_id:
            preorder.items?.[0]?.product_id?.toString() || "",
          deposit_paid: preorder.deposit_paid?.toString() || "",
          notes: preorder.notes || "",
          expected_delivery_date: preorder.expected_delivery_date || "",
        }
      : {
          customer_name: "",
          customer_phone: "",
          customer_email: "",
          preorder_product_id: "",
          deposit_paid: "",
          notes: "",
          expected_delivery_date: "",
        },
  });

  const selectedProductId = form.watch("preorder_product_id");

  // Get the selected product details
  const currentProduct = products?.find(
    (p: any) => p.id.toString() === selectedProductId
  );
  const productVariants =
    currentProduct?.variations?.filter((v: any) => v.is_active) || [];

  // Calculate total amount based on selected variants and their quantities
  const totalAmount = currentProduct
    ? (selectAllVariants
        ? productVariants
        : productVariants.filter((v: any) => selectedVariants.includes(v.id))
      ).reduce((sum: number, variant: any) => {
        const qty = variantQuantities[variant.id] || 0;
        return sum + currentProduct.selling_price * qty;
      }, 0)
    : 0;
  const depositAmount = parseFloat(form.watch("deposit_paid") || "0");
  const remainingAmount = totalAmount - depositAmount;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setAmountError("");
    // Variant selection validation
    if (
      !selectAllVariants &&
      selectedVariants.length === 0 &&
      productVariants.length > 0
    ) {
      setAmountError(
        "Please select at least one variant or select all variants."
      );
      setIsSubmitting(false);
      return;
    }
    // Check per-variant stock and quantity
    let hasError = false;
    let checkedVariants = selectAllVariants
      ? productVariants
      : productVariants.filter((v: any) => selectedVariants.includes(v.id));
    checkedVariants.forEach((variant: any) => {
      const qty = variantQuantities[variant.id] || 0;
      if (qty < 1) {
        setAmountError(
          `Please enter quantity for variant ${variant.size} / ${variant.color}`
        );
        hasError = true;
      } else if (qty > variant.stock_quantity) {
        setAmountError(
          `Cannot order more than available stock (${variant.stock_quantity}) for variant ${variant.size} / ${variant.color}`
        );
        hasError = true;
      }
    });
    if (hasError) {
      setIsSubmitting(false);
      return;
    }
    try {
      const deposit = values.deposit_paid ? parseFloat(values.deposit_paid) : 0;
      const total = totalAmount;
      // Check for max 10 digits (including decimals)
      const depositStr = deposit.toFixed(2).replace(/^0+/, "");
      const totalStr = total.toFixed(2).replace(/^0+/, "");
      if (
        depositStr.replace(".", "").length > 10 ||
        totalStr.replace(".", "").length > 10
      ) {
        setAmountError(
          "Amount fields must not exceed 10 digits in total (including decimals)"
        );
        setIsSubmitting(false);
        return;
      }
      // Build items array for preorder
      let variantIds: number[] = [];
      if (selectAllVariants) {
        variantIds = productVariants.map((v: any) => v.id);
      } else {
        variantIds = selectedVariants;
      }
      if (!currentProduct) {
        setAmountError("No product selected.");
        setIsSubmitting(false);
        return;
      }
      const items = variantIds
        .map((variantId) => {
          const variant = productVariants.find((v: any) => v.id === variantId);
          if (!variant) return null;
          const qty = variant.stock;
          if (qty < 1) return null;
          return {
            product_id: currentProduct.id,
            size: variant.size,
            color: variant.color,
            quantity: qty,
            unit_price: currentProduct.selling_price,
            discount: 0,
          };
        })
        .filter(Boolean);
      if (items.length === 0) {
        setAmountError("No valid variants selected.");
        setIsSubmitting(false);
        return;
      }
      const preorderData: any = {
        customer_name: values.customer_name,
        customer_phone: values.customer_phone,
        customer_email: values.customer_email || undefined,
        preorder_product: parseInt(values.preorder_product_id),
        deposit_paid: deposit,
        total_amount: total,
        notes: values.notes || undefined,
        expected_delivery_date: values.expected_delivery_date || undefined,
        items,
      };
      if (preorder) {
        await updatePreorder.mutateAsync({
          id: preorder.id,
          data: preorderData,
        });
        toast.success("Preorder updated successfully!");
      } else {
        await createPreorder.mutateAsync(preorderData);
        toast.success("Preorder created successfully!");
      }
      if (onSuccess) onSuccess();
      form.reset();
      setSelectedVariants([]);
      setSelectAllVariants(false);
      setVariantQuantities({});
    } catch (error) {
      console.error("Error creating preorder:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

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
        <CardTitle>Create New Preorder</CardTitle>
        <CardDescription>Create a preorder for a customer</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="customer_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter customer name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customer_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="customer_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter email address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Product Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Product Selection</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="preorder_product_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a product" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {products?.map((product: any) => (
                            <SelectItem
                              key={product.id}
                              value={product.id.toString()}
                            >
                              {product.name} - ${product.selling_price}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Financial Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Financial Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Amount
                  </p>
                  <p className="text-2xl font-bold">
                    ${totalAmount.toFixed(2)}
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="deposit_paid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deposit Paid</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground">
                    Remaining Balance
                  </p>
                  <p className="text-2xl font-bold">
                    ${remainingAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="expected_delivery_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected Delivery Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add any additional notes..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Variant selection UI */}
            {productVariants.length > 0 && (
              <div className="mb-4">
                <label className="font-medium text-sm mb-1 block">
                  Select Variants
                </label>
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="selectAllVariants"
                    checked={selectAllVariants}
                    onChange={(e) => {
                      setSelectAllVariants(e.target.checked);
                      setSelectedVariants(
                        e.target.checked
                          ? productVariants.map((v: any) => v.id)
                          : []
                      );
                      if (e.target.checked) {
                        // Set default quantity 1 for all variants
                        const newQuantities: { [variantId: number]: number } =
                          {};
                        productVariants.forEach((v: any) => {
                          newQuantities[v.id] = 1;
                        });
                        setVariantQuantities(newQuantities);
                      } else {
                        setVariantQuantities({});
                      }
                    }}
                    className="mr-2"
                  />
                  <label htmlFor="selectAllVariants" className="text-sm">
                    Select All Variants
                  </label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {productVariants.map((variant: any) => (
                    <label
                      key={variant.id}
                      className="flex items-center gap-1 text-xs border rounded px-2 py-1 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedVariants.includes(variant.id)}
                        disabled={variant.stock === 0}
                        onChange={(e) => {
                          let newSelected: number[];
                          let newQuantities = { ...variantQuantities };
                          if (e.target.checked) {
                            newSelected = [...selectedVariants, variant.id];
                            newQuantities[variant.id] = variant.stock; // auto-set to stock
                          } else {
                            newSelected = selectedVariants.filter(
                              (id) => id !== variant.id
                            );
                            delete newQuantities[variant.id];
                            setSelectAllVariants(false);
                          }
                          setSelectedVariants(newSelected);
                          setVariantQuantities(newQuantities);
                        }}
                      />
                      {variant.size} / {variant.color}
                      <span className="ml-2 text-gray-500">
                        Qty: {variant.stock}
                      </span>
                      <span className="ml-1 text-gray-400">
                        / {variant.stock} in stock
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Summary of selected variants */}
            {productVariants.length > 0 &&
              (selectAllVariants || selectedVariants.length > 0) && (
                <div className="mb-4 text-xs text-gray-700">
                  <div>Selected Variants:</div>
                  <ul className="list-disc ml-4">
                    {(selectAllVariants
                      ? productVariants
                      : productVariants.filter((v: any) =>
                          selectedVariants.includes(v.id)
                        )
                    ).map((variant: any) => (
                      <li key={variant.id}>
                        {variant.size} / {variant.color} - Qty: {variant.stock}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {amountError && (
              <div className="text-red-600 text-sm mb-2">{amountError}</div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating...</span>
                </div>
              ) : (
                "Create Preorder"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
