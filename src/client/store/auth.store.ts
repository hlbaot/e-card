import { create } from "zustand";
import type { AuthUser } from "@/shared/types";
export const useAuthStore = create<{
  authenticated: boolean;
  ready: boolean;
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
}>()((set) => ({
  authenticated: false,
  ready: false,
  user: null,
  setUser: (user) => set({ user, authenticated: user !== null, ready: true }),
}));
