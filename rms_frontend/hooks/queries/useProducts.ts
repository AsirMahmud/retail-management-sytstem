import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi, Product, CreateProductDTO, UpdateProductDTO } from '@/lib/api/products';

export const productKeys = {
    all: ['products'] as const,
    lists: () => [...productKeys.all, 'list'] as const,
    list: (filters: string) => [...productKeys.lists(), { filters }] as const,
    details: () => [...productKeys.all, 'detail'] as const,
    detail: (id: number) => [...productKeys.details(), id] as const,
};

export const useProducts = (filters?: string) => {
    return useQuery({
        queryKey: productKeys.list(filters || ''),
        queryFn: productsApi.getAll,
    });
};

export const useProduct = (id: number) => {
    return useQuery({
        queryKey: productKeys.detail(id),
        queryFn: () => productsApi.getById(id),
        enabled: !!id,
    });
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: productsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
        },
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: productsApi.update,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
            queryClient.invalidateQueries({ queryKey: productKeys.detail(data.id) });
        },
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: productsApi.delete,
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
            queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
        },
    });
}; 