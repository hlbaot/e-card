"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, QrCode, Share2 } from "lucide-react";

interface CardHeaderProps {
  onOpenQr: () => void;
  onShare: () => void;
  dark?: boolean;
}

export function CardHeader({ onOpenQr, onShare }: CardHeaderProps) {

  return (
    <div className="shrink-0">
      <header className="flex items-start justify-between gap-2">
        {/* Left: QTM Brand Lockup (Logo + QTM / MEDIATECH / CREATIVE / + AI TECH with underline) */}
        <div
          data-aos="fade-right"
          data-aos-delay="50"
          className="flex items-start gap-2 sm:gap-2.5 min-w-0"
        >
          <Image
            src="/images/brand/qtm-logo.png"
            width={36}
            height={36}
            alt="QTM MediaTech"
            unoptimized
            className="shrink-0 object-contain mt-0.5"
          />
          <div className="flex flex-col items-start leading-[1.18] select-none">
            <span
              className="text-[clamp(11px,1.65dvh,14px)] font-black tracking-tight uppercase"
              style={{ color: "var(--pv-primary)" }}
            >
              QTM
            </span>
            <span
              className="text-[clamp(9.5px,1.4dvh,12px)] font-extrabold tracking-[0.06em] uppercase"
              style={{ color: "var(--pv-primary)" }}
            >
              MEDIATECH
            </span>
            <span
              className="text-[clamp(7.5px,1.15dvh,9.5px)] font-semibold tracking-[0.14em] uppercase mt-0.5"
              style={{ color: "var(--pv-muted)" }}
            >
              CREATIVE
            </span>
            <span
              className="text-[clamp(7.5px,1.15dvh,9.5px)] font-semibold tracking-[0.14em] uppercase"
              style={{ color: "var(--pv-muted)" }}
            >
              + AI TECH
            </span>
            <span
              className="h-[2px] w-6 rounded-full mt-1.5"
              style={{ background: "var(--pv-accent)" }}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Right: 4-line "VĂN HÓA / CÔNG NGHỆ / TRUYỀN THÔNG / SỰ KIỆN" with left vertical bar + compact QR & Share buttons */}
        <div
          data-aos="fade-left"
          data-aos-delay="100"
          className="flex items-start gap-2.5 shrink-0"
        >
          <div
            className="border-l-2 pl-2 py-0.5 text-[clamp(6.5px,1.05dvh,9px)] font-extrabold leading-[1.28] tracking-[0.16em] uppercase"
            style={{
              borderColor: "var(--pv-accent)",
              color: "var(--pv-primary)",
            }}
          >
            <div>VĂN HÓA</div>
            <div>CÔNG NGHỆ</div>
            <div>TRUYỀN THÔNG</div>
            <div>SỰ KIỆN</div>
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              href="/"
              aria-label="Về trang chủ"
              title="Về trang chủ"
              className="ecard-header-btn inline-flex items-center justify-center rounded-full h-8 w-8 md:h-9 md:w-auto md:px-3 gap-1.5 text-xs font-semibold shadow-2xs transition"
            >
              <ArrowLeft size={14} aria-hidden="true" />
              <span className="hidden md:inline">Trang chủ</span>
            </Link>
            <button
              type="button"
              onClick={onOpenQr}
              aria-label="Mở mã QR"
              title="Mã QR"
              className="ecard-header-btn inline-flex items-center justify-center rounded-full h-8 w-8 md:h-9 md:w-auto md:px-3 gap-1.5 text-xs font-semibold shadow-2xs transition cursor-pointer"
            >
              <QrCode size={14} />
              <span className="hidden md:inline">Mã QR</span>
            </button>
            <button
              type="button"
              onClick={onShare}
              aria-label="Chia sẻ hồ sơ"
              title="Chia sẻ"
              className="ecard-header-btn inline-flex items-center justify-center rounded-full h-8 w-8 md:h-9 md:w-auto md:px-3 gap-1.5 text-xs font-semibold shadow-2xs transition cursor-pointer"
            >
              <Share2 size={14} />
              <span className="hidden md:inline">Chia sẻ</span>
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}
