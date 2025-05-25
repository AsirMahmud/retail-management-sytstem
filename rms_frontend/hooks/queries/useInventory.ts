'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    categoriesApi,
    productsApi,
    productVariationsApi,
    productImagesApi,
} from '@/lib/api/inventory';
import { supplierApi } from '@/lib/api/supplier';
import {
    Category,
    Product,
    ProductVariation,
    ProductImage,
    CreateCategoryDTO,
    CreateProductDTO,
    CreateProductVariationDTO,
    CreateProductImageDTO,
    UpdateCategoryDTO,
    UpdateProductDTO,
    UpdateProductVariationDTO,
    UpdateProductImageDTO,
} from '@/types/inventory';

// Query Keys
export const inventoryKeys = {
    all: ['inventory'] as const,
    categories: {
        all: () => [...inventoryKeys.all, 'categories'] as const,
        lists: () => [...inventoryKeys.categories.all(), 'list'] as const,
        list: (filters: string) => [...inventoryKeys.categories.lists(), { filters }] as const,
        details: () => [...inventoryKeys.categories.all(), 'detail'] as const,
        detail: (id: number) => [...inventoryKeys.categories.details(), id] as const,
    },
    suppliers: {
        all: () => [...inventoryKeys.all, 'suppliers'] as const,
        lists: () => [...inventoryKeys.suppliers.all(), 'list'] as const,
        list: (filters: string) => [...inventoryKeys.suppliers.lists(), { filters }] as const,
        details: () => [...inventoryKeys.suppliers.all(), 'detail'] as const,
        detail: (id: number) => [...inventoryKeys.suppliers.details(), id] as const,
    },
    products: {
        all: () => [...inventoryKeys.all, 'products'] as const,
        lists: () => [...inventoryKeys.products.all(), 'list'] as const,
        list: (filters: string) => [...inventoryKeys.products.lists(), { filters }] as const,
        details: () => [...inventoryKeys.products.all(), 'detail'] as const,
        detail: (id: number) => [...inventoryKeys.products.details(), id] as const,
        variations: (productId: number) => [...inventoryKeys.products.detail(productId), 'variations'] as const,
        variation: (productId: number, id: number) => [...inventoryKeys.products.variations(productId), id] as const,
        images: (productId: number) => [...inventoryKeys.products.detail(productId), 'images'] as const,
        image: (productId: number, id: number) => [...inventoryKeys.products.images(productId), id] as const,
    },
};

// Category Hooks
export const useCategories = (filters?: string) => {
    return useQuery({
        queryKey: inventoryKeys.categories.list(filters || ''),
        queryFn: categoriesApi.getAll,
    });
};

export const useCategory = (id: number) => {
    return useQuery({
        queryKey: inventoryKeys.categories.detail(id),
        queryFn: () => categoriesApi.getById(id),
        enabled: !!id,
    });
};

export const useCreateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: categoriesApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: inventoryKeys.categories.lists() });
        },
    });
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: categoriesApi.update,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: inventoryKeys.categories.lists() });
            queryClient.invalidateQueries({ queryKey: inventoryKeys.categories.detail(data.id) });
        },
    });
};

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: categoriesApi.delete,
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: inventoryKeys.categories.lists() });
            queryClient.invalidateQueries({ queryKey: inventoryKeys.categories.detail(id) });
        },
    });
};

// Supplier Hooks
export const useSuppliers = (filters?: string) => {
    return useQuery({
        queryKey: ['suppliers', filters],
        queryFn: supplierApi.getAll,
    });
};

export const useSupplier = (id: number) => {
    return useQuery({
        queryKey: ['suppliers', id],
        queryFn: () => supplierApi.getById(id),
        enabled: !!id,
    });
};

export const useCreateSupplier = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: supplierApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['suppliers'] });
        },
    });
};

export const useUpdateSupplier = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: supplierApi.update,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['suppliers'] });
            queryClient.invalidateQueries({ queryKey: ['suppliers', data.id] });
        },
    });
};

export const useDeleteSupplier = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: supplierApi.delete,
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['suppliers'] });
            queryClient.invalidateQueries({ queryKey: ['suppliers', id] });
        },
    });
};

// Product Hooks
export const useProducts = (filters?: string) => {
    return useQuery({
        queryKey: inventoryKeys.products.list(filters || ''),
        queryFn: productsApi.getAll,
    });
};

export const useProduct = (id: number) => {
    return useQuery({
        queryKey: inventoryKeys.products.detail(id),
        queryFn: () => productsApi.getById(id),
        enabled: !!id,
    });
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: productsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: inventoryKeys.products.lists() });
        },
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: productsApi.update,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: inventoryKeys.products.lists() });
            queryClient.invalidateQueries({ queryKey: inventoryKeys.products.detail(data.id) });
        },
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: productsApi.delete,
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: inventoryKeys.products.lists() });
            queryClient.invalidateQueries({ queryKey: inventoryKeys.products.detail(id) });
        },
    });
};

// Product Variation Hooks
export const useProductVariations = (productId: number) => {
    return useQuery({
        queryKey: inventoryKeys.products.variations(productId),
        queryFn: () => productVariationsApi.getAll(productId),
        enabled: !!productId,
    });
};

export const useProductVariation = (productId: number, id: number) => {
    return useQuery({
        queryKey: inventoryKeys.products.variation(productId, id),
        queryFn: () => productVariationsApi.getById(productId, id),
        enabled: !!productId && !!id,
    });
};

export const useCreateProductVariation = (productId: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (variation: CreateProductVariationDTO) => productVariationsApi.create(productId, variation),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: inventoryKeys.products.variations(productId) });
        },
    });
};

export const useUpdateProductVariation = (productId: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (variation: UpdateProductVariationDTO) => productVariationsApi.update(productId, variation),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: inventoryKeys.products.variations(productId) });
            queryClient.invalidateQueries({ queryKey: inventoryKeys.products.variation(productId, data.id) });
        },
    });
};

export const useDeleteProductVariation = (productId: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => productVariationsApi.delete(productId, id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: inventoryKeys.products.variations(productId) });
            queryClient.invalidateQueries({ queryKey: inventoryKeys.products.variation(productId, id) });
        },
    });
};

// Product Image Hooks
export const useProductImages = (productId: number) => {
    return useQuery({
        queryKey: inventoryKeys.products.images(productId),
        queryFn: () => productImagesApi.getAll(productId),
        enabled: !!productId,
    });
};

export const useProductImage = (productId: number, id: number) => {
    return useQuery({
        queryKey: inventoryKeys.products.image(productId, id),
        queryFn: () => productImagesApi.getById(productId, id),
        enabled: !!productId && !!id,
    });
};

export const useCreateProductImage = (productId: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (image: CreateProductImageDTO) => productImagesApi.create(productId, image),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: inventoryKeys.products.images(productId) });
        },
    });
};

export const useUpdateProductImage = (productId: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (image: UpdateProductImageDTO) => productImagesApi.update(productId, image),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: inventoryKeys.products.images(productId) });
            queryClient.invalidateQueries({ queryKey: inventoryKeys.products.image(productId, data.id) });
        },
    });
};

export const useDeleteProductImage = (productId: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => productImagesApi.delete(productId, id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: inventoryKeys.products.images(productId) });
            queryClient.invalidateQueries({ queryKey: inventoryKeys.products.image(productId, id) });
        },
    });
}; 