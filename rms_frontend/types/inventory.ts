export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    parent?: number;
    product_count?: number;
    products_count?: number;
    total_value?: number;
    is_active?: boolean;
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
    products_count?: number;
    total_value?: number;
}

export interface Product {
    id: number;
    name: string;
    sku: string;
    barcode?: string;
    description?: string;
    category?: Category;
    supplier?: Supplier;
    cost_price: number;
    selling_price: number;
    stock_quantity: number;
    minimum_stock: number;
    image?: string;
    is_active: boolean;
    size_type?: string;
    size_category?: string;
    gender?: string;
    created_at: string;
    updated_at: string;
    variations?: ProductVariation[];
    images?: ProductImage[];
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
    barcode?: string;
    description?: string;
    category?: number;
    supplier?: number;
    cost_price: number;
    selling_price: number;
    stock_quantity?: number;
    minimum_stock: number;
    image?: File;
    is_active: boolean;
    size_type?: string;
    gender?: string;
    variations?: {
        size: string;
        color: string;
        color_hax?: string;
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
    out_of_stock_products: number;
    low_stock_products: number;
    total_inventory_value: number;
    stock_in: number;
    stock_out: number;
    stock_health: {
        healthy: number;
        low: number;
        out: number;
    };
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

export interface StockMovement {
    id: number;
    product: Product;
    movement_type: 'IN' | 'OUT' | 'ADJ';
    quantity: number;
    created_at: string;
}

export interface SupplierMetrics {
    company_name: string;
    total_products: number;
    total_value: number;
    low_stock_count: number;
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
    top_selling_products: Product[];
    recent_movements: StockMovement[];
    supplier_metrics: SupplierMetrics[];
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
    daily_movements: {
        date: string;
        stock_in: number;
        stock_out: number;
    }[];
    category_movements: {
        product__category__name: string;
        stock_in: number;
        stock_out: number;
    }[];
} 