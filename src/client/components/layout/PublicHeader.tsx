"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowRight, LogOut } from "lucide-react";
import { routes } from "@/shared/constants/routes";
import { restoreSession, shouldCheckSessionOnVisibility, useAuth } from "@/client/hooks/useAuth";
import { useAuthStore } from "@/client/store/auth.store";
import { useToast } from "@/client/components/ui/Toast";
import { Spinner } from "@/client/components/ui/Spinner";
import { LoadingOverlay } from "@/client/components/ui/LoadingOverlay";
import { LanguageSwitcher } from "@/client/components/ui/LanguageSwitcher";

export function Brand({ href = routes.home }: { href?: string } = {}) {
  return (
    <Link
      href={href}
      className="brand"
      aria-label="E-card"
    >
      <Image
        src="/images/brand/qtm-logo.png"
        width={94}
        height={28}
        alt="E-card"
        className="object-contain h-7 w-auto"
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
  const tHome = useTranslations("home.header");
  const tSidebar = useTranslations("admin.sidebar");
  const tToast = useTranslations("toast");
  const tErrors = useTranslations("errors");
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (!useAuthStore.getState().ready || shouldCheckSessionOnVisibility()) {
      void restoreSession().catch(() => {});
    }
  }, []);

  const isLoggedIn = ready && authenticated;

  return (
    <header className="public-header">
      <LoadingOverlay show={loggingOut} label={tSidebar("loggingOut")} />
      <div className="container header-inner">
        <Brand />

        <div className="header-nav flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          {isLoggedIn ? (
            <>
              <Link
                className="qtm-header-cta group"
                href={routes.admin}
                prefetch={false}
              >
                <span>{tHome("adminUpper")}</span>
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
                    toast(tToast("logoutSuccess"));
                    router.refresh();
                  } catch {
                    toast(tErrors("logoutFailed"), "error");
                  } finally {
                    setLoggingOut(false);
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white rounded-lg border border-white/10 hover:border-red-500/40 hover:bg-red-500/10 transition-all cursor-pointer disabled:opacity-50"
                title={tSidebar("logoutTitle")}
              >
                {loggingOut ? <Spinner size={13} /> : <LogOut size={13} />}
                <span>{loggingOut ? tSidebar("loggingOut") : tHome("logoutUpper")}</span>
              </button>
            </>
          ) : (
            <Link
              className="qtm-header-cta group"
              href={routes.login}
              prefetch={false}
            >
              <span>{tHome("loginUpper")}</span>
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
