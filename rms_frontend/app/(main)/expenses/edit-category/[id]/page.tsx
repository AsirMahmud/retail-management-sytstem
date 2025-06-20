"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCategories, useUpdateCategory } from "@/hooks/queries/use-expenses";
import { toast } from "@/hooks/use-toast";

export default function EditExpenseCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { data: categories } = useCategories();
  const updateCategory = useUpdateCategory();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#8884d8",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (categories) {
      const category = categories.find((cat) => String(cat.id) === params.id);
      if (category) {
        setFormData({
          name: category.name,
          description: category.description,
          color: category.color,
        });
      }
      setLoading(false);
    }
  }, [categories, params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateCategory.mutate(
      {
        id: Number(params.id),
        ...formData,
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

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Edit Expense Category</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name">Category Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
          />
        </div>
        <div>
          <Label htmlFor="color">Color</Label>
          <Input
            id="color"
            type="color"
            value={formData.color}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, color: e.target.value }))
            }
            className="w-16 h-10 p-0 border-none"
          />
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
