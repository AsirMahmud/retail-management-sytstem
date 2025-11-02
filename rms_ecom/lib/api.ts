// API configuration and functions for ecommerce frontend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Types
export interface ProductVariant {
  size: string;
  color: string;
  color_hex: string;
  stock: number;
  variant_id: number;
}

export interface EcommerceProduct {
  id: number;
  name: string;
  sku: string;
  description?: string;
  selling_price: number;
  original_price?: number;
  stock_quantity: number;
  discount?: number;
  image?: string;
  image_url?: string;
  online_category_name?: string;
  online_category_id?: number;
  available_colors: Array<{ name: string; hex: string }>;
  available_sizes: string[];
  variants: ProductVariant[];
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

// Public per-color listing entry
export interface ProductByColorEntry {
  product_id: number;
  product_name: string;
  product_price: string;
  color_name: string;
  color_slug: string;
  total_stock: number;
  cover_image_url?: string | null;
}

// Public per-color detail response
export interface ProductDetailByColorResponse {
  product: {
    id: number;
    name: string;
    price: string;
    category?: string | null;
  };
  color: {
    name: string;
    slug: string;
    hex?: string | null;
  };
  images: Array<{ type: string; url: string }>;
  sizes: Array<{ size: string; stock_qty: number; in_stock: boolean }>;
  available_colors: Array<{ color_name: string; color_slug: string; total_stock: number; color_hex?: string | null }>;
  total_stock_for_color: number;
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
  trending: {
    products: EcommerceProduct[];
    count: number;
  };
  online_category?: number;
}

export interface Discount {
  id: number;
  name: string;
  discount_type: string;
  value: number;
  description?: string;
  start_date: string;
  end_date: string;
  status: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// API Functions
export const ecommerceApi = {
  // Get all showcase data
  getShowcase: async (params?: {
    new_arrivals_limit?: number;
    top_selling_limit?: number;
    featured_limit?: number;
    trending_limit?: number;
    online_category?: number;
  }): Promise<ShowcaseResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.new_arrivals_limit) searchParams.set('new_arrivals_limit', params.new_arrivals_limit.toString());
    if (params?.top_selling_limit) searchParams.set('top_selling_limit', params.top_selling_limit.toString());
    if (params?.featured_limit) searchParams.set('featured_limit', params.featured_limit.toString());
    if (params?.trending_limit) searchParams.set('trending_limit', params.trending_limit.toString());
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

  // Public: Get flat products by color
  getProductsByColor: async (params?: {
    search?: string;
    category?: string; // category slug
    online_category?: string; // online category slug
    only_in_stock?: boolean;
    product_id?: number;
    product_ids?: number[];
  }): Promise<ProductByColorEntry[]> => {
    const searchParams = new URLSearchParams()
    if (params?.search) searchParams.set('search', params.search)
    if (params?.category) searchParams.set('category', params.category)
    if (params?.online_category) searchParams.set('online_category', params.online_category)
    if (typeof params?.only_in_stock !== 'undefined') searchParams.set('only_in_stock', String(params.only_in_stock))
    if (params?.product_id) searchParams.set('product_id', String(params.product_id))
    if (params?.product_ids && params.product_ids.length > 0) searchParams.set('product_ids', params.product_ids.join(','))
    const response = await fetch(`${API_BASE_URL}/ecommerce/public/products-by-color/?${searchParams}`)
    if (!response.ok) throw new Error('Failed to fetch products by color')
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

  // Public: Get product detail by color (color-scoped images and stock)
  getProductDetailByColor: async (productId: number, colorSlug: string): Promise<ProductDetailByColorResponse> => {
    const response = await fetch(`${API_BASE_URL}/ecommerce/public/product-details/${productId}/${colorSlug}/`)
    if (!response.ok) throw new Error('Failed to fetch product detail by color')
    return response.json()
  },

  // Get online categories
  getOnlineCategories: async (): Promise<Array<{ id: number; name: string; slug: string }>> => {
    const response = await fetch(`${API_BASE_URL}/inventory/online-categories/`);
    if (!response.ok) throw new Error('Failed to fetch online categories');
    return response.json();
  },
  
  // Get home page settings
  getHomePageSettings: async (): Promise<{
    logo_image_url?: string;
    logo_text?: string;
    hero_badge_text?: string;
    hero_heading_line1?: string;
    hero_heading_line2?: string;
    hero_heading_line3?: string;
    hero_heading_line4?: string;
    hero_heading_line5?: string;
    hero_description?: string;
    hero_primary_image_url?: string;
    hero_secondary_image_url?: string;
    stat_brands?: string;
    stat_products?: string;
    stat_customers?: string;
  }> => {
    const response = await fetch(`${API_BASE_URL}/ecommerce/public/home-page-settings/`);
    if (!response.ok) throw new Error('Failed to fetch home page settings');
    return response.json();
  },

  // Get brands
  getBrands: async (): Promise<Array<{
    id: number;
    name: string;
    logo_image?: string;
    logo_image_url?: string;
    logo_text?: string;
    website_url?: string;
  }>> => {
    const response = await fetch(`${API_BASE_URL}/ecommerce/public/brands/`);
    if (!response.ok) throw new Error('Failed to fetch brands');
    return response.json();
  },

  // Get active app-wide discounts
  getActiveAppWideDiscount: async (): Promise<Discount[]> => {
    const response = await fetch(`${API_BASE_URL}/ecommerce/discounts/active/?discount_type=APP_WIDE`);
    if (!response.ok) throw new Error('Failed to fetch active app-wide discounts');
    return response.json();
  },

  // Public: Get delivery settings
  getDeliverySettings: async (): Promise<{ inside_dhaka_charge: number; outside_dhaka_charge: number; updated_at: string }> => {
    const response = await fetch(`${API_BASE_URL}/ecommerce/public/delivery-settings/`)
    if (!response.ok) throw new Error('Failed to fetch delivery settings')
    return response.json()
  },

  // Public: Price cart items on the server
  priceCart: async (items: Array<{ productId: string | number; quantity: number; variations?: Record<string, string> }>): Promise<{
    items: Array<{ productId: number; name: string; image_url?: string | null; unit_price: number; quantity: number; line_total: number; max_stock?: number; variant?: { color?: string | null; size?: string | null } }>
    subtotal: number
    delivery: { inside_dhaka_charge: number; outside_dhaka_charge: number; updated_at: string }
  }> => {
    const response = await fetch(`${API_BASE_URL}/ecommerce/public/cart/price/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    })
    if (!response.ok) throw new Error('Failed to price cart')
    return response.json()
  },

  // Create Online Preorder (COD-only). Backend enforces COD and online type.
  createOnlinePreorder: async (payload: {
    customer_name: string;
    customer_phone: string;
    customer_email?: string;
    shipping_address?: Record<string, unknown>;
    notes?: string;
    items: Array<{
      product_id: number;
      size: string;
      color: string;
      quantity: number;
      unit_price: number;
      discount?: number;
    }>;
    expected_delivery_date?: string; // ISO date
  }): Promise<{ id: number } & Record<string, unknown>> => {
    const response = await fetch(`${API_BASE_URL}/preorder/orders/online/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!response.ok) throw new Error('Failed to create online preorder')
    return response.json()
  },
};
