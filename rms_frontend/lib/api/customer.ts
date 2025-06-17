import axiosInstance from "./axios-config";

export interface PurchaseHistoryItem {
    name: string;
    size: string;
    price: string;
    quantity: number;
}

export interface PurchaseHistory {
    id: number;
    date: string;
    total_amount: string;
    status: string;
    payment_method: string;
    sales_person: string;
    items: PurchaseHistoryItem[];
}

export interface Customer {
    id: number;
    first_name: string;
    last_name: string;
    email: string | null;
    phone: string;
    address: string | null;
    gender: string | null;
    date_of_birth: string | null;
    created_at: string;
    updated_at: string;
    is_active: boolean;
    total_sales: number;
    sales_count: number;
    last_sale_date: string | null;
    purchase_history: PurchaseHistory[];
}

export interface CreateCustomerData {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone: string;
    address?: string;
    gender?: string;
    date_of_birth?: string;
}

export interface UpdateCustomerData extends Partial<CreateCustomerData> { }

// Get all customers
export const getCustomers = async (): Promise<Customer[]> => {
    const response = await axiosInstance.get('/customer/customers/');
    return response.data;
};

// Get active customers
export const getActiveCustomers = async (): Promise<Customer[]> => {
    const response = await axiosInstance.get('/customer/customers/active_customers/');
    return response.data;
};

// Get customer by ID
export const getCustomer = async (id: number): Promise<Customer> => {
    const response = await axiosInstance.get(`/customer/customers/${id}/`);
    return response.data;
};

// Create new customer
export const createCustomer = async (data: CreateCustomerData): Promise<Customer> => {
    const response = await axiosInstance.post('/customer/customers/', data);
    return response.data;
};

// Update customer
export const updateCustomer = async (id: number, data: UpdateCustomerData): Promise<Customer> => {
    const response = await axiosInstance.patch(`/customer/customers/${id}/`, data);
    return response.data;
};

// Delete customer (soft delete)
export const deleteCustomer = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/customer/customers/${id}/`);
};

// Search customers
export const searchCustomers = async (query: string): Promise<Customer[]> => {
    const response = await axiosInstance.get('/customer/customers/', {
        params: { search: query }
    });
    return response.data;
};

// Lookup customer by phone
export const lookupCustomerByPhone = async (phone: string): Promise<Customer | null> => {
    try {
        const response = await axiosInstance.get('/customer/customers/', {
            params: { search: phone }
        });
        const customers = response.data;
        return customers.find((customer: Customer) => customer.phone === phone) || null;
    } catch (error) {
        console.error('Error looking up customer:', error);
        return null;
    }
};

// Delete all customers
export const deleteAllCustomers = async (): Promise<void> => {
    await axiosInstance.delete('/settings/flush-database/?database_type=customers')
};