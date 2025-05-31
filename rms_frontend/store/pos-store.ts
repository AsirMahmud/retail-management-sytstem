import { create } from 'zustand';
import { Customer, CreateCustomerData, createCustomer, searchCustomers } from '@/lib/api/customer';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types/inventory';
import { PaymentMethod } from '@/types/sales';

interface CartItem {
    id: number;
    productId: number;
    name: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
    image: string;
    discount?: {
        type: "percentage" | "fixed";
        value: number;
    };
}

interface POSState {
    // Customer related state
    showNewCustomerForm: boolean;
    setShowNewCustomerForm: (show: boolean) => void;
    newCustomer: CreateCustomerData;
    setNewCustomer: (customer: CreateCustomerData) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    searchResults: Customer[];
    setSearchResults: (results: Customer[]) => void;
    selectedCustomer: Customer | null;
    setSelectedCustomer: (customer: Customer | null) => void;
    handleSearch: (query: string) => Promise<void>;
    handleAddNewCustomer: () => Promise<void>;
    resetNewCustomer: () => void;

    // Cart related state
    cart: CartItem[];
    setCart: (cart: CartItem[]) => void;
    cartDiscount: { type: "percentage" | "fixed"; value: number } | null;
    setCartDiscount: (discount: { type: "percentage" | "fixed"; value: number } | null) => void;
    handleAddToCart: (product: Product, size: string, color: string) => void;
    handleUpdateQuantity: (itemId: number, change: number) => void;
    handleRemoveItem: (itemId: number) => void;
    handleClearCart: () => void;
    handleItemDiscount: (itemId: number, discountType: "percentage" | "fixed", discountValue: number) => void;
    handleRemoveItemDiscount: (itemId: number) => void;

    // Payment related state
    paymentMethod: PaymentMethod;
    setPaymentMethod: (method: PaymentMethod) => void;
    showSplitPayment: boolean;
    setShowSplitPayment: (show: boolean) => void;
    splitPayments: { method: PaymentMethod; amount: string }[];
    setSplitPayments: (payments: { method: PaymentMethod; amount: string }[]) => void;
    cashAmount: string;
    setCashAmount: (amount: string) => void;

    // UI state
    showCustomerSearch: boolean;
    setShowCustomerSearch: (show: boolean) => void;
    showDiscountModal: boolean;
    setShowDiscountModal: (show: boolean) => void;
    handleCompletePayment: () => void;
}

const initialNewCustomer: CreateCustomerData = {
    first_name: '',
    phone: '',

};

export const usePOSStore = create<POSState>((set, get) => ({
    // Customer related state
    showNewCustomerForm: false,
    setShowNewCustomerForm: (show) => set({ showNewCustomerForm: show }),

    newCustomer: initialNewCustomer,
    setNewCustomer: (customer) => set({ newCustomer: customer }),

    searchQuery: '',
    setSearchQuery: (query) => set({ searchQuery: query }),

    searchResults: [],
    setSearchResults: (results) => set({ searchResults: results }),

    selectedCustomer: null,
    setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),

    handleSearch: async (query) => {
        try {
            const results = await searchCustomers(query);
            set({ searchResults: results });
        } catch (error) {
            console.error('Error searching customers:', error);
            set({ searchResults: [] });
        }
    },

    handleAddNewCustomer: async () => {
        const { newCustomer } = get();
        try {
            const createdCustomer = await createCustomer(newCustomer);
            set({
                selectedCustomer: createdCustomer,
                showNewCustomerForm: false,
                newCustomer: initialNewCustomer
            });
            useToast().toast({
                title: "Success",
                description: "Customer added successfully",
            });
        } catch (error) {
            console.error('Error adding customer:', error);
            useToast().toast({
                title: "Error",
                description: "Failed to add customer",
                variant: "destructive",
            });
        }
    },

    resetNewCustomer: () => set({ newCustomer: initialNewCustomer }),

    // Cart related state
    cart: [],
    setCart: (cart) => set({ cart }),

    cartDiscount: null,
    setCartDiscount: (discount) => set({ cartDiscount: discount }),

    handleAddToCart: (product, size, color) => {
        console.log('Adding to cart:', { product, size, color });
        const { cart } = get();
        const existingItem = cart.find(
            item => item.productId === product.id && item.size === size && item.color === color
        );

        if (existingItem) {
            console.log('Updating existing item:', existingItem);
            const updatedCart = cart.map(item =>
                item.id === existingItem.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
            set({ cart: updatedCart });
        } else {
            console.log('Adding new item to cart');
            const newItem: CartItem = {
                id: Date.now(),
                productId: product.id,
                name: product.name,
                price: Number(product.selling_price),
                quantity: 1,
                size,
                color,
                image: product.image || '/placeholder.svg'
            };
            set({ cart: [...cart, newItem] });
        }
        console.log('Updated cart:', get().cart);
    },

    handleUpdateQuantity: (itemId, change) => {
        const { cart } = get();
        const updatedCart = cart.map(item => {
            if (item.id === itemId) {
                const newQuantity = Math.max(1, item.quantity + change);
                return { ...item, quantity: newQuantity };
            }
            return item;
        });
        set({ cart: updatedCart });
    },

    handleRemoveItem: (itemId) => {
        const { cart } = get();
        set({ cart: cart.filter(item => item.id !== itemId) });
    },

    handleClearCart: () => {
        set({ cart: [], cartDiscount: null });
    },

    handleItemDiscount: (itemId, discountType, discountValue) => {
        const { cart } = get();
        const updatedCart = cart.map(item => {
            if (item.id === itemId) {
                return {
                    ...item,
                    discount: { type: discountType, value: Number(discountValue) }
                };
            }
            return item;
        });
        set({ cart: updatedCart });
    },

    handleRemoveItemDiscount: (itemId) => {
        const { cart } = get();
        const updatedCart = cart.map(item => {
            if (item.id === itemId) {
                const { discount, ...rest } = item;
                return rest;
            }
            return item;
        });
        set({ cart: updatedCart });
    },

    // Payment related state
    paymentMethod: "cash",
    setPaymentMethod: (method) => set({ paymentMethod: method }),
    showSplitPayment: false,
    setShowSplitPayment: (show) => set({ showSplitPayment: show }),
    splitPayments: [
        { method: 'card' as PaymentMethod, amount: '' },
        { method: 'cash' as PaymentMethod, amount: '' }
    ],
    setSplitPayments: (payments) => set({ splitPayments: payments }),
    cashAmount: "",
    setCashAmount: (amount) => set({ cashAmount: amount }),

    // UI state
    showCustomerSearch: false,
    setShowCustomerSearch: (show) => set({ showCustomerSearch: show }),

    showDiscountModal: false,
    setShowDiscountModal: (show) => set({ showDiscountModal: show }),

    handleCompletePayment: () => {
        const { cart, selectedCustomer } = get();
        if (cart.length === 0) return;

        // TODO: Implement payment processing
        console.log('Processing payment for:', {
            items: cart,
            customer: selectedCustomer,
        });

        // Clear cart after successful payment
        set({ cart: [], cartDiscount: null });
        useToast().toast({
            title: "Success",
            description: "Payment processed successfully",
        });
    },
})); 