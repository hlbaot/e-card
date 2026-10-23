"use client";

import Image from "next/image";
import { useState } from "react";
import type { Employee } from "@/shared/types/employee";
import { cn } from "@/shared/utils/cn";

export function ProfileInfo({ employee: e }: { employee: Employee }) {
  const [avatarFailed, setAvatarFailed] = useState("");

  const initials = (e.fullName || "QT")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(-2)
    .map((n) => n[0])
    .join("")
    .toLocaleUpperCase("vi");

  return (
    <div className="flex flex-col items-center md:items-start text-center md:text-left min-w-0 shrink-0">
      {/* Large circular avatar centered on mobile, left-aligned on desktop */}
      <div
        data-aos="zoom-in"
        data-aos-delay="150"
        className="relative shrink-0 mb-[clamp(10px,2dvh,20px)]"
      >
        <div
          className="pointer-events-none absolute -inset-1.5 rounded-full blur-md opacity-35"
          style={{ background: "var(--pv-accent)" }}
          aria-hidden="true"
        />
        <div
          className={cn(
            "ecard-avatar-box relative flex items-center justify-center overflow-hidden select-none font-extrabold text-white border-[3.5px] shadow-[0_8px_24px_rgba(15,76,117,0.22)]",
            e.theme.avatarShape === "rounded"
              ? "rounded-[24%]"
              : "rounded-full",
          )}
          style={{
            borderColor: "var(--pv-avatar-border, #FFFFFF)",
            background:
              "linear-gradient(135deg, var(--pv-strong) 0%, var(--pv-accent) 100%)",
          }}
        >
          {e.avatarUrl && avatarFailed !== e.avatarUrl ? (
            <Image
              src={e.avatarUrl}
              alt={e.fullName}
              fill
              sizes="200px"
              unoptimized
              onError={() => setAvatarFailed(e.avatarUrl)}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>
      </div>

      {/* Full Name UPPERCASE, bold; below is italic position; below is short accent divider */}
      <div
        data-aos="fade-up"
        data-aos-delay="250"
        className="w-full min-w-0"
      >
        <h1
          className="ecard-fullname font-extrabold uppercase tracking-wide line-clamp-2 break-words pt-[0.08em]"
          style={{ color: "var(--pv-primary)" }}
        >
          {e.fullName || "HỌ TÊN NHÂN VIÊN"}
        </h1>
        <p
          className="ecard-position italic font-medium line-clamp-1"
          style={{ color: "var(--pv-body)" }}
        >
          {e.position || "Chức vụ"}
        </p>
        <div
          className="mx-auto md:mx-0 mt-[clamp(5px,1dvh,12px)] h-[2.5px] w-10 rounded-full"
          style={{ background: "var(--pv-accent)" }}
          aria-hidden="true"
        />
      </div>

      {/* Company Name in bold + subtitle QTM MEDIATECH.,JSC */}
      <div
        data-aos="fade-up"
        data-aos-delay="300"
        className="mt-[clamp(5px,1dvh,12px)] w-full min-w-0"
      >
        <h2
          className="ecard-company-name font-extrabold uppercase tracking-wide line-clamp-2 break-words"
          style={{ color: "var(--pv-strong)" }}
        >
          {e.company || "CÔNG TY CỔ PHẦN CÔNG NGHỆ TRUYỀN THÔNG QTM"}
        </h2>
        <p
          className="ecard-company-short font-bold uppercase tracking-[0.14em] line-clamp-1"
          style={{ color: "var(--pv-muted)" }}
        >
          ({e.companyShort || "QTM MEDIATECH.,JSC"})
        </p>
      </div>
    </div>
  );
}
