import { useQueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { deleteAllSales } from '@/lib/api/sales';

export function useSales() {
    const queryClient = useQueryClient();

    const deleteAllSalesMutation = useMutation({
        mutationFn: deleteAllSales,
        onSuccess: (data: { message: string; deleted_count: number }) => {
            queryClient.invalidateQueries({ queryKey: ['sales'] });
            toast.success(data.message);
        },
        onError: (error: any) => {
            console.error('Error deleting all sales:', error);
            toast.error(error.response?.data?.error || 'Failed to delete all sales');
        },
    });

    return {
        deleteAllSales: deleteAllSalesMutation.mutate,
        isDeletingAll: deleteAllSalesMutation.isPending,
    };
} 