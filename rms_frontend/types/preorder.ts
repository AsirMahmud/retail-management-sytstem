export interface PreorderProduct {
    id: number;
    name: string;
    description: string;
    category?: {
        id: number;
        name: string;
    };
    supplier?: {
        id: number;
        company_name: string;
    };
    cost_price: number;
    selling_price: number;
    deposit_amount: number;
    expected_arrival_date: string;
    max_quantity: number;
    current_orders: number;
    image?: string;
    is_active: boolean;
    status: 'ACTIVE' | 'INACTIVE' | 'COMPLETED';
    size_type?: string;
    size_category?: string;
    gender: 'MALE' | 'FEMALE' | 'UNISEX';
    created_at: string;
    updated_at: string;
    available_quantity: number;
    is_available: boolean;
    variations: PreorderVariation[];
}

export interface PreorderVariation {
    id: number;
    preorder_product: number;
    size: string;
    color: string;
    color_hax: string;
    max_quantity: number;
    current_orders: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    available_quantity: number;
}

export interface Preorder {
    id: number;
    customer_name: string;
    customer_phone: string;
    customer_email: string;
    preorder_product: PreorderProduct;
    variation?: PreorderVariation;
    quantity: number;
    deposit_paid: number;
    total_amount: number;
    status: 'PENDING' | 'CONFIRMED' | 'DEPOSIT_PAID' | 'FULLY_PAID' | 'ARRIVED' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED';
    notes: string;
    expected_delivery_date?: string;
    created_at: string;
    updated_at: string;
    items: {
        product_id: number;
        size: string;
        color: string;
        quantity: number;
        unit_price: number;
        discount: number;
        variant_id?: number;
    }[];
}

export interface PreorderDashboard {
    id: number;
    name: string;
    total_orders: number;
    total_revenue: number;
    pending_orders: number;
    completed_orders: number;
}

export interface PreorderStats {
    total_orders: number;
    total_revenue: number;
    pending_orders: number;
    completed_orders: number;
    recent_orders: number;
    status_breakdown: Record<string, number>;
}

// DTOs for create and update operations
export interface CreatePreorderProductDTO {
    name: string;
    description?: string;
    category?: number;
    supplier?: number;
    cost_price: number;
    selling_price: number;
    deposit_amount?: number;
    expected_arrival_date: string;
    max_quantity?: number;
    size_type?: string;
    size_category?: string;
    gender?: 'MALE' | 'FEMALE' | 'UNISEX';
}

export interface UpdatePreorderProductDTO extends Partial<CreatePreorderProductDTO> {
    id: number;
}

export interface CreatePreorderVariationDTO {
    preorder_product: number;
    size: string;
    color: string;
    color_hax?: string;
    max_quantity?: number;
    is_active?: boolean;
}

export interface UpdatePreorderVariationDTO extends Partial<CreatePreorderVariationDTO> {
    id: number;
}

export interface CreatePreorderDTO {
    customer_name: string;
    customer_phone: string;
    customer_email?: string;
    preorder_product: number;
    deposit_paid?: number;
    total_amount: number;
    notes?: string;
    expected_delivery_date?: string;
    items: {
        product_id: number;
        size: string;
        color: string;
        quantity: number;
        unit_price: number;
        discount: number;
    }[];
}

export interface UpdatePreorderDTO extends Partial<CreatePreorderDTO> {
    id: number;
} 