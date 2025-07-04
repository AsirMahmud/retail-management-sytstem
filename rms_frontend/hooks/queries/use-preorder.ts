import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { preorderProductsApi, preorderVariationsApi, preordersApi } from '@/lib/api/preorder';
import {
    PreorderProduct,
    PreorderVariation,
    Preorder,
    CreatePreorderProductDTO,
    UpdatePreorderProductDTO,
    CreatePreorderVariationDTO,
    UpdatePreorderVariationDTO,
    CreatePreorderDTO,
    UpdatePreorderDTO
} from '@/types/preorder';
import { toast } from 'sonner';

// Preorder Products Hooks
export const usePreorderProducts = () => {
    return useQuery({
        queryKey: ['preorder-products'],
        queryFn: preorderProductsApi.getAll,
    });
};

export const useActivePreorderProducts = () => {
    return useQuery({
        queryKey: ['preorder-products', 'active'],
        queryFn: preorderProductsApi.getActive,
    });
};

export const usePreorderProduct = (id: number) => {
    return useQuery({
        queryKey: ['preorder-products', id],
        queryFn: () => preorderProductsApi.getById(id),
        enabled: !!id,
    });
};

export const useCreatePreorderProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: preorderProductsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['preorder-products'] });
            toast.success('Preorder product created successfully');
        },
        onError: (error) => {
            toast.error('Failed to create preorder product');
            console.error('Create preorder product error:', error);
        },
    });
};

export const useUpdatePreorderProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdatePreorderProductDTO }) =>
            preorderProductsApi.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['preorder-products'] });
            queryClient.invalidateQueries({ queryKey: ['preorder-products', id] });
            toast.success('Preorder product updated successfully');
        },
        onError: (error) => {
            toast.error('Failed to update preorder product');
            console.error('Update preorder product error:', error);
        },
    });
};

export const useDeletePreorderProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: preorderProductsApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['preorder-products'] });
            toast.success('Preorder product deleted successfully');
        },
        onError: (error) => {
            toast.error('Failed to delete preorder product');
            console.error('Delete preorder product error:', error);
        },
    });
};

export const useCompletePreorderProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: preorderProductsApi.complete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['preorder-products'] });
            toast.success('Preorder product marked as completed');
        },
        onError: (error) => {
            toast.error('Failed to complete preorder product');
            console.error('Complete preorder product error:', error);
        },
    });
};

export const useDeactivatePreorderProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: preorderProductsApi.deactivate,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['preorder-products'] });
            toast.success('Preorder product deactivated');
        },
        onError: (error) => {
            toast.error('Failed to deactivate preorder product');
            console.error('Deactivate preorder product error:', error);
        },
    });
};

export const useAvailablePreorderProducts = () => {
    return useQuery({
        queryKey: ['preorder-products', 'available'],
        queryFn: preorderProductsApi.getActive,
    });
};

// Preorder Variations Hooks
export const usePreorderVariations = (productId?: number) => {
    return useQuery({
        queryKey: ['preorder-variations', productId],
        queryFn: () => preorderVariationsApi.getAll(productId),
        enabled: !!productId,
    });
};

export const useCreatePreorderVariation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: preorderVariationsApi.create,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['preorder-variations', variables.preorder_product] });
            toast.success('Preorder variation created successfully');
        },
        onError: (error) => {
            toast.error('Failed to create preorder variation');
            console.error('Create preorder variation error:', error);
        },
    });
};

export const useUpdatePreorderVariation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdatePreorderVariationDTO }) =>
            preorderVariationsApi.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['preorder-variations'] });
            toast.success('Preorder variation updated successfully');
        },
        onError: (error) => {
            toast.error('Failed to update preorder variation');
            console.error('Update preorder variation error:', error);
        },
    });
};

export const useDeletePreorderVariation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: preorderVariationsApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['preorder-variations'] });
            toast.success('Preorder variation deleted successfully');
        },
        onError: (error) => {
            toast.error('Failed to delete preorder variation');
            console.error('Delete preorder variation error:', error);
        },
    });
};

// Preorders Hooks
export const usePreorders = (status?: string, productId?: number) => {
    return useQuery({
        queryKey: ['preorders', status, productId],
        queryFn: () => preordersApi.getAll(status, productId),
    });
};

export const usePreorder = (id: number) => {
    return useQuery({
        queryKey: ['preorders', id],
        queryFn: () => preordersApi.getById(id),
        enabled: !!id,
    });
};

export const useCreatePreorder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: preordersApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['preorders'] });
            toast.success('Preorder created successfully');
        },
        onError: (error) => {
            toast.error('Failed to create preorder');
            console.error('Create preorder error:', error);
        },
    });
};

export const useUpdatePreorder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdatePreorderDTO }) =>
            preordersApi.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['preorders'] });
            queryClient.invalidateQueries({ queryKey: ['preorders', id] });
            toast.success('Preorder updated successfully');
        },
        onError: (error) => {
            toast.error('Failed to update preorder');
            console.error('Update preorder error:', error);
        },
    });
};

export const useDeletePreorder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: preordersApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['preorders'] });
            toast.success('Preorder deleted successfully');
        },
        onError: (error) => {
            toast.error('Failed to delete preorder');
            console.error('Delete preorder error:', error);
        },
    });
};

export const useCompletePreorder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: preordersApi.complete,
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: ['preorders'] });
            toast.success(`Preorder completed and converted to sale #${data.sale_id}`);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to complete preorder');
            console.error('Complete preorder error:', error);
        },
    });
};

export const useCancelPreorder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: preordersApi.cancel,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['preorders'] });
            toast.success('Preorder cancelled successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to cancel preorder');
            console.error('Cancel preorder error:', error);
        },
    });
};

export const useUpdatePreorderStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: number; status: string }) =>
            preordersApi.updateStatus(id, status),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['preorders'] });
            queryClient.invalidateQueries({ queryKey: ['preorders', id] });
            toast.success('Preorder status updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to update preorder status');
            console.error('Update preorder status error:', error);
        },
    });
};

// Dashboard Hooks
export const usePreorderDashboard = () => {
    return useQuery({
        queryKey: ['preorder-dashboard'],
        queryFn: preorderProductsApi.dashboard,
    });
};

export const usePreorderStats = () => {
    return useQuery({
        queryKey: ['preorder-stats'],
        queryFn: preordersApi.dashboard,
    });
}; 