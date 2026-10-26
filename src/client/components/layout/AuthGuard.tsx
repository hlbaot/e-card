"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { AuthUser } from "@/shared/types";
import {
  hydrateAuthUser,
  restoreSession,
  shouldCheckSessionOnVisibility,
  useAuth,
} from "@/client/hooks/useAuth";
import { useAuthStore } from "@/client/store/auth.store";
import { Skeleton } from "@/client/components/ui/Skeleton";

export function AuthGuard({
  initialUser = null,
  children,
}: {
  initialUser?: AuthUser | null;
  children: React.ReactNode;
}) {
  // Hydrate initialUser từ Server Component ngay khi khởi tạo (không đợi useEffect)
  // để các hook dữ liệu (useEmployees, useEmployee) có userId ngay ở lần render đầu tiên.
  const [hydratedUserId, setHydratedUserId] = useState<string | null>(() => {
    if (typeof window === "undefined") {
      if (initialUser) {
        useAuthStore.setState({ user: initialUser, authenticated: true, ready: true });
      } else {
        useAuthStore.setState({ user: null, authenticated: false, ready: false });
      }
      return initialUser?.id ?? null;
    }
    if (initialUser) {
      hydrateAuthUser(initialUser);
      return initialUser.id;
    }
    return null;
  });

  if (initialUser && hydratedUserId !== initialUser.id) {
    setHydratedUserId(initialUser.id);
    hydrateAuthUser(initialUser);
  }

  const { ready, authenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (initialUser) {
      try {
        localStorage.setItem("ecard_logged_in", "1");
      } catch {}
    } else if (!useAuthStore.getState().ready) {
      // Access token hết hạn nhưng còn phiên refresh: chạy ngầm không chặn khung trang.
      void restoreSession();
    }

    // Đăng ký duy nhất 1 listener visibilitychange tại AuthGuard kèm throttle 60s.
    const checkSession = () => {
      if (document.visibilityState === "visible" && shouldCheckSessionOnVisibility()) {
        void restoreSession();
      }
    };
    document.addEventListener("visibilitychange", checkSession);
    return () => document.removeEventListener("visibilitychange", checkSession);
  }, [initialUser]);

  useEffect(() => {
    // Chờ kiểm tra phiên hoàn tất để tránh chuyển về login khi request refresh còn đang chạy.
    if (ready && !authenticated) router.replace("/login");
  }, [ready, authenticated, router]);

  // Nếu đã xác định không còn phiên hợp lệ thì chờ điều hướng về /login.
  // Khi đang refresh ngầm (!ready), vẫn hiển thị Sidebar và khung trang, chỉ nội dung con hiện Skeleton.
  if (ready && !authenticated) return <Skeleton />;
  return <>{children}</>;
}
