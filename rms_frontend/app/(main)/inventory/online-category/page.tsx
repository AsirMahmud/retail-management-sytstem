"use client";

import { useMemo, useState } from "react";
import {
  useOnlineCategories,
  useCreateOnlineCategory,
  useUpdateOnlineCategory,
  useDeleteOnlineCategory,
} from "@/hooks/queries/useInventory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { Category } from "@/types/inventory";
import { PlusCircle, Tag, Edit3, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

export default function OnlineCategoriesPage() {
  const { data: categories = [], isLoading } = useOnlineCategories();
  const createCategory = useCreateOnlineCategory();
  const updateCategory = useUpdateOnlineCategory();
  const deleteCategory = useDeleteOnlineCategory();

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newParentId, setNewParentId] = useState<string>("none");

  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editParentId, setEditParentId] = useState<string>("none");

  const filteredCategories = useMemo(() => {
    return categories.filter((c: Category) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  const parentsOnly = useMemo(() => {
    return categories.filter((c: Category) => !c.parent);
  }, [categories]);

  const resetNewForm = () => {
    setNewName("");
    setNewDescription("");
    setNewParentId("none");
  };

  const handleCreate = async () => {
    if (!newName.trim()) {
      toast.error("Name is required");
      return;
    }
    try {
      await createCategory.mutateAsync({
        name: newName.trim(),
        description: newDescription.trim() || undefined,
        parent: newParentId && newParentId !== "none" ? Number(newParentId) : undefined,
      } as any);
      toast.success("Online category created");
      setIsAddDialogOpen(false);
      resetNewForm();
    } catch (e: any) {
      // Extract error message from API response
      let errorMessage = "Failed to create online category";
      
      if (e?.response?.data) {
        const errorData = e.response.data;
        // Check for duplicate name error
        if (errorData.name && Array.isArray(errorData.name)) {
          errorMessage = errorData.name[0] || "A category with this name already exists";
        } else if (errorData.name) {
          errorMessage = errorData.name;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
      } else if (e?.message) {
        errorMessage = e.message;
      }
      
      toast.error(errorMessage);
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  const openEdit = (cat: Category) => {
    setEditCategory(cat);
    setEditName(cat.name || "");
    setEditDescription(cat.description || "");
    setEditParentId(cat.parent ? String(cat.parent) : "none");
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editCategory) return;
    if (!editName.trim()) {
      toast.error("Name is required");
      return;
    }
    try {
      await updateCategory.mutateAsync({
        id: editCategory.id,
        name: editName.trim(),
        description: editDescription.trim() || undefined,
        parent: editParentId && editParentId !== "none" ? Number(editParentId) : undefined,
      } as any);
      toast.success("Online category updated");
      setIsEditDialogOpen(false);
      setEditCategory(null);
    } catch (e: any) {
      // Extract error message from API response
      let errorMessage = "Failed to update online category";
      
      if (e?.response?.data) {
        const errorData = e.response.data;
        // Check for duplicate name error
        if (errorData.name && Array.isArray(errorData.name)) {
          errorMessage = errorData.name[0] || "A category with this name already exists";
        } else if (errorData.name) {
          errorMessage = errorData.name;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
      } else if (e?.message) {
        errorMessage = e.message;
      }
      
      toast.error(errorMessage);
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCategory.mutateAsync(categoryToDelete.id);
      toast.success("Online category deleted");
    } catch (e) {
      toast.error("Failed to delete online category");
      // eslint-disable-next-line no-console
      console.error(e);
    } finally {
      setCategoryToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-96" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          <Skeleton className="h-10 w-80" />
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Tag className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Online Categories
                </h1>
                <p className="text-gray-600 mt-1">
                  Create and manage online categories and subcategories
                </p>
              </div>
            </div>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Online Category
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search online categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-white/70 backdrop-blur-sm border-white/20 shadow-lg"
            />
          </div>
        </div>

        <Card className="border-0 bg-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl">All Online Categories</CardTitle>
            <CardDescription>Hierarchy supported (parent → subcategory)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Parent</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((cat: Category) => (
                    <TableRow key={cat.id}>
                      <TableCell className="font-medium">{cat.name}</TableCell>
                      <TableCell>{cat.slug}</TableCell>
                      <TableCell>{cat.parent ? categories.find((c: Category) => c.id === cat.parent)?.name : "—"}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" onClick={() => openEdit(cat)}>
                          <Edit3 className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => setCategoryToDelete(cat)}>
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Create Dialog */}
        <Dialog 
          open={isAddDialogOpen} 
          onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) {
              resetNewForm();
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Online Category</DialogTitle>
              <DialogDescription>Optionally select a parent to create a subcategory.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Name</label>
                <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g., Pant" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <Textarea value={newDescription} onChange={(e) => setNewDescription(e.target.value)} rows={3} placeholder="Optional details" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Parent (optional)</label>
                <Select value={newParentId} onValueChange={setNewParentId}>
                  <SelectTrigger>
                    <SelectValue placeholder="No parent (root category)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No parent (root category)</SelectItem>
                    {categories.map((c: Category) => (
                      <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreate} disabled={createCategory.isPending}>Create</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog 
          open={isEditDialogOpen} 
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) {
              setEditCategory(null);
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Online Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Name</label>
                <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <Textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows={3} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Parent (optional)</label>
                <Select value={editParentId} onValueChange={setEditParentId}>
                  <SelectTrigger>
                    <SelectValue placeholder="No parent (root category)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No parent (root category)</SelectItem>
                    {categories
                      .filter((c: Category) => c.id !== editCategory?.id)
                      .map((c: Category) => (
                        <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleUpdate} disabled={updateCategory.isPending}>Save</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={!!categoryToDelete} onOpenChange={() => setCategoryToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete online category?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone and will permanently remove the selected online category.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}



