"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCategories, useUpdateCategory } from "@/hooks/queries/use-expenses";
import { toast } from "@/hooks/use-toast";

// 1️⃣ Zod Schema
const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  color: z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, "Invalid color"),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function EditExpenseCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { data: categories } = useCategories();
  const updateCategory = useUpdateCategory();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      color: "#8884d8",
    },
  });

  // 2️⃣ Load category data
  useEffect(() => {
    if (categories) {
      const category = categories.find((cat) => String(cat.id) === params.id);
      if (category) {
        setValue("name", category.name);
        setValue("description", category.description || "");
        setValue("color", category.color);
      }
    }
  }, [categories, params.id, setValue]);

  // 3️⃣ Submit handler
  const onSubmit = (data: CategoryFormData) => {
    updateCategory.mutate(
      {
        id: Number(params.id),
        ...data,
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Category updated successfully",
          });
          router.push("/expenses?page=categories");
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: error?.message || "Failed to update category",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Edit Expense Category</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="name">Category Name</Label>
          <Input id="name" {...register("name")} />
          {errors.name && (
            <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Input id="description" {...register("description")} />
        </div>
        <div>
          <Label htmlFor="color">Color</Label>
          <Input
            id="color"
            type="color"
            {...register("color")}
            className="w-16 h-10 p-0 border-none"
          />
          {errors.color && (
            <p className="text-sm text-red-600 mt-1">{errors.color.message}</p>
          )}
        </div>
        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={updateCategory.isPending}>
            {updateCategory.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}