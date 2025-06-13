import axios from './axios-config';
import { DateRange } from 'react-day-picker';

export interface ReportDateRange {
    date_from: string;
    date_to: string;
}

export interface SalesReport {
    total_sales: number;
    total_orders: number;
    total_items_sold: number;
    average_order_value: number;
    average_item_price: number;
    sales_by_date: Array<{
        date: string;
        total: number;
        items_count: number;
    }>;
    sales_by_category: Array<{
        category_name: string;
        total: number;
        items_count: number;
        quantity_sold: number;
    }>;
    top_products: Array<{
        product_name: string;
        category_name: string;
        total_sales: number;
        quantity_sold: number;
        average_price: number;
        profit: number;
    }>;
    payment_methods: Array<{
        payment_method: string;
        total: number;
        orders_count: number;
        items_count: number;
    }>;
}

export interface ExpenseReport {
    total_expenses: number;
    expenses_by_category: Array<{
        category_name: string;
        total: number;
        count: number;
    }>;
    expenses_by_date: Array<{
        date: string;
        total: number;
        count: number;
    }>;
    payment_methods: Array<{
        payment_method: string;
        total: number;
        count: number;
    }>;
}

export interface InventoryReport {
    total_products: number;
    total_stock_value: number;
    low_stock_items: Array<{
        name: string;
        stock: number;
        reorder_level: number;
        price: number;
    }>;
    stock_by_category: Array<{
        category_name: string;
        total_products: number;
        total_stock: number;
        total_value: number;
    }>;
    stock_movements: Array<{
        date: string;
        movement_type: string;
        total_quantity: number;
        total_value: number;
    }>;
}

export interface CustomerReport {
    total_customers: number;
    new_customers: number;
    total_sales: number;
    average_customer_value: number;
    top_customers: Array<{
        first_name: string;
        last_name: string;
        phone: string;
        total_sales: number;
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
        total_sales: number;
        items_sold: number;
        quantity_sold: number;
        unique_products: number;
    }>;
    stock_by_category: Array<{
        category_name: string;
        total_products: number;
        total_stock: number;
        total_value: number;
    }>;
    top_categories: Array<{
        name: string;
        total_sales: number;
        items_sold: number;
        product_count: number;
        average_price: number;
    }>;
}

export interface ProfitLossReport {
    total_revenue: number;
    total_expenses: number;
    net_profit: number;
    profit_margin: number;
    revenue_by_date: Array<{
        date: string;
        revenue: number;
        items_sold: number;
    }>;
    expenses_by_date: Array<{
        date: string;
        amount: number;
        count: number;
    }>;
    profit_by_category: Array<{
        category_name: string;
        revenue: number;
        cost: number;
        profit: number;
        items_sold: number;
    }>;
}

export interface ProductPerformanceReport {
    total_products: number;
    total_sales: number;
    total_profit: number;
    average_profit_margin: number;
    top_performing_products: Array<{
        product_name: string;
        category_name: string;
        total_sales: number;
        quantity_sold: number;
        total_profit: number;
        profit_margin: number;
        average_price: number;
    }>;
    low_performing_products: Array<{
        product_name: string;
        category_name: string;
        total_sales: number;
        quantity_sold: number;
        total_profit: number;
        profit_margin: number;
        average_price: number;
    }>;
    sales_by_product: Array<{
        product_name: string;
        total_sales: number;
        quantity_sold: number;
        average_price: number;
    }>;
    profit_by_product: Array<{
        product_name: string;
        total_profit: number;
        profit_margin: number;
        quantity_sold: number;
    }>;
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
}; 