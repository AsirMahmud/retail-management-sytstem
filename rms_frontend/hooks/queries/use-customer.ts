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
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Query keys
export const customerKeys = {
    all: ['customers'] as const,
    lists: () => [...customerKeys.all, 'list'] as const,
    list: (filters: string) => [...customerKeys.lists(), { filters }] as const,
    details: () => [...customerKeys.all, 'detail'] as const,
    detail: (id: number) => [...customerKeys.details(), id] as const,
    active: () => [...customerKeys.all, 'active'] as const,
    search: (query: string) => [...customerKeys.all, 'search', query] as const,
    lookup: () => [...customerKeys.all, 'lookup'] as const,
};

// Hook for getting all customers
export const useCustomers = () => {
    return useQuery({
        queryKey: customerKeys.lists(),
        queryFn: async () => {
            const response = await axios.get(`${API_URL}/customer/customers/`);
            return response.data;
        },
    });
};

// Hook for getting active customers
export const useActiveCustomers = () => {
    return useQuery({
        queryKey: customerKeys.active(),
        queryFn: async () => {
            const response = await axios.get(`${API_URL}/customer/customers/active_customers/`);
            return response.data;
        },
    });
};

// Hook for getting a single customer
export const useCustomer = (id: number) => {
    return useQuery({
        queryKey: customerKeys.detail(id),
        queryFn: async () => {
            const response = await axios.get(`${API_URL}/customer/customers/${id}/`);
            return response.data;
        },
    });
};

// Hook for creating a customer
export const useCreateCustomer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<Customer>) => {
            const response = await axios.post(`${API_URL}/customer/customers/`, data);
            return response.data;
        },
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
        mutationFn: async ({ id, data }: { id: number; data: Partial<Customer> }) => {
            const response = await axios.patch(`${API_URL}/customer/customers/${id}/`, data);
            return response.data;
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: customerKeys.detail(id) });
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
        mutationFn: async (id: number) => {
            const response = await axios.delete(`${API_URL}/customer/customers/${id}/`);
            return response.data;
        },
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
        queryKey: customerKeys.search(query),
        queryFn: async () => {
            if (!query) return [];
            const response = await axios.get(`${API_URL}/customer/customers/`, {
                params: { search: query },
            });
            return response.data;
        },
        enabled: !!query,
    });
};

// Hook for looking up a customer by phone
export const useCustomerLookup = () => {
    return useQuery({
        queryKey: customerKeys.lookup(),
        queryFn: async () => {
            const response = await axios.get(`${API_URL}/customer/customers/`);
            return response.data.map((customer: Customer) => ({
                value: customer.id,
                label: `${customer.first_name} ${customer.last_name}`,
            }));
        },
    });
};

export function usePermanentDeleteCustomer() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (customerId: number) => {
            const response = await axios.delete(
                `${API_URL}/customer/customers/${customerId}/permanent_delete/`
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
            toast({
                title: 'Success',
                description: 'Customer permanently deleted',
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
}

export function useBulkDeleteCustomers() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (customerIds: number[]) => {
            const response = await axios.post(
                `${API_URL}/customer/customers/bulk_delete/`,
                { customer_ids: customerIds }
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
            toast({
                title: 'Success',
                description: 'Selected customers permanently deleted',
            });
        },
        onError: (error: Error) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to delete customers',
                variant: 'destructive',
            });
        },
    });
} 