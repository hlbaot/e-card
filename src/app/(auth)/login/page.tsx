import type { Metadata } from "next";
import { LoginView } from "@/client/components/auth/LoginView";

export const metadata: Metadata = {
  title: "Đăng nhập",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Login() {
  return <LoginView />;
}
