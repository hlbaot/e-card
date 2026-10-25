import { useAuthStore, type AuthUser } from "@/client/store/auth.store";
import { apiFetch } from "./http";

async function readResponse(response: Response) {
  const data = await response.json() as { user?: AuthUser; error?: string };
  if (!response.ok) throw new Error(data.error || "Đăng nhập không thành công. Vui lòng thử lại.");
  return data;
}

// HTTP transport only: endpoints, request/response serialization and API errors.
export const authApi = {
  async me() {
    // apiFetch tự gửi cookie; nếu access hết hạn sẽ thử refresh và gọi lại /me một lần.
    const data = await readResponse(await apiFetch("/api/auth/me"));
    if (!data.user) throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
    return data.user;
  },
  async login(email: string, password: string) {
    const response = await fetch("/api/auth/login", {
      method: "POST", credentials: "same-origin", cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await readResponse(response);
    if (!data.user) throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
    return data.user;
  },
  async logout() {
    const response = await fetch("/api/auth/logout", {
      method: "POST", credentials: "same-origin", cache: "no-store",
    });
    await readResponse(response);
  },
  async changePassword(currentPassword: string, newPassword: string) {
    const response = await apiFetch("/api/auth/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await response.json() as { success?: boolean; error?: string; message?: string };
    if (!response.ok) throw new Error(data.error || "Không thể đổi mật khẩu. Vui lòng thử lại.");
    // Server đã thu hồi phiên và xóa cookie; AuthGuard sẽ chuyển về trang đăng nhập.
    useAuthStore.getState().setUser(null);
    return data;
  },
};
