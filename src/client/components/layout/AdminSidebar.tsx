"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  LayoutDashboard,
  Users,
  ContactRound,
  UserCog,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Brand } from "./PublicHeader";
import { Avatar } from "@/client/components/ui/Avatar";
import { useAuth } from "@/client/hooks/useAuth";
import { cn } from "@/shared/utils/cn";
import { routes } from "@/shared/constants/routes";
import { useToast } from "@/client/components/ui/Toast";

export function AdminSidebar({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { logout, user } = useAuth();
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
                router.replace(routes.login);
                router.refresh();
              } catch {
                toast("Chưa thể đăng xuất. Vui lòng thử lại.");
              }
            }}
          >
            <LogOut size={18} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Thanh header bar quản trị ở trên cùng */}
      <header className="admin-header">
        <button
          className="icon-button mobile-menu"
          aria-label="Mở menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <Menu size={20} />
        </button>
        <p className="admin-context">
          Không gian làm việc <span className="mx-2">/</span>
          <strong>QTM MediaTech</strong>
        </p>
        <div className="admin-user">
          <Link href={routes.home} className="btn btn-ghost admin-home-link" aria-label="Về trang chủ">
            <Home size={16} aria-hidden="true" />
            <span>Trang chủ</span>
          </Link>
          <Link
            href={routes.profile}
            className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-white/5"
            title="Xem hồ sơ & đổi mật khẩu"
          >
            <Avatar name="Quản trị QTM" src="" size={32} color="#387c83" />
            <div className="admin-user-info">
              Quản trị viên<span>{user?.email}</span>
            </div>
          </Link>
          <button
            className="btn btn-ghost"
            onClick={async () => {
              try {
                await logout();
                router.replace(routes.login);
                router.refresh();
              } catch {
                toast("Chưa thể đăng xuất. Vui lòng thử lại.");
              }
            }}
          >
            <LogOut size={16} />
            Đăng xuất
          </button>
        </div>
      </header>

      <main className="admin-content">{children}</main>
    </div>
  );
}
