"use client";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/client/store/auth.store";
import { employeesOptions, statsOptions } from "@/client/queries/employees";
import { useState } from "react";
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

export function AdminSidebar({ children }: { children: React.ReactNode }) {
  const client = useQueryClient();
  const userId = useAuthStore(state => state.user?.id);
  const prefetch = (href: string) => {
    if (!userId) return;
    if ([routes.admin, routes.employees, routes.cards].includes(href)) void client.prefetchQuery(employeesOptions(userId));
    if (href === routes.admin) void client.prefetchQuery(statsOptions(userId));
  };
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { logout } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const nav = [
    { href: routes.admin, label: "Tổng quan", icon: LayoutDashboard },
    { href: routes.employees, label: "Nhân viên", icon: Users },
    { href: routes.cards, label: "Danh thiếp số", icon: ContactRound },
    { href: routes.profile, label: "Tài khoản", icon: UserCog },
  ];

  return (
    <div className="admin-shell">
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
          <Brand />
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
              onMouseEnter={() => prefetch(href)}
              onFocus={() => prefetch(href)}
              onTouchStart={() => prefetch(href)}
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
            onClick={async () => {
              try {
                await logout();
                client.clear();
                router.replace(routes.login);
                router.refresh();
              } catch {
                toast("Chưa thể đăng xuất. Vui lòng thử lại.", "error");
              }
            }}
          >
            <LogOut size={18} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>



      <main className="admin-content">{children}</main>
    </div>
  );
}
