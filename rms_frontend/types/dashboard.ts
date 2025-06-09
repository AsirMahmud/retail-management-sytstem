export interface DashboardStats {
    today: {
        sales: number;
        expenses: number;
        profit: number;
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