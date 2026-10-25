"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/client/store/auth.store";
import { authApi } from "@/client/api/auth.api";
import { withAuthLock } from "@/client/auth/session-lock";

// Shared across hook instances so restore cannot race login/logout.
let restoring: Promise<void> | undefined;

export function restoreSession() {
  restoring ??= (async () => {
    try {
      useAuthStore.getState().setUser(await authApi.me());
    } catch {
      useAuthStore.getState().setUser(null);
    }
  })().finally(() => { restoring = undefined; });
  return restoring;
}

export async function login(email: string, password: string) {
  if (restoring) await restoring;
  return withAuthLock(async () => {
    useAuthStore.getState().setUser(await authApi.login(email, password));
  });
}

export async function logout() {
  if (restoring) await restoring;
  return withAuthLock(async () => {
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
