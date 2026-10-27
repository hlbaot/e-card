"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LogOut } from "lucide-react";
import { routes } from "@/shared/constants/routes";
import { useAuth } from "@/client/hooks/useAuth";
import { useToast } from "@/client/components/ui/Toast";

const emptySubscribe = () => () => {};

export function Brand({ href = routes.home }: { href?: string } = {}) {
  return (
    <Link
      href={href}
      className="brand"
      aria-label="E-card"
    >
      <Image
        src="/images/icon.png"
        width={32}
        height={32}
        alt="E-card"
        className="object-contain"
        priority
      />
      <i className="brand-divider" />
      <span className="brand-title">
        E-card
      </span>
    </Link>
  );
}

export function PublicHeader() {
  const { ready, authenticated, logout } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [loggingOut, setLoggingOut] = useState(false);
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const hasLocalSession = useSyncExternalStore(
    emptySubscribe,
    () => {
      try {
        return localStorage.getItem("ecard_logged_in") === "1";
      } catch {
        return false;
      }
    },
    () => false,
  );
  const isLoggedIn = mounted && (ready ? authenticated : hasLocalSession);

  return (
    <header className="public-header">
      <div className="container header-inner">
        <Brand />

        <div className="header-nav flex items-center gap-2 sm:gap-3">
          {isLoggedIn ? (
            <>
              <Link
                className="qtm-header-cta group"
                href={routes.admin}
                prefetch={true}
              >
                <span>QUẢN TRỊ</span>
                <ArrowRight
                  size={14}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
              <button
                type="button"
                disabled={loggingOut}
                onClick={async () => {
                  setLoggingOut(true);
                  try {
                    await logout();
                    toast("Đã đăng xuất thành công.");
                    router.refresh();
                  } catch {
                    toast("Chưa thể đăng xuất. Vui lòng thử lại.");
                  } finally {
                    setLoggingOut(false);
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white rounded-lg border border-white/10 hover:border-red-500/40 hover:bg-red-500/10 transition-all cursor-pointer disabled:opacity-50"
                title="Đăng xuất khỏi hệ thống"
              >
                <LogOut size={13} />
                <span>{loggingOut ? "Đang thoát…" : "ĐĂNG XUẤT"}</span>
              </button>
            </>
          ) : (
            <Link
              className="qtm-header-cta group"
              href={routes.login}
              prefetch={true}
            >
              <span>ĐĂNG NHẬP</span>
              <ArrowRight
                size={14}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
