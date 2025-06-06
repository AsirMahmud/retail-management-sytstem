export interface DashboardStats {
    today: {
        total_sales: number;
        total_transactions: number;
        total_profit: number;
        total_loss: number;
        total_customers: number;
        average_transaction_value: number;
        total_discount: number;
    };
    monthly: {
        total_sales: number;
        total_transactions: number;
        total_profit: number;
    };
    inventory: {
        total_products: number;
        low_stock_items: number;
        out_of_stock_items: number;
    };
    stock_movements: {
        total_in: number;
        total_out: number;
    };
    top_products: Array<{
        product__name: string;
        total_quantity: number;
        total_revenue: number;
    }>;
    sales_trend: Array<{
        date__date: string;
        sales: number;
        profit: number;
    }>;
    sales_distribution: Array<{
        product__category__name: string;
        value: number;
        profit: number;
    }>;
    category_distribution: Array<{
        category__name: string;
        total_products: number;
    }>;
    recent_alerts: Array<{
        product__name: string;
        current_stock: number;
        alert_type: string;
    }>;
    movement_trends: Array<{
        date__date: string;
        stock_in: number;
        stock_out: number;
    }>;
    customer_analytics: {
        new_customers_today: number;
        active_customers_today: number;
        customer_retention_rate: number;
        top_customers: Array<{
            customer__name: string;
            customer__phone: string;
            total_spent: number;
            visit_count: number;
        }>;
    };
    payment_method_distribution: Array<{
        payment_method: string;
        total: number;
    }>;
    sales_by_hour: Array<{
        hour: number;
        total: number;
    }>;
} 