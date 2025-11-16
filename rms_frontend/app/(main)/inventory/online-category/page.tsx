"use client";

import { useMemo, useState } from "react";
import {
  useOnlineCategories,
  useCreateOnlineCategory,
  useUpdateOnlineCategory,
  useDeleteOnlineCategory,
  useUpdateOnlineCategoryOrder,
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { Category } from "@/types/inventory";
import { PlusCircle, Tag, Edit3, Trash2, Search, GripVertical, ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Sortable Category Item Component (for children)
function SortableCategoryItem({ category, onEdit, onDelete }: {
  category: Category;
  onEdit: (cat: Category) => void;
  onDelete: (cat: Category) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `child-${category.id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-gray-50 border rounded-lg p-3 mb-2 ml-8 shadow-sm hover:shadow-md transition-shadow ${
        isDragging ? "ring-2 ring-blue-500" : ""
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition-colors"
        >
          <GripVertical className="h-4 w-4" />
        </div>
        <div className="flex-1 grid grid-cols-2 gap-4 items-center">
          <div className="font-medium text-sm">{category.name}</div>
          <div className="text-xs text-gray-500">{category.slug}</div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(category)}>
            <Edit3 className="h-3 w-3 mr-1" /> Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => onDelete(category)}>
            <Trash2 className="h-3 w-3 mr-1" /> Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

// Sortable Parent Category Item with Collapsible Children
function SortableParentCategoryItem({ 
  category, 
  children, 
  categories,
  onEdit, 
  onDelete,
  expandedParents,
  onToggleExpand 
}: {
  category: Category;
  children: Category[];
  categories: Category[];
  onEdit: (cat: Category) => void;
  onDelete: (cat: Category) => void;
  expandedParents: Set<number>;
  onToggleExpand: (id: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `parent-${category.id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isExpanded = expandedParents.has(category.id);
  const hasChildren = children.length > 0;

  return (
    <div className="mb-2">
      <Collapsible open={isExpanded} onOpenChange={() => onToggleExpand(category.id)}>
        <div
          ref={setNodeRef}
          style={style}
          className={`bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow ${
            isDragging ? "ring-2 ring-blue-500" : ""
          }`}
        >
          <div className="p-4">
            <div className="flex items-center gap-4">
              <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition-colors"
              >
                <GripVertical className="h-5 w-5" />
              </div>
              {hasChildren ? (
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
              ) : (
                <div className="w-6" />
              )}
              <div className="flex-1 grid grid-cols-3 gap-4 items-center">
                <div className="font-medium">{category.name}</div>
                <div className="text-sm text-gray-500">{category.slug}</div>
                <div className="text-sm text-gray-500">
                  {hasChildren ? `${children.length} subcategor${children.length === 1 ? 'y' : 'ies'}` : "—"}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => onEdit(category)}>
                  <Edit3 className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => onDelete(category)}>
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </div>
            </div>
          </div>
          {hasChildren && (
            <CollapsibleContent className="pb-2">
              <div className="px-4">
                <div className="text-xs font-semibold text-gray-500 mb-2 ml-8">Subcategories:</div>
                <SortableContext
                  items={children.map((child) => `child-${child.id}`)}
                  strategy={verticalListSortingStrategy}
                >
                  {children.map((child: Category) => (
                    <SortableCategoryItem
                      key={child.id}
                      category={child}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  ))}
                </SortableContext>
              </div>
            </CollapsibleContent>
          )}
        </div>
      </Collapsible>
    </div>
  );
}

export default function OnlineCategoriesPage() {
  const { data: categories = [], isLoading } = useOnlineCategories();
  const createCategory = useCreateOnlineCategory();
  const updateCategory = useUpdateOnlineCategory();
  const deleteCategory = useDeleteOnlineCategory();
  const updateOrder = useUpdateOnlineCategoryOrder();

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
  const [expandedParents, setExpandedParents] = useState<Set<number>>(new Set());

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const toggleExpand = (id: number) => {
    setExpandedParents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Sort categories by order, then by name
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => {
      const orderA = a.order ?? 0;
      const orderB = b.order ?? 0;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      return a.name.localeCompare(b.name);
    });
  }, [categories]);

  // Separate parent and child categories
  const parentCategories = useMemo(() => {
    return sortedCategories.filter((c: Category) => !c.parent);
  }, [sortedCategories]);

  const childCategories = useMemo(() => {
    return sortedCategories.filter((c: Category) => !!c.parent);
  }, [sortedCategories]);

  // Group children by parent
  const childrenByParent = useMemo(() => {
    const grouped: Record<number, Category[]> = {};
    childCategories.forEach((child) => {
      if (child.parent) {
        if (!grouped[child.parent]) {
          grouped[child.parent] = [];
        }
        grouped[child.parent].push(child);
      }
    });
    // Sort children within each parent by order, then name
    Object.keys(grouped).forEach((parentId) => {
      grouped[Number(parentId)].sort((a, b) => {
        const orderA = a.order ?? 0;
        const orderB = b.order ?? 0;
        if (orderA !== orderB) {
          return orderA - orderB;
        }
        return a.name.localeCompare(b.name);
      });
    });
    return grouped;
  }, [childCategories]);

  // Filter parent categories based on search
  const filteredParentCategories = useMemo(() => {
    if (!searchQuery) return parentCategories;
    
    const query = searchQuery.toLowerCase();
    return parentCategories.filter((parent) => {
      // Include parent if it matches search
      if (parent.name.toLowerCase().includes(query)) return true;
      
      // Include parent if any of its children match search
      const children = childrenByParent[parent.id] || [];
      return children.some((child) => child.name.toLowerCase().includes(query));
    });
  }, [parentCategories, childrenByParent, searchQuery]);

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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);

    // Handle parent category drag
    if (activeId.startsWith('parent-') && overId.startsWith('parent-')) {
      const activeParentId = Number(activeId.replace('parent-', ''));
      const overParentId = Number(overId.replace('parent-', ''));

      const oldIndex = filteredParentCategories.findIndex((cat) => cat.id === activeParentId);
      const newIndex = filteredParentCategories.findIndex((cat) => cat.id === overParentId);

      if (oldIndex === -1 || newIndex === -1) {
        return;
      }

      const newOrder = arrayMove(filteredParentCategories, oldIndex, newIndex);

      // Update order values for parent categories
      const orderData = newOrder.map((cat, index) => ({
        id: cat.id,
        order: index,
      }));

      try {
        await updateOrder.mutateAsync(orderData);
        toast.success("Category order updated");
      } catch (e) {
        toast.error("Failed to update category order");
        // eslint-disable-next-line no-console
        console.error(e);
      }
    }
    // Handle child category drag within parent
    else if (activeId.startsWith('child-') && overId.startsWith('child-')) {
      const activeChildId = Number(activeId.replace('child-', ''));
      const overChildId = Number(overId.replace('child-', ''));

      // Find which parent these children belong to
      const activeChild = childCategories.find((c) => c.id === activeChildId);
      const overChild = childCategories.find((c) => c.id === overChildId);

      if (!activeChild?.parent || !overChild?.parent || activeChild.parent !== overChild.parent) {
        return;
      }

      const parentId = activeChild.parent;
      const children = childrenByParent[parentId] || [];

      const oldIndex = children.findIndex((cat) => cat.id === activeChildId);
      const newIndex = children.findIndex((cat) => cat.id === overChildId);

      if (oldIndex === -1 || newIndex === -1) {
        return;
      }

      const newOrder = arrayMove(children, oldIndex, newIndex);

      // Update order values for child categories
      const orderData = newOrder.map((cat, index) => ({
        id: cat.id,
        order: index,
      }));

      try {
        await updateOrder.mutateAsync(orderData);
        toast.success("Subcategory order updated");
      } catch (e) {
        toast.error("Failed to update subcategory order");
        // eslint-disable-next-line no-console
        console.error(e);
      }
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
            <CardDescription>
              Drag and drop to reorder categories. Click the arrow to expand/collapse subcategories.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-4 px-4 py-2 text-sm font-semibold text-gray-600 border-b">
                  <div>Name</div>
                  <div>Slug</div>
                  <div>Subcategories</div>
                </div>
                <SortableContext
                  items={filteredParentCategories.map((cat) => `parent-${cat.id}`)}
                  strategy={verticalListSortingStrategy}
                >
                  {filteredParentCategories.map((parent: Category) => {
                    const children = childrenByParent[parent.id] || [];
                    // If searching, filter children too
                    const filteredChildren = searchQuery
                      ? children.filter((child) =>
                          child.name.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                      : children;

                    return (
                      <SortableParentCategoryItem
                        key={parent.id}
                        category={parent}
                        children={filteredChildren}
                        categories={categories}
                        onEdit={openEdit}
                        onDelete={setCategoryToDelete}
                        expandedParents={expandedParents}
                        onToggleExpand={toggleExpand}
                      />
                    );
                  })}
                </SortableContext>
              </div>
            </DndContext>
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



