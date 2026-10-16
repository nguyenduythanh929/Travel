// store/counterStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getTours } from "../app/api/tours/route";

type CartItem = {
  cart: any;
  loading: boolean;
  error: string | null;
  hasHydrated:string | null;
  fetchCart: (userId: number) => Promise<void>;
};

export const usecart = create<CartItem>()(
  persist(
    (set, get) => ({
      cart: {},
      loading: false,
      error: null,
      hasHydrated: false,

      fetchCart: async (userId: number) => {
        set({ loading: true });
        try {
          const res = await fetch(`http://localhost:8088/api/bookings/user/${userId}`);
          const data = await res.json();
          set({ cart: data, loading: false });
          return data;
        } catch (error) {
          set({ error: "Lỗi", loading: false });
        }
      },
    }),
    {
      name: "cart-storage",
      onRehydrateStorage: () => (state) => {
        state?.set({ hasHydrated: true });
      },
    }
  )
);
