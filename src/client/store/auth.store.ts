import { create } from "zustand";
import { persist } from "zustand/middleware";
export const useAuthStore = create<{
  authenticated: boolean;
  setAuthenticated: (authenticated: boolean) => void;
}>()(
  persist(
    (set) => ({
      authenticated: false,
      setAuthenticated: (authenticated) => set({ authenticated }),
    }),
    { name: "ecard-auth", skipHydration: true },
  ),
);
