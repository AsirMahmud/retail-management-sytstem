import axios from './axios-config';
import type {
    Sale,
    SaleItem,
    Payment,
    Return,
    ReturnItem,
    CustomerLookupResponse,
    DashboardStats
} from '@/types/sales';

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

// Sales API
export const getSales = async (params?: {
    start_date?: string;
    end_date?: string;
    status?: string;
    payment_method?: string;
    customer_phone?: string;
    search?: string;
    ordering?: string;
    page?: number;
    page_size?: number;
}) => {
    const response = await axios.get<PaginatedResponse<Sale>>('/sales/sales/', { params });
    return response.data;
};

export const getSale = async (id: number) => {
    const response = await axios.get<Sale>(`/sales/sales/${id}/`);
    return response.data;
};

export const createSale = async (data: Partial<Sale>) => {
    const response = await axios.post<Sale>('/sales/sales/', data);
    return response.data;
};

export const updateSale = async (id: number, data: Partial<Sale>) => {
    const response = await axios.patch<Sale>(`/sales/sales/${id}/`, data);
    return response.data;
};

export const deleteSale = async (id: number): Promise<void> => {
    const response = await axios.delete(`/sales/sales/${id}/`);
    return response.data;
};

export const bulkDeleteSales = async (saleIds: number[]) => {
    const response = await axios.post<{ message: string; deleted_count: number }>('/sales/sales/bulk_delete/', {
        sale_ids: saleIds
    });
    return response.data;
};

export const deleteAllSales = async (): Promise<{ message: string; deleted_count: number }> => {
    const response = await axios.post('/sales/sales/delete_all_sales/');
    return response.data;
};

// Payments API
export const getPayments = async (params?: {
    start_date?: string;
    end_date?: string;
    status?: string;
    payment_method?: string;
    search?: string;
    ordering?: string;
}) => {
    const response = await axios.get<Payment[]>('/sales/payments/', { params });
    return response.data;
};

export const addPayment = async (saleId: number, data: Partial<Payment>) => {
    const response = await axios.post<Payment>(`/sales/sales/${saleId}/add_payment/`, data);
    return response.data;
};

// Returns API
export const getReturns = async (params?: {
    start_date?: string;
    end_date?: string;
    status?: string;
    search?: string;
    ordering?: string;
}) => {
    const response = await axios.get<Return[]>('/sales/returns/', { params });
    return response.data;
};

export const createReturn = async (saleId: number, data: Partial<Return>) => {
    const response = await axios.post<Return>(`/sales/sales/${saleId}/create_return/`, data);
    return response.data;
};

export const approveReturn = async (returnId: number) => {
    const response = await axios.post<Return>(`/sales/returns/${returnId}/approve/`);
    return response.data;
};

export const rejectReturn = async (returnId: number) => {
    const response = await axios.post<Return>(`/sales/returns/${returnId}/reject/`);
    return response.data;
};

// Customer Lookup
export const lookupCustomer = async (phone: string) => {
    const response = await axios.get<CustomerLookupResponse>('/sales/sales/customer_lookup/', {
        params: { phone }
    });
    return response.data;
};

// Dashboard Stats
export const getDashboardStats = async () => {
    const response = await axios.get<DashboardStats>('/sales/sales/dashboard_stats/');
    return response.data;
};