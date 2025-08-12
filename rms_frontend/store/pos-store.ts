import { create } from 'zustand';
import { Customer, CreateCustomerData, createCustomer, searchCustomers, lookupCustomerByPhone } from '@/lib/api/customer';
import { Product } from '@/types/inventory';
import { PaymentMethod, SaleStatus } from '@/types/sales';
import { createSale } from '@/lib/api/sales';
import { Sale, SaleItem } from '@/types/sales';
import { toast } from '@/hooks/use-toast';

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
    currentSaleData: Partial<Sale> | null;
    setCurrentSaleData: (data: Partial<Sale> | null) => void;

    // UI state
    showCustomerSearch: boolean;
    setShowCustomerSearch: (show: boolean) => void;
    showDiscountModal: boolean;
    setShowDiscountModal: (show: boolean) => void;
    showReceiptModal: boolean;
    setShowReceiptModal: (show: boolean) => void;
    receiptData: {
        id: string;
        date: string;
        items: CartItem[];
        subtotal: number;
        itemDiscounts: number;
        globalDiscount: number;
        tax: number;
        total: number;
        paymentMethod: PaymentMethod;
        cashAmount: number | null;
        changeDue: number | null;
        customer: Customer | null;
        splitPayments: { method: PaymentMethod; amount: string }[] | null;
        isPaid: boolean;
    } | null;
    setReceiptData: (data: POSState['receiptData']) => void;
    handleCompletePayment: (toast: (props: { title: string; description: string; variant?: "default" | "destructive" }) => void, markAsDue?: boolean) => Promise<Sale | undefined>;
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
            const response = await searchCustomers(query);
            set({ searchResults: response.results || [] });
        } catch (error) {
            console.error('Error searching customers:', error);
            set({ searchResults: [] });
        }
    },

    handleAddNewCustomer: async () => {
        const { newCustomer } = get();
        try {
            // Check if customer exists by phone
            const existingCustomer = await lookupCustomerByPhone(newCustomer.phone);
            if (existingCustomer) {
                toast({
                    title: "Customer Already Exists",
                    description: "A customer with this phone number already exists.",
                    variant: "destructive",
                });
                return;
            }

            const createdCustomer = await createCustomer(newCustomer);
            set({
                selectedCustomer: createdCustomer,
                showNewCustomerForm: false,
                newCustomer: initialNewCustomer
            });
            toast({
                title: "Success",
                description: "Customer created successfully",
            });
        } catch (error) {
            console.error('Error adding customer:', error);
            toast({
                title: "Error",
                description: "Failed to create customer",
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
                // Apply discount to the item
                const discountAmount = discountType === "percentage" ? (item.price * item.quantity) * (discountValue / 100) : discountValue;
                const discountedTotal = (item.price * item.quantity) - discountAmount;
                console.log(`Applying discount: ${discountValue} of type: ${discountType} to item: ${itemId}`);
                return {
                    ...item,
                    discount: { type: discountType, value: Number(discountValue) },
                    total: discountedTotal
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
    splitPayments: [{ method: 'cash' as PaymentMethod, amount: '' }],
    setSplitPayments: (payments) => set({ splitPayments: payments }),
    cashAmount: "",
    setCashAmount: (amount) => set({ cashAmount: amount }),
    currentSaleData: null,
    setCurrentSaleData: (data) => set({ currentSaleData: data }),

    // UI state
    showCustomerSearch: false,
    setShowCustomerSearch: (show) => set({ showCustomerSearch: show }),
    showDiscountModal: false,
    setShowDiscountModal: (show) => set({ showDiscountModal: show }),
    showReceiptModal: false,
    setShowReceiptModal: (show) => set({ showReceiptModal: show }),
    receiptData: null,
    setReceiptData: (data) => set({ receiptData: data }),

    handleCompletePayment: async (toast, markAsDue = false) => {
        const { cart, selectedCustomer, paymentMethod, cashAmount, splitPayments, cartDiscount } = get();
        if (cart.length === 0) {
            toast({
                title: "Empty Cart",
                description: "Your cart is empty",
                variant: "destructive",
            });
            return;
        }

        try {
            // Calculate item totals and discounts
            const itemsWithDiscounts = cart.map(item => {
                const itemTotal = item.price * item.quantity;
                const itemDiscount = item.discount ? (item.discount.type === 'percentage' ?
                    itemTotal * (item.discount.value / 100) :
                    item.discount.value) : 0;
                const discountedTotal = itemTotal - itemDiscount;
                return {
                    ...item,
                    itemTotal,
                    itemDiscount,
                    discountedTotal
                };
            });

            // Calculate subtotal before any discounts
            const subtotalBeforeDiscount = itemsWithDiscounts.reduce((sum, item) => sum + item.itemTotal, 0);

            // Calculate total item discounts
            const totalItemDiscounts = itemsWithDiscounts.reduce((sum, item) => sum + item.itemDiscount, 0);

            // Calculate global discount (only from cartDiscount, not from item discounts)
            const globalDiscount = cartDiscount ? (cartDiscount.type === 'percentage' ?
                subtotalBeforeDiscount * (cartDiscount.value / 100) :
                cartDiscount.value) : 0;

            // Calculate final subtotal after all discounts
            const subtotal = subtotalBeforeDiscount - totalItemDiscounts - globalDiscount;

            // Remove tax calculation completely
            const tax = 0;
            const total = subtotal;

            // Prepare payment data for backend
            let paymentData: any[] = [];
            if (markAsDue) {
                // For due sales, don't send any payment data
                paymentData = [];
            } else if (paymentMethod === "split") {
                // For split payments, send the detailed payment breakdown
                paymentData = splitPayments
                    .filter(payment => payment.amount && parseFloat(payment.amount) > 0)
                    .map(payment => ({
                        method: payment.method,
                        amount: payment.amount,
                        notes: `Split payment - ${payment.method}`
                    }));
            } else if (paymentMethod === "cash") {
                // For cash payments, send the cash amount
                const cashAmountNum = parseFloat(cashAmount) || total;
                paymentData = [{
                    method: "cash",
                    amount: cashAmountNum.toString(),
                    notes: "Cash payment"
                }];
            } else if (["card", "mobile", "gift"].includes(paymentMethod)) {
                // For card, mobile, and gift payments, send the full amount
                paymentData = [{
                    method: paymentMethod,
                    amount: total.toString(),
                    notes: `${paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)} payment`
                }];
            }

            // Create sale data
            const saleData: Partial<Sale> = {
                customer: selectedCustomer?.id,
                customer_phone: selectedCustomer?.phone,
                subtotal: subtotalBeforeDiscount,
                tax,
                discount: globalDiscount, // Only global discount, not item discounts
                total,
                payment_method: markAsDue ? "credit" : paymentMethod,
                // Include payment_data for all non-due sales
                ...(markAsDue ? { payment_data: [] } : { payment_data: paymentData }),
                items: itemsWithDiscounts.map(item => ({
                    product_id: item.productId,
                    size: item.size,
                    color: item.color,
                    quantity: item.quantity,
                    unit_price: item.price,
                    discount: item.itemDiscount, // Item-level discount
                    total: item.discountedTotal
                }))
            };

            // Create sale through API
            const sale = await createSale(saleData);

            if (!sale.id) {
                throw new Error('Sale ID not returned from API');
            }

            // Create receipt data for UI
            const receipt = {
                id: `INV-${Math.floor(100000 + Math.random() * 900000)}`,
                date: new Date().toISOString(),
                items: itemsWithDiscounts,
                subtotal: subtotalBeforeDiscount,
                discountedSubtotal: subtotalBeforeDiscount - totalItemDiscounts, // Add missing discountedSubtotal
                itemDiscounts: totalItemDiscounts,
                globalDiscount: globalDiscount,
                tax,
                total,
                paymentMethod: markAsDue ? "credit" : paymentMethod,
                cashAmount: paymentMethod === "cash" && !markAsDue ? Number.parseFloat(cashAmount) : null,
                changeDue: paymentMethod === "cash" && !markAsDue ? Number.parseFloat(cashAmount) - total : null,
                customer: selectedCustomer,
                splitPayments: paymentMethod === "split" && !markAsDue ? splitPayments : null,
                storeCredit: 0, // Add missing storeCredit field
                isPaid: !markAsDue,
                isDue: markAsDue,
            };

            // Set receipt data and show modal
            set({ receiptData: receipt, showReceiptModal: true });

            // Clear cart after successful payment
            set({ cart: [], cartDiscount: null });

            toast({
                title: markAsDue ? "Sale Created as Due" : "Success",
                description: markAsDue ? "Sale created with pending payment" : "Payment processed successfully",
            });

            return sale;
        } catch (error) {
            console.error('Error processing payment:', error);
            const errorMessage = error instanceof Error ? error.message : "Failed to process payment";
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
            throw error;
        }
    },
})); 