import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface Product {
    id: number;
    name: string;
    sku: string;
    price: number;
    stock: number;
    category: string;
    description?: string;
    created_at: string;
    updated_at: string;
}

export interface CreateProductDTO {
    name: string;
    sku: string;
    price: number;
    stock: number;
    category: string;
    description?: string;
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {
    id: number;
}

export const productsApi = {
    getAll: async (): Promise<Product[]> => {
        const { data } = await axios.get(`${API_URL}/products/`);
        return data;
    },

    getById: async (id: number): Promise<Product> => {
        const { data } = await axios.get(`${API_URL}/products/${id}/`);
        return data;
    },

    create: async (product: CreateProductDTO): Promise<Product> => {
        const { data } = await axios.post(`${API_URL}/products/`, product);
        return data;
    },

    update: async ({ id, ...product }: UpdateProductDTO): Promise<Product> => {
        const { data } = await axios.put(`${API_URL}/products/${id}/`, product);
        return data;
    },

    delete: async (id: number): Promise<void> => {
        await axios.delete(`${API_URL}/products/${id}/`);
    }
}; 