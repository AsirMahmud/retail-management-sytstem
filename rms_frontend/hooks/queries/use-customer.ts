import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import {
    getCustomers,
    getActiveCustomers,
    getCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    searchCustomers,
    lookupCustomerByPhone,
    type Customer,
    type CreateCustomerData,
    type UpdateCustomerData,
} from '@/lib/api/customer';

// Query keys
export const customerKeys = {
    all: ['customers'] as const,
    lists: () => [...customerKeys.all, 'list'] as const,
    list: (filters: string) => [...customerKeys.lists(), { filters }] as const,
    details: () => [...customerKeys.all, 'detail'] as const,
    detail: (id: number) => [...customerKeys.details(), id] as const,
    active: () => [...customerKeys.all, 'active'] as const,
};

// Hook for getting all customers
export const useCustomers = (filters?: string) => {
    return useQuery({
        queryKey: customerKeys.list(filters || ''),
        queryFn: () => getCustomers(),
    });
};

// Hook for getting active customers
export const useActiveCustomers = () => {
    return useQuery({
        queryKey: customerKeys.active(),
        queryFn: () => getActiveCustomers(),
    });
};

// Hook for getting a single customer
export const useCustomer = (id: number) => {
    return useQuery({
        queryKey: customerKeys.detail(id),
        queryFn: () => getCustomer(id),
        enabled: !!id,
    });
};

// Hook for creating a customer
export const useCreateCustomer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateCustomerData) => createCustomer(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
            toast({
                title: 'Success',
                description: 'Customer created successfully',
            });
        },
        onError: (error: Error) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to create customer',
                variant: 'destructive',
            });
        },
    });
};

// Hook for updating a customer
export const useUpdateCustomer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateCustomerData }) =>
            updateCustomer(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: customerKeys.detail(data.id) });
            queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
            toast({
                title: 'Success',
                description: 'Customer updated successfully',
            });
        },
        onError: (error: Error) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to update customer',
                variant: 'destructive',
            });
        },
    });
};

// Hook for deleting a customer
export const useDeleteCustomer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteCustomer(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
            toast({
                title: 'Success',
                description: 'Customer deleted successfully',
            });
        },
        onError: (error: Error) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to delete customer',
                variant: 'destructive',
            });
        },
    });
};

// Hook for searching customers
export const useSearchCustomers = (query: string) => {
    return useQuery({
        queryKey: customerKeys.list(query),
        queryFn: () => searchCustomers(query),
        enabled: !!query,
    });
};

// Hook for looking up a customer by phone
export const useCustomerLookup = (phone: string) => {
    return useQuery({
        queryKey: ['customer-lookup', phone],
        queryFn: () => lookupCustomerByPhone(phone),
        enabled: !!phone && phone.length >= 10,
    });
}; 