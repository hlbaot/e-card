"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { routes } from "@/shared/constants/routes";
import { useAuth } from "@/client/hooks/useAuth";

const emptySubscribe = () => () => {};

export function Brand() {
  return (
    <Link
      href={routes.home}
      className="brand"
      aria-label="E-card - Trang chủ"
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
  const { ready, authenticated } = useAuth();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const isLoggedIn = mounted && ready && authenticated;

  return (
    <header className="public-header">
      <div className="container header-inner">
        <Brand />

        <div className="header-nav">
          <Link
            className="qtm-header-cta group"
            href={isLoggedIn ? routes.admin : routes.login}
          >
            <span>{isLoggedIn ? "QUẢN TRỊ" : "ĐĂNG NHẬP"}</span>
            <ArrowRight
              size={14}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
