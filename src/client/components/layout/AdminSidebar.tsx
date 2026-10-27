"use client";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/client/store/auth.store";
import { createAdminNavigationPrefetcher } from "@/client/queries/admin-navigation";
import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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

export function AdminSidebar({ children }: { children: React.ReactNode }) {
  const client = useQueryClient();
  const userId = useAuthStore(state => state.user?.id);
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const pathname = usePathname();
  const { logout, authenticated } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const prefetch = useMemo(
    () => authenticated && userId
      ? createAdminNavigationPrefetcher(client, router)
      : () => Promise.resolve(),
    [client, router, userId, authenticated],
  );
  const nav = [
    { href: routes.admin, label: "Tổng quan", icon: LayoutDashboard },
    { href: routes.employees, label: "Nhân viên", icon: Users },
    { href: routes.cards, label: "Danh thiếp số", icon: ContactRound },
    { href: routes.profile, label: "Tài khoản", icon: UserCog },
  ];

  return (
    <div className="admin-shell">
      <LoadingOverlay show={loggingOut} label="Đang đăng xuất…" />
      {open && (
        <button
          className="mobile-overlay"
          aria-label="Đóng menu"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Nút mở menu trên mobile khi ở chế độ responsive */}
      <button
        type="button"
        className="admin-mobile-trigger lg:hidden"
        aria-label="Mở menu quản trị"
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
            aria-label="Đóng menu"
            onClick={() => setOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <div className="sidebar-label">KHÔNG GIAN QUẢN TRỊ</div>

        <nav aria-label="Điều hướng quản trị">
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

        <div className="sidebar-footer">
          <button
            type="button"
            className="sidebar-logout-btn"
            disabled={loggingOut}
            onClick={async () => {
              setLoggingOut(true);
              try {
                await logout();
                client.clear();
                window.location.replace(routes.login);
              } catch {
                toast("Chưa thể đăng xuất. Vui lòng thử lại.", "error");
                setLoggingOut(false);
              }
            }}
          >
            {loggingOut ? <Spinner size={18} /> : <LogOut size={18} />}
            <span>{loggingOut ? "Đang đăng xuất…" : "Đăng xuất"}</span>
          </button>
        </div>
      </aside>



      <main className="admin-content">{children}</main>
    </div>
  );
}
