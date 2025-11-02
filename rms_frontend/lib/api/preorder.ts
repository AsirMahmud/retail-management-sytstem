import axiosInstance from './axios-config';
import {
    PreorderProduct,
    PreorderVariation,
    Preorder,
    PreorderDashboard,
    CreatePreorderProductDTO,
    UpdatePreorderProductDTO,
    CreatePreorderVariationDTO,
    UpdatePreorderVariationDTO,
    CreatePreorderDTO,
    UpdatePreorderDTO
} from '@/types/preorder';

const api = axiosInstance
// Preorder Products
export const preorderProductsApi = {
    getAll: () => api.get<PreorderProduct[]>('/preorder/products/'),
    getActive: () => api.get<PreorderProduct[]>('/preorder/products/active/'),
    getById: (id: number) => api.get<PreorderProduct>(`/preorder/products/${id}/`),
    create: (data: CreatePreorderProductDTO) => api.post<PreorderProduct>('/preorder/products/', data),
    update: (id: number, data: UpdatePreorderProductDTO) => api.put<PreorderProduct>(`/preorder/products/${id}/`, data),
    delete: (id: number) => api.delete(`/preorder/products/${id}/`),
    complete: (id: number) => api.post(`/preorder/products/${id}/complete/`),
    deactivate: (id: number) => api.post(`/preorder/products/${id}/deactivate/`),
    dashboard: () => api.get<PreorderDashboard[]>('/preorder/products/dashboard/'),
};

// Preorder Variations
export const preorderVariationsApi = {
    getAll: (productId?: number) => {
        const params = productId ? `?product=${productId}` : '';
        return api.get<PreorderVariation[]>(`/preorder/variations/${params}`);
    },
    getById: (id: number) => api.get<PreorderVariation>(`/preorder/variations/${id}/`),
    create: (data: CreatePreorderVariationDTO) => api.post<PreorderVariation>('/preorder/variations/', data),
    update: (id: number, data: UpdatePreorderVariationDTO) => api.put<PreorderVariation>(`/preorder/variations/${id}/`, data),
    delete: (id: number) => api.delete(`/preorder/variations/${id}/`),
};

// Preorders
export const preordersApi = {
    getAll: (status?: string, productId?: number, source?: string) => {
        const params = new URLSearchParams();
        if (status && status !== 'all') params.append('status', status);
        if (productId) params.append('product', productId.toString());
        if (source) params.append('source', source);
        const queryString = params.toString();
        return api.get<Preorder[]>(`/preorder/orders/${queryString ? `?${queryString}` : ''}`);
    },
    getById: (id: number) => api.get<Preorder>(`/preorder/orders/${id}/`),
    create: (data: CreatePreorderDTO) => api.post<Preorder>('/preorder/orders/', data),
    update: (id: number, data: UpdatePreorderDTO) => api.put<Preorder>(`/preorder/orders/${id}/`, data),
    delete: (id: number) => api.delete(`/preorder/orders/${id}/`),
    complete: (id: number) => api.post(`/preorder/orders/${id}/complete/`),
    cancel: (id: number) => api.post(`/preorder/orders/${id}/cancel/`),
    updateStatus: (id: number, status: string) => api.post(`/preorder/orders/${id}/update_status/`, { status }),
    dashboard: () => api.get('/preorder/orders/dashboard/'),
}; 