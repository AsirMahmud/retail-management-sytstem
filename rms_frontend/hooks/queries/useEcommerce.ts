'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  discountsApi,
  brandsApi,
  homePageSettingsApi,
  productEcommerceApi,
  Discount,
  Brand,
  HomePageSettings,
  CreateDiscountDTO,
  UpdateDiscountDTO,
  CreateBrandDTO,
  UpdateBrandDTO,
  UpdateHomePageSettingsDTO
} from '@/lib/api/ecommerce';

// Query Keys
export const ecommerceKeys = {
  all: ['ecommerce'] as const,
  discounts: {
    all: () => [...ecommerceKeys.all, 'discounts'] as const,
    lists: () => [...ecommerceKeys.discounts.all(), 'list'] as const,
    list: (filters: string) => [...ecommerceKeys.discounts.lists(), { filters }] as const,
    details: () => [...ecommerceKeys.discounts.all(), 'detail'] as const,
    detail: (id: number) => [...ecommerceKeys.discounts.details(), id] as const,
  },
  brands: {
    all: () => [...ecommerceKeys.all, 'brands'] as const,
    lists: () => [...ecommerceKeys.brands.all(), 'list'] as const,
    list: (filters: string) => [...ecommerceKeys.brands.lists(), { filters }] as const,
    details: () => [...ecommerceKeys.brands.all(), 'detail'] as const,
    detail: (id: number) => [...ecommerceKeys.brands.details(), id] as const,
  },
  homePageSettings: {
    all: () => [...ecommerceKeys.all, 'home-page-settings'] as const,
    detail: () => [...ecommerceKeys.homePageSettings.all(), 'detail'] as const,
  },
  products: {
    all: () => [...ecommerceKeys.all, 'products'] as const,
    ecommerceStatus: (id: number) => [...ecommerceKeys.products.all(), 'ecommerce-status', id] as const,
  },
};

// Discount Hooks
export const useDiscounts = (filters?: string) => {
  return useQuery({
    queryKey: ecommerceKeys.discounts.list(filters || ''),
    queryFn: discountsApi.getAll,
  });
};

export const useDiscount = (id: number) => {
  return useQuery({
    queryKey: ecommerceKeys.discounts.detail(id),
    queryFn: () => discountsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateDiscount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: discountsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ecommerceKeys.discounts.lists() });
    },
  });
};

export const useUpdateDiscount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: discountsApi.update,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ecommerceKeys.discounts.lists() });
      queryClient.invalidateQueries({ queryKey: ecommerceKeys.discounts.detail(data.id) });
    },
  });
};

export const useDeleteDiscount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: discountsApi.delete,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ecommerceKeys.discounts.lists() });
      queryClient.invalidateQueries({ queryKey: ecommerceKeys.discounts.detail(id) });
    },
  });
};

// Brand Hooks
export const useBrands = (filters?: string) => {
  return useQuery({
    queryKey: ecommerceKeys.brands.list(filters || ''),
    queryFn: brandsApi.getAll,
  });
};

export const useBrand = (id: number) => {
  return useQuery({
    queryKey: ecommerceKeys.brands.detail(id),
    queryFn: () => brandsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: brandsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ecommerceKeys.brands.lists() });
    },
  });
};

export const useUpdateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: brandsApi.update,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ecommerceKeys.brands.lists() });
      queryClient.invalidateQueries({ queryKey: ecommerceKeys.brands.detail(data.id) });
    },
  });
};

export const useDeleteBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: brandsApi.delete,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ecommerceKeys.brands.lists() });
      queryClient.invalidateQueries({ queryKey: ecommerceKeys.brands.detail(id) });
    },
  });
};

// Home Page Settings Hooks
export const useHomePageSettings = () => {
  return useQuery({
    queryKey: ecommerceKeys.homePageSettings.detail(),
    queryFn: homePageSettingsApi.get,
  });
};

export const useUpdateHomePageSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (settings: FormData) => homePageSettingsApi.update(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ecommerceKeys.homePageSettings.detail() });
    },
  });
};

// Product Ecommerce Status Hooks
export const useUpdateProductEcommerceStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, status }: { 
      productId: number; 
      status: { is_new_arrival?: boolean; is_trending?: boolean; is_featured?: boolean } 
    }) => productEcommerceApi.updateStatus(productId, status),
    onSuccess: (_, { productId }) => {
      // Invalidate product queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['inventory', 'products', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['inventory', 'products', 'detail', productId] });
    },
  });
};
