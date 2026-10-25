import { useAuthStore, type AuthUser } from "@/client/store/auth.store";
import { apiClient } from "./client";

export interface AuthResponse {
  user?: AuthUser;
  error?: string;
  success?: boolean;
}

export const authApi = {
  async me(): Promise<AuthUser> {
    try {
      const res = await apiClient.get<AuthResponse>("/api/auth/me");
      if (!res.data.user) throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
      return res.data.user;
    } catch (err: unknown) {
      if (err instanceof Error) throw err;
      throw new Error("Không thể xác thực thông tin đăng nhập.");
    }
  },

  async login(email: string, password: string): Promise<AuthUser> {
    try {
      const res = await apiClient.post<AuthResponse>("/api/auth/login", { email, password });
      if (!res.data.user) throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
      return res.data.user;
    } catch (err: unknown) {
      if (err instanceof Error) throw err;
      throw new Error("Đăng nhập không thành công. Vui lòng thử lại.");
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post("/api/auth/logout");
    } catch {
      // Bỏ qua lỗi mạng khi logout để xóa state cục bộ
    }
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success?: boolean; error?: string }> {
    try {
      const res = await apiClient.post<{ success?: boolean; error?: string }>(
        "/api/auth/password",
        { currentPassword, newPassword }
      );
      // Server đã thu hồi phiên và xóa cookie; chuyển về trang đăng nhập
      useAuthStore.getState().setUser(null);
      return res.data;
    } catch (err: unknown) {
      if (err instanceof Error) throw err;
      throw new Error("Không thể đổi mật khẩu. Vui lòng thử lại.");
    }
  },
};
