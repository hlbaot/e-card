import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { AuthUser } from "@/shared/types";
import { AuthGuard } from "@/client/components/layout/AuthGuard";
import { AdminSidebar } from "@/client/components/layout/AdminSidebar";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/server/auth/http";
import { serverAuth } from "@/server/auth/runtime";

export const metadata: Metadata = {
  title: "Quản trị hệ thống",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;

  let initialUser: AuthUser | null = null;
  let canRefresh = Boolean(refreshToken);

  if (accessToken) {
    try {
      initialUser = await serverAuth.currentUser(accessToken);
    } catch {
      if (!canRefresh) {
        canRefresh = await serverAuth.hasActiveRefreshSession(accessToken);
      }
    }
  }

  if (!initialUser && !canRefresh) {
    redirect("/login");
  }

  return (
    <AuthGuard initialUser={initialUser}>
      <AdminSidebar>{children}</AdminSidebar>
    </AuthGuard>
  );
}
