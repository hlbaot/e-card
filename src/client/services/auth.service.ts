import { useAuthStore } from "@/client/store/auth.store";
export const authService = {
  async login(email: string, password: string) {
    if (
      email.trim().toLowerCase() !== "admin@qtmmedia.vn" ||
      password !== "admin123"
    )
      throw new Error("Địa chỉ thư điện tử hoặc mật khẩu không đúng.");
    useAuthStore.getState().setAuthenticated(true);
  },
  async logout() {
    useAuthStore.getState().setAuthenticated(false);
  },
};
