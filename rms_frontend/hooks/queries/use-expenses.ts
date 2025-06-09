import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { expensesApi, Expense, ExpenseCategory, DashboardStats } from "@/lib/api/expenses";
import { useToast } from "@/hooks/use-toast";

export function useExpenses(params?: {
    search?: string;
    category?: number;
    status?: string;
    payment_method?: string;
    start_date?: string;
    end_date?: string;
}) {
    return useQuery({
        queryKey: ["expenses", params],
        queryFn: () => expensesApi.getExpenses(params),
    });
}

export function useExpense(id: number) {
    return useQuery({
        queryKey: ["expense", id],
        queryFn: () => expensesApi.getExpense(id),
    });
}

export function useCreateExpense() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: expensesApi.createExpense,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["expenses"] });
            toast({
                title: "Success",
                description: "Expense created successfully",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to create expense",
                variant: "destructive",
            });
        },
    });
}

export function useUpdateExpense() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<Expense> }) =>
            expensesApi.updateExpense(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["expenses"] });
            toast({
                title: "Success",
                description: "Expense updated successfully",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to update expense",
                variant: "destructive",
            });
        },
    });
}

export function useDeleteExpense() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: expensesApi.deleteExpense,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["expenses"] });
            toast({
                title: "Success",
                description: "Expense deleted successfully",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to delete expense",
                variant: "destructive",
            });
        },
    });
}

export function useApproveExpense() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: expensesApi.approveExpense,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["expenses"] });
            toast({
                title: "Success",
                description: "Expense approved successfully",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to approve expense",
                variant: "destructive",
            });
        },
    });
}

export function useRejectExpense() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: expensesApi.rejectExpense,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["expenses"] });
            toast({
                title: "Success",
                description: "Expense rejected successfully",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to reject expense",
                variant: "destructive",
            });
        },
    });
}

export function useCategories() {
    return useQuery({
        queryKey: ["expense-categories"],
        queryFn: expensesApi.getCategories,
    });
}

export function useCreateCategory() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: expensesApi.createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["expense-categories"] });
            toast({
                title: "Success",
                description: "Category created successfully",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to create category",
                variant: "destructive",
            });
        },
    });
}

export function useUpdateCategory() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<ExpenseCategory> }) =>
            expensesApi.updateCategory(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["expense-categories"] });
            toast({
                title: "Success",
                description: "Category updated successfully",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to update category",
                variant: "destructive",
            });
        },
    });
}

export function useDeleteCategory() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: expensesApi.deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["expense-categories"] });
            toast({
                title: "Success",
                description: "Category deleted successfully",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to delete category",
                variant: "destructive",
            });
        },
    });
}

export function useDashboardStats() {
    return useQuery({
        queryKey: ["expense-dashboard-stats"],
        queryFn: expensesApi.getDashboardStats,
    });
} 