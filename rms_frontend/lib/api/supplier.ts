import axiosInstance from './axios-config';
import { Supplier, CreateSupplierDTO, UpdateSupplierDTO } from '@/types/inventory';

export const supplierApi = {
    getAll: async (): Promise<Supplier[]> => {
        const { data } = await axiosInstance.get('/supplier/suppliers/');
        return data;
    },

    getById: async (id: number): Promise<Supplier> => {
        const { data } = await axiosInstance.get(`/supplier/suppliers/${id}/`);
        return data;
    },

    getActive: async (): Promise<Supplier[]> => {
        const { data } = await axiosInstance.get('/supplier/suppliers/active_suppliers/');
        return data;
    },

    getInactive: async (): Promise<Supplier[]> => {
        const { data } = await axiosInstance.get('/supplier/suppliers/inactive_suppliers/');
        return data;
    },

    create: async (supplier: CreateSupplierDTO): Promise<Supplier> => {
        const { data } = await axiosInstance.post('/supplier/suppliers/', supplier);
        return data;
    },

    update: async ({ id, ...supplier }: UpdateSupplierDTO): Promise<Supplier> => {
        const { data } = await axiosInstance.put(`/supplier/suppliers/${id}/`, supplier);
        return data;
    },

    delete: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/supplier/suppliers/${id}/`);
    },
}; 