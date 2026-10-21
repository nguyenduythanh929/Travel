import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getTours } from "../app/api/tours/route";

type TourStore = {
  tours: any;
  loading: boolean;
  error: string | null;
  fetchTours: () => Promise<void>;
};

export const useInCountryStore = create<TourStore>()(
  persist(
    (set) => ({
      tours: [],
      loading: false,
      error: null,

      fetchTours: async () => {
        set({ loading: true, error: null });
        try {
          const res = await getTours(0, 4, 1);

          set({ tours: res.data, loading: false });
          console.log("Fetched tours:", res.data);
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định";
          set({ error: message, loading: false });
        }
      },

      clearTours: () => set({ tours: [] }),
    }),
    {
      name: "tour-storage", // 🔹 tên key lưu trong localStorage
      partialize: (state) => ({ tours: state.tours }), // chỉ lưu phần tours (không lưu loading/error)
    }
  )
);
