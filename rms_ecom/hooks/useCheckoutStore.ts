"use client"

import { create } from "zustand"

type CheckoutState = {
  deliveryMethod: 'inside' | 'outside'
  setDeliveryMethod: (method: 'inside' | 'outside') => void
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  deliveryMethod: 'inside',
  setDeliveryMethod: (method) => set({ deliveryMethod: method }),
}))


