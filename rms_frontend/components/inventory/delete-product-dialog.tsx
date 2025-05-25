"use client";

import { useRouter } from "next/navigation";
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
import { useDeleteProduct } from "@/hooks/queries/useInventory";

interface DeleteProductDialogProps {
  productId: number;
  productName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteProductDialog({
  productId,
  productName,
  isOpen,
  onClose,
}: DeleteProductDialogProps) {
  const router = useRouter();
  const deleteProduct = useDeleteProduct();

  async function handleDelete() {
    try {
      await deleteProduct.mutateAsync(productId);
      router.refresh();
      onClose();
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the product "{productName}". This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteProduct.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {deleteProduct.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
