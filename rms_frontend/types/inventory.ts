export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    parent?: number;
    product_count?: number;
    children?: Category[];
}

export interface Supplier {
    id: number;
    company_name: string;
    contact_person: string;
    email: string;
    phone: string;
    address: string;
    tax_number: string | null;
    website: string | null;
    payment_terms: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: number;
    name: string;
    sku: string;
    barcode?: string;
    description?: string;
    category?: {
        id: number;
        name: string;
        slug: string;
        description?: string;
        parent?: number;
    } | null;
    category_name?: string | null;
    supplier?: {
        id: number;
        company_name: string;
        contact_person: string;
        email: string;
        phone: string;
    } | null;
    supplier_name?: string | null;
    cost_price: string;
    selling_price: string;
    stock_quantity: number;
    minimum_stock: number;
    image?: string | null;
    is_active: boolean;
    variations?: ProductVariation[];
    images?: ProductImage[];
    total_stock?: number;
    created_at?: string;
    updated_at?: string;
}

export interface ProductVariation {
    id: number;
    product: number;
    size: string;
    color: string;
    stock: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface ProductImage {
    id: number;
    product: number;
    variation?: number;
    image_url: string;
    is_primary: boolean;
    created_at: string;
}

// DTOs for creating/updating
export interface CreateCategoryDTO {
    name: string;
    description?: string;
    parent?: number;
}

export type CreateSupplierDTO = Omit<Supplier, 'id' | 'created_at' | 'updated_at'>;
export type UpdateSupplierDTO = Partial<CreateSupplierDTO> & { id: number };

export interface CreateProductDTO {
    name: string;
    sku: string;
    barcode?: string;
    description?: string;
    category?: number;
    supplier?: number;
    cost_price: number;
    selling_price: number;
    stock_quantity: number;
    minimum_stock: number;
    image?: File;
    is_active: boolean;
    variations?: {
        size: string;
        color: string;
        stock: number;
    }[];
}

export interface CreateProductVariationDTO {
    product: number;
    variation_code: string;
    attributes: Record<string, string>;
    price_adjustment: number;
    stock_quantity: number;
    is_active: boolean;
}

export interface CreateProductImageDTO {
    product: number;
    variation?: number;
    image: File;
    is_primary: boolean;
}

// Update DTOs extend the Create DTOs with an id
export interface UpdateCategoryDTO extends Partial<CreateCategoryDTO> {
    id: number;
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {
    id: number;
}

export interface UpdateProductVariationDTO extends Partial<CreateProductVariationDTO> {
    id: number;
}

export interface UpdateProductImageDTO extends Partial<CreateProductImageDTO> {
    id: number;
}

export interface InventoryAlert {
    id: number;
    product: number;
    variation?: number;
    alert_type: 'LOW' | 'OUT' | 'EXP';
    message: string;
    is_active: boolean;
    created_at: string;
    resolved_at?: string;
}

export interface DashboardMetrics {
    total_products: number;
    active_products: number;
    low_stock_products: number;
    out_of_stock_products: number;
    total_inventory_value: number;
}

export interface StockMovements {
    total_in: number;
    total_out: number;
    total_adjustments: number;
}

export interface CategoryDistribution {
    name: string;
    product_count: number;
    total_value: number;
}

export interface MovementTrend {
    date: string;
    stock_in: number;
    stock_out: number;
}

export interface DashboardOverview {
    period: string;
    date_range: {
        start: string;
        end: string;
    };
    metrics: DashboardMetrics;
    stock_movements: StockMovements;
    category_distribution: CategoryDistribution[];
    recent_alerts: InventoryAlert[];
    movement_trends: MovementTrend[];
}

export interface CategoryMetrics {
    id: number;
    name: string;
    total_products: number;
    active_products: number;
    low_stock_products: number;
    total_value: number;
    avg_stock_level: number;
}

export interface StockMovementAnalysis {
    movement_trends: {
        period: string;
        stock_in: number;
        stock_out: number;
        adjustments: number;
    }[];
    top_products: {
        product__name: string;
        total_movement: number;
    }[];
} 