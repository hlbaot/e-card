import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LoginView } from "@/client/components/auth/LoginView";
import { ACCESS_COOKIE } from "@/server/auth/http";
import { serverAuth } from "@/server/auth/runtime";

export const metadata: Metadata = {
  title: "Đăng nhập",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function Login() {
  const access = (await cookies()).get(ACCESS_COOKIE)?.value;
  if (access) {
    try {
      await serverAuth.currentUser(access);
      redirect("/admin");
    } catch {
      // access expired or invalid, let LoginView restore session via refresh or show form
    }
  }
  return <LoginView />;
}
