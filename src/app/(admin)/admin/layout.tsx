import type { Metadata } from "next";
import { AuthGuard } from "@/client/components/layout/AuthGuard";
import { AdminSidebar } from "@/client/components/layout/AdminSidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { serverAuth } from "@/server/auth/runtime";
import { AuthError } from "@/server/auth/service";
import { ACCESS_COOKIE } from "@/server/auth/http";

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
  const access = (await cookies()).get(ACCESS_COOKIE)?.value;
  if (!access) redirect("/login");
  try {
    await serverAuth.currentUser(access);
  } catch (error) {
    if (error instanceof AuthError) redirect("/login");
    throw error;
  }
  return (
    <AuthGuard>
      <AdminSidebar>{children}</AdminSidebar>
    </AuthGuard>
  );
}
