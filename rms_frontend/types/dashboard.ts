export interface OnlinePreorderStatusBreakdown {
    PENDING: number;
    CONFIRMED: number;
    DELIVERED: number;
    COMPLETED: number;
    CANCELLED: number;
    [key: string]: number;
}

export interface DashboardStats {
    today: {
        sales: number;
        expenses: number;
        profit: number;
        online_preorders_count?: number;
        online_preorders_amount?: number;
    };
    monthly: {
        sales: number;
        expenses: number;
        profit: number;
    };
    counts: {
        customers: number;
        products: number;
        suppliers: number;
        online_preorders?: number;
    };
    online_preorders?: {
        today_count: number;
        today_amount: number;
        total_count: number;
        total_amount: number;
        today_status_breakdown: OnlinePreorderStatusBreakdown;
        status_breakdown: OnlinePreorderStatusBreakdown;
    };
    sales_trend: Array<{
        date__date: string;
        total: number;
    }>;
    expense_trend: Array<{
        date: string;
        amount: number;
    }>;
    top_products: Array<{
        name: string;
        total_sales: number;
    }>;
    expense_categories: Array<{
        name: string;
        amount: number;
    }>;
    low_stock_items: Array<{
        name: string;
        stock_quantity: number;
        minimum_stock: number;
    }>;
    recent_suppliers: Array<{
        name: string;
        phone: string;
        email: string;
        address: string;
    }>;
}