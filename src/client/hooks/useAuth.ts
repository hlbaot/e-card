"use client";

import type { AuthUser } from "@/shared/types";
import { useAuthStore } from "@/client/store/auth.store";
import { authApi } from "@/api/auth.api";
import { withAuthLock } from "@/client/auth/session-lock";
import { ApiClientError } from "@/api/client";

export const SESSION_CHECK_THROTTLE_MS = 60_000;

// Shared across hook instances so restore cannot race login/logout.
let restoring: Promise<void> | undefined;
let lastCheckedAt = 0;

export function markSessionChecked(timestamp = Date.now()) {
  lastCheckedAt = timestamp;
}

export function shouldCheckSessionOnVisibility(
  now = Date.now(),
  throttleMs = SESSION_CHECK_THROTTLE_MS,
) {
  if (lastCheckedAt <= 0) return true;
  return now - lastCheckedAt >= throttleMs;
}

export function hydrateAuthUser(user: AuthUser) {
  const current = useAuthStore.getState();
  if (
    !current.ready ||
    !current.authenticated ||
    current.user?.id !== user.id ||
    current.user?.email !== user.email
  ) {
    current.setUser(user);
  }
  lastCheckedAt = Date.now();
}

export function restoreSession() {
  restoring ??= (async () => {
    try {
      const user = await authApi.me();
      useAuthStore.getState().setUser(user);
      lastCheckedAt = Date.now();
      if (typeof window !== "undefined") {
        try { localStorage.setItem("ecard_logged_in", "1"); } catch {}
      }
    } catch (error) {
      if (!(error instanceof ApiClientError) || error.response?.status !== 401) throw error;
      useAuthStore.getState().setUser(null);
      lastCheckedAt = Date.now();
      if (typeof window !== "undefined") {
        try { localStorage.removeItem("ecard_logged_in"); } catch {}
      }
    }
  })().finally(() => { restoring = undefined; });
  return restoring;
}

export async function login(email: string, password: string) {
  if (restoring) await restoring;
  return withAuthLock(async () => {
    const user = await authApi.login(email, password);
    useAuthStore.getState().setUser(user);
    lastCheckedAt = Date.now();
    if (typeof window !== "undefined") {
      try { localStorage.setItem("ecard_logged_in", "1"); } catch {}
    }
  });
}

export async function logout() {
  if (restoring) await restoring;
  return withAuthLock(async () => {
    if (typeof window !== "undefined") {
      try { localStorage.removeItem("ecard_logged_in"); } catch {}
    }
    await authApi.logout();
    lastCheckedAt = 0;
    useAuthStore.getState().setUser(null);
  });
}

export function useAuth() {
  const { ready, authenticated, user } = useAuthStore();
  return { ready, authenticated, user, restore: restoreSession, login, logout };
}
