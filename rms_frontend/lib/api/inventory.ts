import axiosInstance from './axios-config';
import {
    Category,
    Product,
    ProductVariation,
    Gallery,
    GalleryImage,
    CreateCategoryDTO,
    CreateProductDTO,
    CreateProductVariationDTO,
    CreateGalleryDTO,
    CreateGalleryImageDTO,
    UpdateCategoryDTO,
    UpdateProductDTO,
    UpdateProductVariationDTO,
    UpdateGalleryDTO,
    UpdateGalleryImageDTO,
    DashboardOverview,
    CategoryMetrics,
    StockMovementAnalysis
} from '@/types/inventory';

// Product Analytics Types
export interface ProductAnalytics {
  product_info: {
    id: number;
    name: string;
    sku: string;
    current_stock: number;
    cost_price: number;
    selling_price: number;
    profit_margin_percentage: number;
  };
  stock_analytics: {
    total_stock_in: number;
    total_stock_out: number;
    stock_in_movements: number;
    stock_out_movements: number;
    net_stock_change: number;
  };
  sales_analytics: {
    total_quantity_sold: number;
    total_revenue: number;
    total_profit: number;
    total_loss: number;
    average_price: number;
    total_sales: number;
    profit_margin: number;
    net_profit: number;
  };
  charts: {
    monthly_stock: Array<{
      month: string;
      stock_in: number;
      stock_out: number;
      net_change: number;
    }>;
    monthly_sales: Array<{
      month: string;
      quantity_sold: number;
      revenue: number;
      profit: number;
      loss: number;
    }>;
  };
  recent_activity: {
    stock_movements: Array<{
      id: number;
      movement_type: string;
      quantity: number;
      reference_number: string;
      notes: string;
      created_at: string;
    }>;
    sales: Array<{
      id: number;
      sale_id: number;
      invoice_number: string;
      quantity: number;
      unit_price: number;
      total: number;
      profit: number;
      loss: number;
      sale_date: string;
      customer_name: string;
      payment_method: string;
    }>;
  };
}

export interface StockMovement {
  id: number;
  movement_type: string;
  quantity: number;
  reference_number: string;
  notes: string;
  created_at: string;
  variation_info: string;
}

export interface SalesHistory {
  id: number;
  sale_id: number;
  invoice_number: string;
  quantity: number;
  size: string;
  color: string;
  unit_price: number;
  discount: number;
  total: number;
  profit: number;
  loss: number;
  sale_date: string;
  customer_name: string;
  payment_method: string;
}

// Categories API
export const categoriesApi = {
    getAll: async (): Promise<Category[]> => {
        const { data } = await axiosInstance.get('/inventory/categories/');
        return data;
    },

    getById: async (id: number): Promise<Category> => {
        const { data } = await axiosInstance.get(`/inventory/categories/${id}/`);
        return data;
    },

    getProducts: async (id: number): Promise<Product[]> => {
        const { data } = await axiosInstance.get(`/inventory/categories/${id}/products/`);
        return data;
    },

    getStats: async (id: number): Promise<{
        total_products: number;
        active_products: number;
        low_stock_products: number;
        total_value: number;
    }> => {
        const { data } = await axiosInstance.get(`/inventory/categories/${id}/stats/`);
        return data;
    },

    create: async (category: CreateCategoryDTO): Promise<Category> => {
        const { data } = await axiosInstance.post('/inventory/categories/', category);
        return data;
    },

    update: async ({ id, ...category }: UpdateCategoryDTO): Promise<Category> => {
        const { data } = await axiosInstance.put(`/inventory/categories/${id}/`, category);
        return data;
    },

    delete: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/inventory/categories/${id}/`);
    },
};

// Online Categories API
export const onlineCategoriesApi = {
    getAll: async (): Promise<Category[]> => {
        const { data } = await axiosInstance.get('/inventory/online-categories/');
        return data;
    },

    getById: async (id: number): Promise<Category> => {
        const { data } = await axiosInstance.get(`/inventory/online-categories/${id}/`);
        return data;
    },

    create: async (category: CreateCategoryDTO): Promise<Category> => {
        const { data } = await axiosInstance.post('/inventory/online-categories/', category);
        return data;
    },

    update: async ({ id, ...category }: UpdateCategoryDTO): Promise<Category> => {
        const { data } = await axiosInstance.put(`/inventory/online-categories/${id}/`, category);
        return data;
    },

    delete: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/inventory/online-categories/${id}/`);
    },
};

// Products API
export const productsApi = {
    getAll: async (): Promise<Product[]> => {
        const { data } = await axiosInstance.get('/inventory/products/?expand=category,online_category');
        return data;
    },

    getById: async (id: number): Promise<Product> => {
        const { data } = await axiosInstance.get(`/inventory/products/${id}/?expand=category,online_category`);
        return data;
    },

    create: async (product: CreateProductDTO): Promise<Product> => {
        console.log('Creating product with data:', product);
        const { data } = await axiosInstance.post('/inventory/products/', product);
        return data;
    },

    update: async ({ id, ...product }: UpdateProductDTO): Promise<Product> => {
        const { data } = await axiosInstance.put(`/inventory/products/${id}/`, product);
        return data;
    },

    delete: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/inventory/products/${id}/`);
    },

    // Product Analytics
    getAnalytics: async (id: number, days?: number): Promise<ProductAnalytics> => {
        const params: any = {};
        if (days !== undefined) {
            params.days = days;
        }
        const { data } = await axiosInstance.get(`/inventory/products/${id}/analytics/`, {
            params
        });
        return data;
    },

    getStockHistory: async (id: number, days?: number): Promise<{ product_id: number; product_name: string; stock_history: StockMovement[] }> => {
        const params: any = {};
        if (days !== undefined) {
            params.days = days;
        }
        const { data } = await axiosInstance.get(`/inventory/products/${id}/stock_history/`, {
            params
        });
        return data;
    },

    getSalesHistory: async (id: number, days?: number): Promise<{ product_id: number; product_name: string; sales_history: SalesHistory[] }> => {
        const params: any = {};
        if (days !== undefined) {
            params.days = days;
        }
        const { data } = await axiosInstance.get(`/inventory/products/${id}/sales_history/`, {
            params
        });
        return data;
    },

    // Add stock to a variation
    addStock: async (productId: number, variationId: number, quantity: number, notes?: string): Promise<{ detail: string; product_id: number; variation_id: number; new_stock: number }> => {
        const { data } = await axiosInstance.post(`/inventory/products/${productId}/add_stock/`, {
            variation_id: variationId,
            quantity,
            notes,
        });
        return data;
    },
};

// Product Variations API
export const productVariationsApi = {
    getAll: async (productId: number): Promise<ProductVariation[]> => {
        const { data } = await axiosInstance.get(`/inventory/products/${productId}/variations/`);
        return data;
    },

    getById: async (productId: number, id: number): Promise<ProductVariation> => {
        const { data } = await axiosInstance.get(`/inventory/products/${productId}/variations/${id}/`);
        return data;
    },

    create: async (productId: number, variation: CreateProductVariationDTO): Promise<ProductVariation> => {
        const { data } = await axiosInstance.post(`/inventory/products/${productId}/variations/`, variation);
        return data;
    },

    update: async (productId: number, { id, ...variation }: UpdateProductVariationDTO): Promise<ProductVariation> => {
        const { data } = await axiosInstance.put(`/inventory/products/${productId}/variations/${id}/`, variation);
        return data;
    },

    delete: async (productId: number, id: number): Promise<void> => {
        await axiosInstance.delete(`/inventory/products/${productId}/variations/${id}/`);
    },
};

// Galleries API
export const galleriesApi = {
    getAll: async (productId?: number): Promise<Gallery[]> => {
        const params = productId ? { product: productId } : {};
        const { data } = await axiosInstance.get('/inventory/galleries/', { params });
        return data;
    },

    getById: async (id: number): Promise<Gallery> => {
        const { data } = await axiosInstance.get(`/inventory/galleries/${id}/`);
        return data;
    },

    create: async (gallery: CreateGalleryDTO): Promise<Gallery> => {
        const { data } = await axiosInstance.post('/inventory/galleries/', gallery);
        return data;
    },

    update: async ({ id, ...gallery }: UpdateGalleryDTO): Promise<Gallery> => {
        const { data } = await axiosInstance.put(`/inventory/galleries/${id}/`, gallery);
        return data;
    },

    delete: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/inventory/galleries/${id}/`);
    },

    // Upload up to 4 images for a specific color
    uploadColorImages: async (productId: number, formData: FormData): Promise<GalleryImage[]> => {
        const { data } = await axiosInstance.post(
            `/inventory/products/${productId}/upload_color_images/`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return data;
    },
};

// Gallery Images API
export const galleryImagesApi = {
    getAll: async (galleryId?: number): Promise<GalleryImage[]> => {
        const params = galleryId ? { gallery: galleryId } : {};
        const { data } = await axiosInstance.get('/inventory/images/', { params });
        return data;
    },

    getById: async (id: number): Promise<GalleryImage> => {
        const { data } = await axiosInstance.get(`/inventory/images/${id}/`);
        return data;
    },

    create: async (image: CreateGalleryImageDTO): Promise<GalleryImage> => {
        const formData = new FormData();
        formData.append('gallery', image.gallery.toString());
        formData.append('imageType', image.imageType);
        formData.append('image', image.image);
        if (image.alt_text) formData.append('alt_text', image.alt_text);

        const { data } = await axiosInstance.post('/inventory/images/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return data;
    },

    update: async ({ id, ...image }: UpdateGalleryImageDTO): Promise<GalleryImage> => {
        const { data } = await axiosInstance.put(`/inventory/images/${id}/`, image);
        return data;
    },

    delete: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/inventory/images/${id}/`);
    },
};

// Dashboard API
export const dashboardApi = {
    getOverview: async (period: 'day' | 'month' | 'year' = 'day'): Promise<DashboardOverview> => {
        const response = await axiosInstance.get(`/inventory/dashboard/overview/?period=${period}`);
        return response.data;
    },

    getStockAlerts: async () => {
        const response = await axiosInstance.get('/inventory/dashboard/stock-alerts/');
        return response.data;
    },

    getCategoryMetrics: async (): Promise<CategoryMetrics[]> => {
        const response = await axiosInstance.get('/inventory/dashboard/category-metrics/');
        return response.data;
    },

    getStockMovementAnalysis: async (period: 'day' | 'month' | 'year' = 'month'): Promise<StockMovementAnalysis> => {
        const response = await axiosInstance.get(`/inventory/dashboard/stock-movement-analysis/?period=${period}`);
        return response.data;
    }
}; 