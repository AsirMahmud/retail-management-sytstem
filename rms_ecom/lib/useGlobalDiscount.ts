import { create } from 'zustand';
import { ecommerceApi, Discount } from './api';

type State = {
  discount: Discount | null;
  loading: boolean;
  fetchDiscount: () => Promise<void>;
};

export const useGlobalDiscount = create<State>((set) => ({
  discount: null,
  loading: true,
  fetchDiscount: async () => {
    set({ loading: true });
    try {
      const discounts = await ecommerceApi.getActiveAppWideDiscount();
      set({ discount: discounts[0] || null, loading: false });
    } catch {
      set({ discount: null, loading: false });
    }
  }
}));
