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
  const cookieStore = await cookies();
  const access = cookieStore.get(ACCESS_COOKIE)?.value;

  let authenticated = false;
  if (access) {
    try {
      await serverAuth.currentUser(access);
      authenticated = true;
    } catch {
      // Let the client restore an expired access token via the refresh endpoint.
    }
  }

  // redirect throws NEXT_REDIRECT; do not swallow it in the auth catch.
  if (authenticated) redirect("/admin");
  return <LoginView />;
}
