import { create } from "zustand";
export interface AuthUser { id: string; email: string; createdAt?: string }
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
