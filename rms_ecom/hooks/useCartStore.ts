"use client"

import { create } from "zustand"
import { addItem as addItemToCart, removeItem as removeItemFromCart, updateQuantity as updateCartQuantity, clearCart as clearLocalCart, getCart, type CartItem } from "@/lib/cart"

type CartState = {
    items: CartItem[]
    totalItems: number
}

type CartActions = {
    addItem: (input: { productId: string; quantity?: number; variations?: Record<string, string> }) => void
    removeItem: (productId: string, variations?: Record<string, string>) => void
    updateQuantity: (productId: string, quantity: number, variations?: Record<string, string>) => void
    clearCart: () => void
    refreshFromStorage: () => void
}

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
    },

    removeItem: (productId, variations) => {
        removeItemFromCart(productId, variations)
        const items = getCart()
        set({ items, totalItems: computeTotalItems(items) })
    },

    updateQuantity: (productId, quantity, variations) => {
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







