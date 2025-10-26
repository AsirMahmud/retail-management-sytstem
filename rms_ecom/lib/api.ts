// API configuration and functions for ecommerce frontend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://rawstitch.info/v2/api';

// Types
export interface EcommerceProduct {
  id: number;
  name: string;
  sku: string;
  description?: string;
  selling_price: number;
  stock_quantity: number;
  image?: string;
  image_url?: string;
  online_category_name?: string;
  available_colors: Array<{ name: string; hex: string }>;
  available_sizes: string[];
  primary_image?: string;
  images_ordered: string[];
  created_at: string;
  updated_at: string;
}

export interface EcommerceProductDetail extends EcommerceProduct {
  images: string[];
  images_ordered: string[];
  material_composition: Array<{ name: string; percentage: string }>;
  who_is_this_for: Array<{ title: string; description: string }>;
  features: Array<{ title: string; description: string }>;
  size_chart: Array<{
    size: string;
    chest: string;
    waist: string;
    height: string;
  }>;
}

export interface ShowcaseResponse {
  new_arrivals: {
    products: EcommerceProduct[];
    count: number;
  };
  top_selling: {
    products: EcommerceProduct[];
    count: number;
  };
  featured: {
    products: EcommerceProduct[];
    count: number;
  };
  online_category?: number;
}

// API Functions
export const ecommerceApi = {
  // Get all showcase data
  getShowcase: async (params?: {
    new_arrivals_limit?: number;
    top_selling_limit?: number;
    featured_limit?: number;
    online_category?: number;
  }): Promise<ShowcaseResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.new_arrivals_limit) searchParams.set('new_arrivals_limit', params.new_arrivals_limit.toString());
    if (params?.top_selling_limit) searchParams.set('top_selling_limit', params.top_selling_limit.toString());
    if (params?.featured_limit) searchParams.set('featured_limit', params.featured_limit.toString());
    if (params?.online_category) searchParams.set('online_category', params.online_category.toString());

    const response = await fetch(`${API_BASE_URL}/inventory/products/showcase/?${searchParams}`);
    if (!response.ok) throw new Error('Failed to fetch showcase data');
    return response.json();
  },

  // Get all online products (optionally by online_category)
  getAllProducts: async (params?: { online_category?: number }): Promise<{ products: EcommerceProduct[]; count: number }> => {
    const searchParams = new URLSearchParams()
    if (params?.online_category) searchParams.set('online_category', params.online_category.toString())
    const response = await fetch(`${API_BASE_URL}/inventory/products/all_online/?${searchParams}`)
    if (!response.ok) throw new Error('Failed to fetch all products')
    return response.json()
  },

  // Get new arrivals
  getNewArrivals: async (params?: {
    limit?: number;
    online_category?: number;
  }): Promise<{ products: EcommerceProduct[]; count: number; online_category?: number }> => {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.online_category) searchParams.set('online_category', params.online_category.toString());

    const response = await fetch(`${API_BASE_URL}/inventory/products/new_arrivals/?${searchParams}`);
    if (!response.ok) throw new Error('Failed to fetch new arrivals');
    return response.json();
  },

  // Get top selling products
  getTopSelling: async (params?: {
    limit?: number;
    online_category?: number;
    days?: number;
  }): Promise<{ products: EcommerceProduct[]; count: number; online_category?: number; period_days: number }> => {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.online_category) searchParams.set('online_category', params.online_category.toString());
    if (params?.days) searchParams.set('days', params.days.toString());

    const response = await fetch(`${API_BASE_URL}/inventory/products/top_selling/?${searchParams}`);
    if (!response.ok) throw new Error('Failed to fetch top selling products');
    return response.json();
  },

  // Get featured products
  getFeatured: async (params?: {
    limit?: number;
    online_category?: number;
  }): Promise<{ products: EcommerceProduct[]; count: number; online_category?: number }> => {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.online_category) searchParams.set('online_category', params.online_category.toString());

    const response = await fetch(`${API_BASE_URL}/inventory/products/featured/?${searchParams}`);
    if (!response.ok) throw new Error('Failed to fetch featured products');
    return response.json();
  },

  // Get product details
  getProductDetail: async (id: number): Promise<{
    product: EcommerceProductDetail;
    related_products: EcommerceProduct[];
    related_count: number;
  }> => {
    const response = await fetch(`${API_BASE_URL}/inventory/products/${id}/showcase_detail/`);
    if (!response.ok) throw new Error('Failed to fetch product details');
    return response.json();
  },

  // Get online categories
  getOnlineCategories: async (): Promise<Array<{ id: number; name: string; slug: string }>> => {
    const response = await fetch(`${API_BASE_URL}/inventory/online-categories/`);
    if (!response.ok) throw new Error('Failed to fetch online categories');
    return response.json();
  },
};
