"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/client/hooks/useAuth";
import { Skeleton } from "@/client/components/ui/Skeleton";
export function AuthGuard({ children }: { children: React.ReactNode }) {
  // useAuth khôi phục phiên bằng GET /api/auth/me rồi cập nhật ready/authenticated.
  const { ready, authenticated } = useAuth();
  const router = useRouter();
  useEffect(() => {
    // Chờ kiểm tra phiên hoàn tất để tránh chuyển về login khi request còn đang chạy.
    if (ready && !authenticated) router.replace("/login");
  }, [ready, authenticated, router]);
  // Chưa xác nhận đăng nhập thì chưa hiển thị nội dung quản trị.
  return ready && authenticated ? <>{children}</> : <Skeleton />;
}
