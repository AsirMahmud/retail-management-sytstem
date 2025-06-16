export type PaymentMethod = 'cash' | 'card' | 'mobile_money' | 'credit' | 'mobile' | 'gift' | 'split';
export type SaleStatus = 'pending' | 'completed' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type ReturnStatus = 'pending' | 'approved' | 'rejected' | 'completed';

export interface SaleItem {
    id?: number;
    product_id: number;
    size: string;
    color: string;
    quantity: number;
    unit_price: number;
    discount: number;
    total?: number;
    created_at?: string;
}

export interface Sale {
    id?: number;
    invoice_number?: string;
    customer?: number | null;
    customer_phone: string | null;
    date?: string;
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    payment_method: PaymentMethod;
    status?: SaleStatus;
    notes?: string;
    created_at?: string;
    updated_at?: string;
    items: SaleItem[];
}

export interface Payment {
    id: number;
    sale: number;
    amount: number;
    payment_method: PaymentMethod;
    status: PaymentStatus;
    transaction_id: string;
    payment_date: string;
    notes: string;
    created_at: string;
}

export interface ReturnItem {
    id: number;
    return_order: number;
    sale_item: number;
    quantity: number;
    reason: string;
    created_at: string;
}

export interface Return {
    id: number;
    return_number: string;
    sale: number;
    reason: string;
    status: ReturnStatus;
    refund_amount: number;
    processed_date: string | null;
    created_at: string;
    updated_at: string;
    items: ReturnItem[];
}

export interface CustomerLookupResponse {
    exists: boolean;
    customer?: {
        id: number;
        name: string;
        phone: string;
        email: string;
    };
    message?: string;
}

export interface DashboardStats {
    today: {
        total_sales: number;
        total_transactions: number;
        total_profit: number;
    };
    monthly: {
        total_sales: number;
        total_transactions: number;
        total_profit: number;
    };
    top_products: Array<{
        product__name: string;
        total_quantity: number;
        total_revenue: number;
        total_profit: number;
    }>;
    sales_trend: Array<{
        sale__date__date: any;
        date__date: string;
        sales: number;
        profit: number;
        orders: number;
    }>;
    sales_distribution: Array<{
        product__category__name: string;
        value: number;
        profit: number;
    }>;
} 