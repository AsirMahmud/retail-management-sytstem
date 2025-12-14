"use client"

import { create } from "zustand"
import { addItem as addItemToCart, removeItem as removeItemFromCart, updateQuantity as updateCartQuantity, clearCart as clearLocalCart, getCart, type CartItem } from "@/lib/cart"

type CartState = {
    items: CartItem[]
    totalItems: number
}

type CartActions = {
    addItem: (input: { productId: string; quantity?: number; variations?: Record<string, string>; productDetails?: any }) => void
    removeItem: (productId: string, variations?: Record<string, string>, productDetails?: any) => void
    updateQuantity: (productId: string, quantity: number, variations?: Record<string, string>, productDetails?: any) => void
    clearCart: () => void
    refreshFromStorage: () => void
}

import { sendGTMEvent } from "@/lib/gtm"

function computeTotalItems(items: CartItem[]): number {
    return items.reduce((sum, it) => sum + (Number.isFinite(it.quantity) ? it.quantity : 0), 0)
}

export const useCartStore = create<CartState & CartActions>((set, get) => ({
    items: [],
    totalItems: 0,

    refreshFromStorage: () => {
        const items = getCart()
        set({ items, totalItems: computeTotalItems(items) })
    },

    addItem: (input) => {
        addItemToCart(input)
        const items = getCart()
        set({ items, totalItems: computeTotalItems(items) })

        // GTM Event
        if (input.productDetails) {
            sendGTMEvent('add_to_cart', {
                currency: 'BDT',
                value: input.productDetails.price * (input.quantity || 1),
                items: [{
                    item_id: input.productId,
                    item_name: input.productDetails.name,
                    price: input.productDetails.price,
                    quantity: input.quantity || 1,
                    discount: input.productDetails.discount,
                    item_variant: input.variations ? Object.values(input.variations).join('-') : undefined
                }]
            })
        }
    },

    removeItem: (productId, variations, productDetails) => {
        // GTM Event
        if (productDetails) {
            sendGTMEvent('remove_from_cart', {
                currency: 'BDT',
                value: productDetails.price * (productDetails.quantity || 1),
                items: [{
                    item_id: productId,
                    item_name: productDetails.name,
                    price: productDetails.price,
                    quantity: productDetails.quantity || 1,
                    discount: productDetails.discount,
                    item_variant: variations ? Object.values(variations).join('-') : undefined
                }]
            })
        }

        removeItemFromCart(productId, variations)
        const items = getCart()
        set({ items, totalItems: computeTotalItems(items) })
    },

    updateQuantity: (productId, quantity, variations, productDetails) => {
        // GTM Event if removing
        if (quantity <= 0 && productDetails) {
            sendGTMEvent('remove_from_cart', {
                currency: 'BDT',
                value: productDetails.price * (productDetails.quantity || 1),
                items: [{
                    item_id: productId,
                    item_name: productDetails.name,
                    price: productDetails.price,
                    quantity: productDetails.quantity || 1, // The quantity being removed is the current quantity
                    discount: productDetails.discount,
                    item_variant: variations ? Object.values(variations).join('-') : undefined
                }]
            })
        }

        updateCartQuantity(productId, quantity, variations)
        const items = getCart()
        set({ items, totalItems: computeTotalItems(items) })
    },

    clearCart: () => {
        clearLocalCart()
        set({ items: [], totalItems: 0 })
    },
}))

// Initialize from storage on first client import and listen to cross-tab storage updates
if (typeof window !== "undefined") {
    // Eager init
    try {
        const items = getCart()
        useCartStore.setState({ items, totalItems: computeTotalItems(items) })
    } catch { /* noop */ }

    // Cross-tab sync
    window.addEventListener("storage", (e) => {
        if (e.key && e.key.includes("rms.cart.")) {
            try {
                const items = getCart()
                useCartStore.setState({ items, totalItems: computeTotalItems(items) })
            } catch { /* noop */ }
        }
    })
}










