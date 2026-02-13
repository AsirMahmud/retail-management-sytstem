import axios from './axios-config';
import { DateRange } from 'react-day-picker';

export interface ReportDateRange {
    date_from: string;
    date_to: string;
}

export interface SalesReport {
    total_sales: string;
    total_orders: number;
    total_items_sold: number;
    average_order_value: string;
    average_item_price: string;
    sales_by_date: Array<{
        date: string;
        total: string;
        items_count: number;
    }>;
    sales_by_category: Array<{
        category_name: string;
        total: string;
        items_count: number;
        quantity_sold: number;
    }>;
    top_products: Array<{
        product_name: string;
        category_name: string;
        total_sales: string;
        quantity_sold: number;
        average_price: string;
        profit: string;
    }>;
    payment_methods: Array<{
        payment_method: string;
        total: string;
        orders_count: number;
        items_count: number;
    }>;
}

export interface ExpenseReport {
    total_expenses: string;
    expenses_by_category: Array<{
        category_name: string;
        total: string;
        count: number;
    }>;
    expenses_by_date: Array<{
        date: string;
        total: string;
        count: number;
    }>;
}

export interface InventoryReport {
    total_products: number;
    total_stock_value: string;
    low_stock_items: Array<{
        name: string;
        stock: number;
        reorder_level: number;
        price: string;
    }>;
    stock_by_category: Array<{
        category_name: string;
        total_products: number;
        total_stock: number;
        total_value: string;
    }>;
    stock_movements: Array<{
        date: string;
        movement_type: string;
        total_quantity: number;
        total_value: string;
    }>;
}

export interface CustomerReport {
    total_customers: number;
    new_customers: number;
    total_sales: string;
    average_customer_value: string;
    top_customers: Array<{
        first_name: string;
        last_name: string;
        phone: string;
        total_sales: string;
        items_purchased: number;
        unique_products: number;
        last_purchase_date: string;
    }>;
    customer_acquisition: Array<{
        date: string;
        new_customers: number;
    }>;
}

export interface CategoryReport {
    total_categories: number;
    total_products: number;
    sales_by_category: Array<{
        category_name: string;
        total_sales: string;
        items_sold: number;
        unique_products: number;
    }>;
    stock_by_category: Array<{
        category_name: string;
        total_products: number;
        total_stock: number;
        total_value: string;
    }>;
    top_categories: Array<{
        name: string;
        total_sales: string;
        items_sold: number;
        product_count: number;
        average_price: string;
    }>;
}

export interface ProfitLossReport {
    total_revenue: string;
    total_expenses: string;
    net_profit: string;
    profit_margin: string;
    revenue_by_date: Array<{
        date: string;
        revenue: string;
        items_sold: number;
    }>;
    expenses_by_date: Array<{
        total: any;
        date: string;
        amount: string;
        count: number;
    }>;
    profit_by_category: Array<{
        category_name: string;
        revenue: string;
        cost: string;
        profit: string;
        items_sold: number;
    }>;
    revenue_vs_expense_by_date: Array<{
        date: string;
        revenue: string;
        expense: string;
    }>;
    expenses_over_time: Array<{
        date: string;
        amount: string;
    }>;
}

export interface ProductPerformanceReport {
    total_products: number;
    total_sales: string;
    total_profit: string;
    average_profit_margin: string;
    average_profit: string;
    average_selling_price_with_discount: string;
    top_performing_products: Array<{
        product_id: number;
        product_name: string;
        category_name: string;
        total_sales: string;
        quantity_sold: number;
        total_profit: string;
        profit_margin: string;
        average_price: string;
        average_profit: string;
        average_selling_price_with_discount: string;
    }>;
    low_performing_products: Array<{
        product_id: number;
        product_name: string;
        category_name: string;
        total_sales: string;
        quantity_sold: number;
        total_profit: string;
        profit_margin: string;
        average_price: string;
        average_profit: string;
        average_selling_price_with_discount: string;
    }>;
    sales_by_product: Array<{
        product_id: number;
        product_name: string;
        total_sales: string;
        quantity_sold: number;
        average_price: string;
        average_selling_price_with_discount: string;
    }>;
    profit_by_product: Array<{
        product_id: number;
        product_name: string;
        total_profit: string;
        profit_margin: string;
        quantity_sold: number;
        average_profit: string;
    }>;
}

export interface OverviewReport {
    total_sales: string;
    total_orders: number;
    total_expenses: string;
    net_profit: string;
    profit_margin: string;
    sales_by_date: Array<{
        date: string;
        total: string;
    }>;
    expenses_by_date: Array<{
        date: string;
        total: string;
    }>;
}

export interface OnlinePreorderAnalytics {
    total_orders: number;
    total_sales_count: number;
    total_revenue: string;
    total_profit: string;
    average_order_value: string;
    top_products: Array<{
        product_id: number;
        product_name: string;
        category_name: string;
        total_sales: string;
        quantity_sold: number;
        total_profit: string;
    }>;
    top_categories: Array<{
        category_name: string;
        total_sales: string;
        quantity_sold: number;
        total_profit: string;
        order_count: number;
    }>;
    sales_by_date: Array<{
        date: string;
        total: string;
        orders_count: number;
    }>;
    status_breakdown: Record<string, number>;
}

export const formatDateRange = (dateRange: DateRange | undefined): ReportDateRange | null => {
    if (!dateRange?.from) return null;
    return {
        date_from: dateRange.from.toISOString().split('T')[0],
        date_to: (dateRange.to || dateRange.from).toISOString().split('T')[0],
    };
};

export const reportsApi = {
    getSalesReport: async (dateRange: ReportDateRange): Promise<SalesReport> => {
        const response = await axios.get('/reports/sales/', { params: dateRange });
        return response.data;
    },

    getExpenseReport: async (dateRange: ReportDateRange): Promise<ExpenseReport> => {
        const response = await axios.get('/reports/expenses/', { params: dateRange });
        return response.data;
    },

    getInventoryReport: async (): Promise<InventoryReport> => {
        const response = await axios.get('/reports/inventory/');
        return response.data;
    },

    getCustomerReport: async (dateRange: ReportDateRange): Promise<CustomerReport> => {
        const response = await axios.get('/reports/customers/', { params: dateRange });
        return response.data;
    },

    getCategoryReport: async (): Promise<CategoryReport> => {
        const response = await axios.get('/reports/categories/');
        return response.data;
    },

    getProfitLossReport: async (dateRange: ReportDateRange): Promise<ProfitLossReport> => {
        const response = await axios.get('/reports/profit-loss/', { params: dateRange });
        return response.data;
    },

    getProductPerformanceReport: async (dateRange: ReportDateRange): Promise<ProductPerformanceReport> => {
        const response = await axios.get('/reports/product-performance/', { params: dateRange });
        return response.data;
    },

    getOverviewReport: async (dateRange: ReportDateRange): Promise<OverviewReport> => {
        const response = await axios.get('/reports/overview/', { params: dateRange });
        return response.data;
    },

    getOnlinePreorderAnalytics: async (dateRange: ReportDateRange): Promise<OnlinePreorderAnalytics> => {
        const response = await axios.get('/reports/online-preorder-analytics/', { params: dateRange });
        return response.data;
    },
}; 