import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface LoadingState {
  hasLoaded: boolean;
  setHasLoaded: (value: boolean) => void;
}

export const useLoadingStore = create<LoadingState>()(
  persist(
    (set) => ({
      hasLoaded: false,
      setHasLoaded: (value) => set({ hasLoaded: value }),
    }),
    {
      name: "loading-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
