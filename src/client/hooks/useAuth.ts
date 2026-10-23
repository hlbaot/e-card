"use client";
import { useAuthStore } from "@/client/store/auth.store";
import { authService } from "@/client/services/auth.service";
import { useHydration } from "./useHydration";
export function useAuth() {
  const ready = useHydration();
  const authenticated = useAuthStore((s) => s.authenticated);
  return { ready, authenticated, ...authService };
}
