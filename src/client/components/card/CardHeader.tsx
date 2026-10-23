"use client";

import Link from "next/link";
import { QtmBrand } from "./QtmBrand";
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
        {/* Left: QTM Logo + "QTM MEDIATECH · SÁNG TẠO & CÔNG NGHỆ AI" with short line */}
        <div
          data-aos="fade-right"
          data-aos-delay="50"
          className="flex flex-col items-start min-w-0"
        >
          <QtmBrand />
          <div className="mt-1 flex items-center gap-1.5">
            <span
              className="text-[clamp(6.5px,1.05dvh,9px)] font-bold tracking-[0.14em] uppercase"
              style={{ color: "var(--pv-muted)" }}
            >
              QTM MEDIATECH · SÁNG TẠO & CÔNG NGHỆ AI
            </span>
            <span
              className="h-[1.5px] w-5 rounded-full"
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
