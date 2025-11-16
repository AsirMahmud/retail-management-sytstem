"use client"

import { create } from "zustand"

type CheckoutState = {
  deliveryMethod: 'inside' | 'gazipur' | 'outside'
  setDeliveryMethod: (method: 'inside' | 'gazipur' | 'outside') => void
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  deliveryMethod: 'inside',
  setDeliveryMethod: (method) => set({ deliveryMethod: method }),
}))







