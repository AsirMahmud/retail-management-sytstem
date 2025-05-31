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

// Sales API
export const getSales = async (params?: {
    start_date?: string;
    end_date?: string;
    status?: string;
    payment_method?: string;
    customer_phone?: string;
    search?: string;
    ordering?: string;
}) => {
    const response = await axios.get<Sale[]>('/sales/', { params });
    return response.data;
};

export const getSale = async (id: number) => {
    const response = await axios.get<Sale>(`/sales/${id}/`);
    return response.data;
};

export const createSale = async (data: Partial<Sale>) => {
    const response = await axios.post<Sale>('/sales/', data);
    return response.data;
};

export const updateSale = async (id: number, data: Partial<Sale>) => {
    const response = await axios.patch<Sale>(`/sales/${id}/`, data);
    return response.data;
};

export const deleteSale = async (id: number) => {
    await axios.delete(`/sales/${id}/`);
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
    const response = await axios.get<Payment[]>('/payments/', { params });
    return response.data;
};

export const addPayment = async (saleId: number, data: Partial<Payment>) => {
    const response = await axios.post<Payment>(`/sales/${saleId}/add_payment/`, data);
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
    const response = await axios.get<Return[]>('/returns/', { params });
    return response.data;
};

export const createReturn = async (saleId: number, data: Partial<Return>) => {
    const response = await axios.post<Return>(`/sales/${saleId}/create_return/`, data);
    return response.data;
};

export const approveReturn = async (returnId: number) => {
    const response = await axios.post<Return>(`/returns/${returnId}/approve/`);
    return response.data;
};

export const rejectReturn = async (returnId: number) => {
    const response = await axios.post<Return>(`/returns/${returnId}/reject/`);
    return response.data;
};

// Customer Lookup
export const lookupCustomer = async (phone: string) => {
    const response = await axios.get<CustomerLookupResponse>('/sales/customer_lookup/', {
        params: { phone }
    });
    return response.data;
};

// Dashboard Stats
export const getDashboardStats = async () => {
    const response = await axios.get<DashboardStats>('/sales/dashboard_stats/');
    return response.data;
};