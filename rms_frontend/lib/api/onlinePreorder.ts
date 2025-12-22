import axios from './axios-config';

export interface OnlinePreorderItem {
  product_id: number;
  product_name?: string;
  product_image?: string;
  size: string;
  color: string;
  quantity: number;
  unit_price: number;
  discount?: number;
}

export interface OnlinePreorder {
  id: number;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  items: OnlinePreorderItem[];
  shipping_address?: any;
  delivery_charge?: number | string;
  delivery_method?: string;
  total_amount: number | string;
  status: string;
  notes?: string;
  expected_delivery_date?: string;
  created_at: string;
  updated_at?: string;
}

const api = axios;

export const onlinePreordersApi = {
  getAll: (status?: string, search?: string) => {
    const params = new URLSearchParams();
    if (status && status !== 'all') params.append('status', status);
    if (search) params.append('search', search);
    const qs = params.toString();
    return api.get<{ results?: OnlinePreorder[] } | OnlinePreorder[]>(`/online-preorder/orders/${qs ? `?${qs}` : ''}`);
  },
  getById: (id: number) => api.get<OnlinePreorder>(`/online-preorder/orders/${id}/`),
  create: (data: Partial<OnlinePreorder>) => api.post<OnlinePreorder>('/online-preorder/orders/', data),
  update: (id: number, data: Partial<OnlinePreorder>) => api.patch<OnlinePreorder>(`/online-preorder/orders/${id}/`, data),
  updateStatus: (id: number, status: string) => api.patch(`/online-preorder/orders/${id}/`, { status }),
  delete: (id: number) => api.delete(`/online-preorder/orders/${id}/`),
};









