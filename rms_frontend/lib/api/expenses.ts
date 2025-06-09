import axiosInstance from "./axios-config";


export interface ExpenseCategory {
    id: number;
    name: string;
    color: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface Expense {
    id: number;
    description: string;
    amount: number;
    date: string;
    category: number;
    category_name: string;
    category_color: string;
    payment_method: 'CASH' | 'CARD' | 'BANK_TRANSFER' | 'MOBILE_BANKING' | 'OTHER';
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';
    reference_number: string;
    notes: string;
    receipt: string | null;
    created_at: string;
    updated_at: string;
}

export interface DashboardStats {
    today: {
        total_amount: number;
        total_count: number;
        pending_count: number;
        approved_count: number;
    };
    monthly: {
        total_amount: number;
        total_count: number;
        pending_count: number;
        approved_count: number;
    };
    category_distribution: Array<{
        category__name: string;
        category__color: string;
        total: number;
        count: number;
    }>;
    payment_distribution: Array<{
        payment_method: string;
        total: number;
        count: number;
    }>;
    recent_expenses: Expense[];
    monthly_trend: Array<{
        month: string;
        amount: number;
    }>;
}
let api = axiosInstance
export const expensesApi = {
    getExpenses: async (params?: {
        search?: string;
        category?: number;
        status?: string;
        payment_method?: string;
        start_date?: string;
        end_date?: string;
    }) => {
        const response = await api.get<Expense[]>("/expenses/expenses/", { params });
        return response.data;
    },

    getExpense: async (id: number) => {
        const response = await api.get<Expense>(`/expenses/expenses/${id}/`);
        return response.data;
    },

    createExpense: async (data: Omit<Expense, "id" | "created_at" | "updated_at">) => {
        const response = await api.post<Expense>("/expenses/expenses/", data);
        return response.data;
    },

    updateExpense: async (id: number, data: Partial<Expense>) => {
        const response = await api.patch<Expense>(`/expenses/expenses/${id}/`, data);
        return response.data;
    },

    deleteExpense: async (id: number) => {
        await api.delete(`/expenses/expenses/${id}/`);
    },

    approveExpense: async (id: number) => {
        const response = await api.post<Expense>(`/expenses/expenses/${id}/approve/`);
        return response.data;
    },

    rejectExpense: async (id: number) => {
        const response = await api.post<Expense>(`/expenses/expenses/${id}/reject/`);
        return response.data;
    },

    getCategories: async () => {
        const response = await api.get<ExpenseCategory[]>("/expenses/categories/");
        return response.data;
    },

    createCategory: async (data: Omit<ExpenseCategory, "id" | "created_at" | "updated_at">) => {
        const response = await api.post<ExpenseCategory>("/expenses/categories/", data);
        return response.data;
    },

    updateCategory: async (id: number, data: Partial<ExpenseCategory>) => {
        const response = await api.patch<ExpenseCategory>(`/expenses/categories/${id}/`, data);
        return response.data;
    },

    deleteCategory: async (id: number) => {
        await api.delete(`/expenses/categories/${id}/`);
    },

    getDashboardStats: async () => {
        const response = await api.get<DashboardStats>("/expenses/expenses/dashboard_stats/");
        return response.data;
    },
}; 