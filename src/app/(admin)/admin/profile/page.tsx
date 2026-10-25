import type { Metadata } from "next";
import { AdminProfileView } from "@/views/AdminProfileView";

export const metadata: Metadata = {
  title: "Hồ sơ & Tài khoản Quản trị — E-card",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfilePage() {
  return <AdminProfileView />;
}
