"use client";

import Link from "next/link";
import { Plus, ArrowUpRight } from "lucide-react";
import { routes } from "@/shared/constants/routes";

export function PromoBanner() {
  return (
    <section
      aria-label="Kết nối không giới hạn"
      className="relative overflow-hidden rounded-[20px] border border-cyan-300/20 bg-gradient-to-br from-[#07152E] via-[#0B2942] to-[#0F3D52] px-6 py-6 sm:px-8 sm:py-7 shadow-[0_18px_44px_rgba(2,6,23,0.45)]"
    >
      {/* Subtle technical grid overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(34,211,238,0.14) 1px, transparent 1px), linear-gradient(to bottom, rgba(34,211,238,0.14) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(ellipse 85% 90% at 70% 50%, #000 35%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 85% 90% at 70% 50%, #000 35%, transparent 100%)",
        }}
      />

      {/* Ambient cyan/violet radial glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-24 -bottom-20 h-56 w-56 rounded-full bg-violet-500/20 blur-3xl"
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] items-center gap-6">
        {/* Left Column: Copy + CTA Buttons */}
        <div>
          <div className="eyebrow">KẾT NỐI KHÔNG GIỚI HẠN</div>
          <h2 className="mt-2.5 max-w-[520px] text-balance text-2xl sm:text-[28px] font-bold leading-[1.28] tracking-tight text-white">
            Mỗi thành viên là một{" "}
            <span className="qtm-gradient-text">
              đại diện thương&nbsp;hiệu.
            </span>
          </h2>
          <p className="mt-2.5 max-w-[520px] text-sm leading-relaxed text-[var(--text-body)]">
            Tạo danh thiếp số mang dấu ấn QTM. Chia sẻ dễ dàng, cập nhật tức thì
            và luôn sẵn sàng cho kết nối tiếp theo.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href={routes.newEmployee}
              className="btn btn-primary group text-xs"
            >
              <Plus size={16} />
              <span>Thêm nhân viên</span>
            </Link>
            <Link
              href={routes.cards}
              className="btn btn-secondary group text-xs"
            >
              <span>Danh thiếp số</span>
              <ArrowUpRight
                size={15}
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </div>

        {/* Right Column: Network Constellation & Digital Card Hub Graphic */}
        <div
          aria-hidden="true"
          className="hidden lg:flex items-center justify-end pr-2"
        >
          <svg
            viewBox="0 0 360 190"
            className="w-full max-w-[340px] h-auto overflow-visible"
            fill="none"
          >
            <defs>
              <linearGradient
                id="promoLineGrad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.65" />
                <stop offset="50%" stopColor="#2DD4BF" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.65" />
              </linearGradient>
              <linearGradient
                id="promoCardGrad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#0B1938" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#16224F" stopOpacity="0.85" />
              </linearGradient>
            </defs>

            {/* Constellation connecting lines */}
            <g stroke="url(#promoLineGrad)" strokeWidth="1.2">
              <line x1="28" y1="36" x2="105" y2="62" />
              <line x1="105" y1="62" x2="62" y2="142" />
              <line x1="28" y1="36" x2="62" y2="142" />
              <line x1="105" y1="62" x2="180" y2="38" />
              <line x1="62" y1="142" x2="176" y2="154" />
              <line x1="180" y1="38" x2="318" y2="28" />
              <line x1="318" y1="28" x2="338" y2="112" />
              <line x1="176" y1="154" x2="338" y2="112" />
              <line x1="280" y1="164" x2="338" y2="112" />
              <line x1="176" y1="154" x2="280" y2="164" />
            </g>

            {/* Outer orbit rings */}
            <circle
              cx="210"
              cy="95"
              r="76"
              stroke="#22D3EE"
              strokeOpacity="0.16"
              strokeDasharray="4 6"
            />
            <circle
              cx="210"
              cy="95"
              r="54"
              stroke="#8B5CF6"
              strokeOpacity="0.22"
            />

            {/* Floating mini digital E-Card preview in the center-right */}
            <g transform="translate(132, 34)">
              <rect
                width="156"
                height="118"
                rx="16"
                fill="url(#promoCardGrad)"
                stroke="#22D3EE"
                strokeOpacity="0.45"
                strokeWidth="1.2"
              />
              {/* Avatar circle */}
              <circle
                cx="36"
                cy="38"
                r="16"
                fill="#22D3EE"
                fillOpacity="0.18"
                stroke="#22D3EE"
                strokeOpacity="0.65"
                strokeWidth="1.2"
              />
              <circle cx="36" cy="35" r="5" fill="#67E8F9" />
              <path
                d="M27 47c2-4 6-6 9-6s7 2 9 6"
                stroke="#67E8F9"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* Name & role bars */}
              <rect
                x="62"
                y="28"
                width="72"
                height="7"
                rx="3.5"
                fill="#FFFFFF"
                fillOpacity="0.9"
              />
              <rect
                x="62"
                y="41"
                width="48"
                height="5"
                rx="2.5"
                fill="#22D3EE"
                fillOpacity="0.7"
              />
              {/* Divider */}
              <line
                x1="20"
                y1="66"
                x2="136"
                y2="66"
                stroke="#FFFFFF"
                strokeOpacity="0.1"
              />
              {/* Action pills */}
              <rect
                x="20"
                y="78"
                width="34"
                height="22"
                rx="6"
                fill="#22D3EE"
                fillOpacity="0.15"
                stroke="#22D3EE"
                strokeOpacity="0.35"
              />
              <rect
                x="61"
                y="78"
                width="34"
                height="22"
                rx="6"
                fill="#2DD4BF"
                fillOpacity="0.15"
                stroke="#2DD4BF"
                strokeOpacity="0.35"
              />
              <rect
                x="102"
                y="78"
                width="34"
                height="22"
                rx="6"
                fill="#8B5CF6"
                fillOpacity="0.18"
                stroke="#8B5CF6"
                strokeOpacity="0.4"
              />
            </g>

            {/* Glowing network nodes */}
            <circle cx="28" cy="36" r="4" fill="#22D3EE" />
            <circle
              cx="28"
              cy="36"
              r="9"
              fill="#22D3EE"
              fillOpacity="0.2"
            />
            <circle cx="105" cy="62" r="3.5" fill="#2DD4BF" />
            <circle cx="62" cy="142" r="4" fill="#8B5CF6" />
            <circle cx="180" cy="38" r="3" fill="#67E8F9" />
            <circle cx="318" cy="28" r="4.5" fill="#22D3EE" />
            <circle
              cx="318"
              cy="28"
              r="10"
              fill="#22D3EE"
              fillOpacity="0.22"
            />
            <circle cx="338" cy="112" r="4" fill="#A78BFA" />
            <circle cx="280" cy="164" r="3.5" fill="#2DD4BF" />
            <circle cx="176" cy="154" r="3" fill="#22D3EE" />
          </svg>
        </div>
      </div>
    </section>
  );
}
