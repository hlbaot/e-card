import type { Metadata } from "next";
import { AuthGuard } from "@/client/components/layout/AuthGuard";
import { AdminSidebar } from "@/client/components/layout/AdminSidebar";

export const metadata: Metadata = {
  title: "Quản trị hệ thống",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <AdminSidebar>{children}</AdminSidebar>
    </AuthGuard>
  );
}
