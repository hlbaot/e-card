"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/client/store/auth.store";
import { authApi } from "@/api/auth.api";
import { withAuthLock } from "@/client/auth/session-lock";

// Shared across hook instances so restore cannot race login/logout.
let restoring: Promise<void> | undefined;

export function restoreSession() {
  restoring ??= (async () => {
    try {
      const user = await authApi.me();
      useAuthStore.getState().setUser(user);
      if (typeof window !== "undefined") {
        try { localStorage.setItem("ecard_logged_in", "1"); } catch {}
      }
    } catch {
      useAuthStore.getState().setUser(null);
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
    useAuthStore.getState().setUser(null);
  });
}

export function useAuth() {
  const { ready, authenticated, user } = useAuthStore();
  useEffect(() => {
    if (!useAuthStore.getState().ready) void restoreSession();
    const checkSession = () => {
      if (document.visibilityState === "visible") void restoreSession();
    };
    document.addEventListener("visibilitychange", checkSession);
    return () => document.removeEventListener("visibilitychange", checkSession);
  }, []);
  return { ready, authenticated, user, restore: restoreSession, login, logout };
}
