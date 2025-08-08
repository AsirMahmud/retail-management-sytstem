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
    getTopCustomers,
    getCustomerAnalytics,
    type Customer,
    type TopCustomer,
    type CustomerAnalytics,
    type CreateCustomerData,
    type UpdateCustomerData,
    type PaginatedResponse,
} from '@/lib/api/customer';
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BASEURL || 'http://localhost:8000/api';

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
    top: () => [...customerKeys.all, 'top'] as const,
    analytics: () => [...customerKeys.all, 'analytics'] as const,
};

// Hook for getting all customers with pagination and filtering
export const useCustomers = (
    page: number = 1, 
    pageSize: number = 20,
    filters?: {
        ranking_filter?: string;
        sales_filter?: string;
        recent_filter?: string;
        ordering?: string;
    }
) => {
    return useQuery({
        queryKey: [...customerKeys.lists(), page, pageSize, filters],
        queryFn: async () => {
            const params: any = { page, page_size: pageSize };
            
            if (filters) {
                if (filters.ranking_filter) params.ranking_filter = filters.ranking_filter;
                if (filters.sales_filter) params.sales_filter = filters.sales_filter;
                if (filters.recent_filter) params.recent_filter = filters.recent_filter;
                if (filters.ordering) params.ordering = filters.ordering;
            }
            
            const response = await axios.get(`${API_URL}/customer/customers/`, { params });
            return response.data;
        },
    });
};

// Hook for getting active customers with pagination
export const useActiveCustomers = (page: number = 1, pageSize: number = 20) => {
    return useQuery({
        queryKey: [...customerKeys.active(), page, pageSize],
        queryFn: async () => {
            const response = await axios.get(`${API_URL}/customer/customers/active_customers/`, {
                params: { page, page_size: pageSize }
            });
            return response.data;
        },
    });
};

// Hook for getting top customers
export const useTopCustomers = (limit: number = 5) => {
    return useQuery({
        queryKey: [...customerKeys.top(), limit],
        queryFn: async () => {
            const response = await axios.get(`${API_URL}/customer/customers/top_customers/`, {
                params: { limit }
            });
            return response.data;
        },
    });
};

// Hook for getting customer analytics
export const useCustomerAnalytics = () => {
    return useQuery({
        queryKey: customerKeys.analytics(),
        queryFn: async () => {
            const response = await axios.get(`${API_URL}/customer/customers/customer_analytics/`);
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
            queryClient.invalidateQueries({ queryKey: customerKeys.top() });
            queryClient.invalidateQueries({ queryKey: customerKeys.analytics() });
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
            queryClient.invalidateQueries({ queryKey: customerKeys.top() });
            queryClient.invalidateQueries({ queryKey: customerKeys.analytics() });
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
            queryClient.invalidateQueries({ queryKey: customerKeys.top() });
            queryClient.invalidateQueries({ queryKey: customerKeys.analytics() });
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

// Hook for searching customers with pagination
export const useSearchCustomers = (
    query: string, 
    page: number = 1, 
    pageSize: number = 20,
    filters?: {
        ranking_filter?: string;
        sales_filter?: string;
        recent_filter?: string;
        ordering?: string;
    }
) => {
    return useQuery({
        queryKey: [...customerKeys.search(query), page, pageSize, filters],
        queryFn: async () => {
            if (!query) return { count: 0, next: null, previous: null, results: [] };
            
            const params: any = { search: query, page, page_size: pageSize };
            
            // Add filters to search params
            if (filters) {
                if (filters.ranking_filter) params.ranking_filter = filters.ranking_filter;
                if (filters.sales_filter) params.sales_filter = filters.sales_filter;
                if (filters.recent_filter) params.recent_filter = filters.recent_filter;
                if (filters.ordering) params.ordering = filters.ordering;
            }
            
            const response = await axios.get(`${API_URL}/customer/customers/`, { params });
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
            const customers = response.data.results || response.data;
            return customers.map((customer: Customer) => ({
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
            queryClient.invalidateQueries({ queryKey: customerKeys.top() });
            queryClient.invalidateQueries({ queryKey: customerKeys.analytics() });
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
            queryClient.invalidateQueries({ queryKey: customerKeys.top() });
            queryClient.invalidateQueries({ queryKey: customerKeys.analytics() });
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