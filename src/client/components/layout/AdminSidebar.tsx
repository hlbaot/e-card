"use client";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/client/store/auth.store";
import { createAdminNavigationPrefetcher } from "@/client/queries/admin-navigation";
import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  LayoutDashboard,
  Users,
  ContactRound,
  UserCog,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Brand } from "./PublicHeader";
import { useAuth } from "@/client/hooks/useAuth";
import { cn } from "@/shared/utils/cn";
import { routes } from "@/shared/constants/routes";
import { useToast } from "@/client/components/ui/Toast";
import { Spinner } from "@/client/components/ui/Spinner";
import { LoadingOverlay } from "@/client/components/ui/LoadingOverlay";
import { LanguageSwitcher } from "@/client/components/ui/LanguageSwitcher";

export function AdminSidebar({ children }: { children: React.ReactNode }) {
  const client = useQueryClient();
  const userId = useAuthStore(state => state.user?.id);
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const pathname = usePathname();
  const { logout, authenticated } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const t = useTranslations("admin.sidebar");
  const tErrors = useTranslations("errors");
  const prefetch = useMemo(
    () => authenticated && userId
      ? createAdminNavigationPrefetcher(client, router)
      : () => Promise.resolve(),
    [client, router, userId, authenticated],
  );
  const nav = [
    { href: routes.admin, label: t("dashboard"), icon: LayoutDashboard },
    { href: routes.employees, label: t("employees"), icon: Users },
    { href: routes.cards, label: t("cards"), icon: ContactRound },
    { href: routes.profile, label: t("profile"), icon: UserCog },
  ];

  return (
    <div className="admin-shell">
      <LoadingOverlay show={loggingOut} label={t("loggingOut")} />
      {open && (
        <button
          className="mobile-overlay"
          aria-label={t("closeMenu")}
          onClick={() => setOpen(false)}
        />
      )}

      <button
        type="button"
        className="admin-mobile-trigger lg:hidden"
        aria-label={t("openMenu")}
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <Menu size={20} />
      </button>

      <aside className={cn("sidebar", open && "open")}>
        <div className="sidebar-top flex items-center justify-between">
          <Brand href={routes.admin} />
          <button
            type="button"
            className="sidebar-close-btn lg:hidden"
            aria-label={t("closeMenu")}
            onClick={() => setOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <div className="sidebar-label">{t("eyebrow")}</div>

        <nav aria-label={t("navAria")}>
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              href={href}
              key={href}
              prefetch={false}
              onMouseEnter={() => { void prefetch(href); }}
              onFocus={() => { void prefetch(href); }}
              onTouchStart={() => { void prefetch(href); }}
              onClick={() => setOpen(false)}
              className={cn(
                (href === routes.admin
                  ? pathname === href
                  : pathname.startsWith(href)) && "active",
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer flex flex-col gap-2.5">
          <LanguageSwitcher variant="sidebar" />
          <button
            type="button"
            className="sidebar-logout-btn"
            disabled={loggingOut}
            onClick={async () => {
              setLoggingOut(true);
              try {
                await logout();
                client.clear();
                window.location.replace(routes.home);
              } catch {
                toast(tErrors("logoutFailed"), "error");
                setLoggingOut(false);
              }
            }}
          >
            {loggingOut ? <Spinner size={18} /> : <LogOut size={18} />}
            <span>{loggingOut ? t("loggingOut") : t("logout")}</span>
          </button>
        </div>
      </aside>

      <main className="admin-content">{children}</main>
    </div>
  );
}
