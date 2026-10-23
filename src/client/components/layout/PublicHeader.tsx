"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { routes } from "@/shared/constants/routes";

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
  return (
    <header className="public-header">
      <div className="container header-inner">
        <Brand />

        <div className="header-nav">
          <Link className="qtm-header-cta group" href={routes.login}>
            <span>ĐĂNG NHẬP</span>
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
