import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supplierApi } from '@/lib/api/supplier';
import { Supplier, CreateSupplierDTO, UpdateSupplierDTO } from '@/types/inventory';

export const supplierKeys = {
    all: ['suppliers'] as const,
    lists: () => [...supplierKeys.all, 'list'] as const,
    list: (filters: string) => [...supplierKeys.lists(), { filters }] as const,
    details: () => [...supplierKeys.all, 'detail'] as const,
    detail: (id: number) => [...supplierKeys.details(), id] as const,
    active: () => [...supplierKeys.all, 'active'] as const,
    inactive: () => [...supplierKeys.all, 'inactive'] as const,
};

export const useSuppliers = (filters?: string) => {
    return useQuery({
        queryKey: supplierKeys.list(filters || ''),
        queryFn: supplierApi.getAll,
    });
};

export const useSupplier = (id: number) => {
    return useQuery({
        queryKey: supplierKeys.detail(id),
        queryFn: () => supplierApi.getById(id),
        enabled: !!id,
    });
};

export const useActiveSuppliers = () => {
    return useQuery({
        queryKey: supplierKeys.active(),
        queryFn: supplierApi.getActive,
    });
};

export const useInactiveSuppliers = () => {
    return useQuery({
        queryKey: supplierKeys.inactive(),
        queryFn: supplierApi.getInactive,
    });
};

export const useCreateSupplier = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: supplierApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
            queryClient.invalidateQueries({ queryKey: supplierKeys.active() });
        },
    });
};

export const useUpdateSupplier = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: supplierApi.update,
        onSuccess: (data: Supplier) => {
            queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
            queryClient.invalidateQueries({ queryKey: supplierKeys.detail(data.id) });
            queryClient.invalidateQueries({ queryKey: supplierKeys.active() });
            queryClient.invalidateQueries({ queryKey: supplierKeys.inactive() });
        },
    });
};

export const useDeleteSupplier = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: supplierApi.delete,
        onSuccess: (_, id: number) => {
            queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
            queryClient.invalidateQueries({ queryKey: supplierKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: supplierKeys.active() });
            queryClient.invalidateQueries({ queryKey: supplierKeys.inactive() });
        },
    });
}; 