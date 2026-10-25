import { useAuthStore, type AuthUser } from "@/client/store/auth.store";
import { withAuthLock } from "@/client/auth/session-lock";

let refreshing: Promise<boolean> | undefined;

export function refreshSession(): Promise<boolean> {
  refreshing ??= withAuthLock(async () => {
    // Another request/tab may already have refreshed while we waited for the lock.
    const current = await fetch("/api/auth/me", { credentials: "same-origin", cache: "no-store" });
    if (current.ok) {
      const { user } = await current.json() as { user: AuthUser };
      useAuthStore.getState().setUser(user);
      return true;
    }
    if (current.status !== 401) throw new Error("Không thể xác thực tài khoản. Vui lòng thử lại sau.");
    const response = await fetch("/api/auth/refresh", {
      method: "POST", credentials: "same-origin", cache: "no-store",
    });
    if (response.status === 401) {
      useAuthStore.getState().setUser(null);
      return false;
    }
    if (!response.ok) throw new Error("Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.");
    const { user } = await response.json() as { user: AuthUser };
    useAuthStore.getState().setUser(user);
    return true;
  }).finally(() => { refreshing = undefined; });
  return refreshing;
}

// Retry once after rotating the refresh cookie. Tokens never enter JS storage.
export async function apiFetch(path: string, options: RequestInit = {}) {
  if (!path.startsWith("/api/") || path.includes("\\")) throw new Error("API path must be same-origin");
  const send = () => fetch(path, { ...options, credentials: "same-origin", cache: "no-store" });
  const response = await send();
  if (response.status !== 401 || !await refreshSession()) return response;
  const retried = await send();
  if (retried.status === 401) useAuthStore.getState().setUser(null);
  return retried;
}
