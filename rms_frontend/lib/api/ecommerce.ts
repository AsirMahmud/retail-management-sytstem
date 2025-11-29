import axiosInstance from './axios-config';

// Types
export interface Discount {
  id: number;
  name: string;
  discount_type: 'APP_WIDE' | 'CATEGORY' | 'PRODUCT';
  value: number;
  start_date: string;
  end_date: string;
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
  description: string;
  is_active: boolean;
  category?: number;
  online_category?: number;
  product?: number;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: number;
  name: string;
  logo_image?: string;
  logo_image_url?: string;
  logo_text?: string;
  website_url?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HomePageSettings {
  id: number;
  logo_image?: string;
  logo_image_url?: string;
  logo_text?: string;
  footer_tagline?: string;
  footer_address?: string;
  footer_phone?: string;
  footer_email?: string;
  footer_facebook_url?: string;
  footer_instagram_url?: string;
  footer_twitter_url?: string;
  footer_github_url?: string;
  footer_map_embed_url?: string;
  hero_badge_text: string;
  hero_heading_line1: string;
  hero_heading_line2?: string;
  hero_heading_line3?: string;
  hero_heading_line4?: string;
  hero_heading_line5?: string;
  hero_description: string;
  hero_primary_image?: string;
  hero_primary_image_url?: string;
  hero_secondary_image?: string;
  hero_secondary_image_url?: string;
  stat_brands: string;
  stat_products: string;
  stat_customers: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDiscountDTO {
  name: string;
  discount_type: 'APP_WIDE' | 'CATEGORY' | 'PRODUCT';
  value: number;
  start_date: string;
  end_date: string;
  description?: string;
  is_active?: boolean;
  status?: 'ACTIVE' | 'INACTIVE';
  category?: number;
  online_category?: number;
  product?: number;
}

export interface UpdateDiscountDTO {
  id: number;
  name?: string;
  discount_type?: 'APP_WIDE' | 'CATEGORY' | 'PRODUCT';
  value?: number;
  start_date?: string;
  end_date?: string;
  description?: string;
  is_active?: boolean;
  status?: 'ACTIVE' | 'INACTIVE';
  category?: number;
  online_category?: number;
  product?: number;
}

export interface CreateBrandDTO {
  name: string;
  logo_image?: File;
  logo_text?: string;
  website_url?: string;
  display_order?: number;
  is_active?: boolean;
}

export interface UpdateBrandDTO {
  id: number;
  name?: string;
  logo_image?: File;
  logo_text?: string;
  website_url?: string;
  display_order?: number;
  is_active?: boolean;
}

export interface UpdateHomePageSettingsDTO {
  logo_image?: File;
  logo_text?: string;
  footer_tagline?: string;
  footer_address?: string;
  footer_phone?: string;
  footer_email?: string;
  footer_facebook_url?: string;
  footer_instagram_url?: string;
  footer_twitter_url?: string;
  footer_github_url?: string;
  footer_map_embed_url?: string;
  hero_badge_text?: string;
  hero_heading_line1?: string;
  hero_heading_line2?: string;
  hero_heading_line3?: string;
  hero_heading_line4?: string;
  hero_heading_line5?: string;
  hero_description?: string;
  hero_primary_image?: File;
  hero_secondary_image?: File;
  stat_brands?: string;
  stat_products?: string;
  stat_customers?: string;
}

// Discounts API
export const discountsApi = {
  getAll: async (): Promise<Discount[]> => {
    const { data } = await axiosInstance.get('/ecommerce/discounts/');
    return data.results || data;
  },

  getById: async (id: number): Promise<Discount> => {
    const { data } = await axiosInstance.get(`/ecommerce/discounts/${id}/`);
    return data;
  },

  create: async (discount: CreateDiscountDTO): Promise<Discount> => {
    const { data } = await axiosInstance.post('/ecommerce/discounts/', discount);
    return data;
  },

  update: async ({ id, ...discount }: UpdateDiscountDTO): Promise<Discount> => {
    const { data } = await axiosInstance.patch(`/ecommerce/discounts/${id}/`, discount);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/ecommerce/discounts/${id}/`);
  },
};

// Brands API
export const brandsApi = {
  getAll: async (): Promise<Brand[]> => {
    const { data } = await axiosInstance.get('/ecommerce/brands/');
    return data.results || data;
  },

  getById: async (id: number): Promise<Brand> => {
    const { data } = await axiosInstance.get(`/ecommerce/brands/${id}/`);
    return data;
  },

  create: async (brand: CreateBrandDTO): Promise<Brand> => {
    const formData = new FormData();
    formData.append('name', brand.name);
    if (brand.logo_image) formData.append('logo_image', brand.logo_image);
    if (brand.logo_text) formData.append('logo_text', brand.logo_text);
    if (brand.website_url) formData.append('website_url', brand.website_url);
    if (brand.display_order) formData.append('display_order', brand.display_order.toString());
    if (brand.is_active !== undefined) formData.append('is_active', brand.is_active.toString());

    const { data } = await axiosInstance.post('/ecommerce/brands/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  update: async ({ id, ...brand }: UpdateBrandDTO): Promise<Brand> => {
    const formData = new FormData();
    if (brand.name) formData.append('name', brand.name);
    if (brand.logo_image) formData.append('logo_image', brand.logo_image);
    if (brand.logo_text) formData.append('logo_text', brand.logo_text);
    if (brand.website_url) formData.append('website_url', brand.website_url);
    if (brand.display_order !== undefined) formData.append('display_order', brand.display_order.toString());
    if (brand.is_active !== undefined) formData.append('is_active', brand.is_active.toString());

    const { data } = await axiosInstance.patch(`/ecommerce/brands/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/ecommerce/brands/${id}/`);
  },
};

// Home Page Settings API
export const homePageSettingsApi = {
  get: async (): Promise<HomePageSettings> => {
    const { data } = await axiosInstance.get('/ecommerce/home-page-settings/');
    return data;
  },

  update: async (settings: FormData): Promise<HomePageSettings> => {
    const { data } = await axiosInstance.patch('/ecommerce/home-page-settings/1/', settings, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};

// Product Ecommerce Status API
export const productEcommerceApi = {
  updateStatus: async (productId: number, status: {
    is_new_arrival?: boolean;
    is_trending?: boolean;
    is_featured?: boolean;
  }): Promise<any> => {
    const { data } = await axiosInstance.patch(`/inventory/products/${productId}/update_ecommerce_status/`, status);
    return data;
  },
};
