"use client";

import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/shared/utils/cn";

export interface StatCardProps {
  label: string;
  value: number;
  note: string;
  icon: LucideIcon;
  tone?: "cyan" | "teal" | "muted";
  progress?: {
    current: number;
    total: number;
  };
}

export function StatCard({
  label,
  value,
  note,
  icon: Icon,
  tone = "cyan",
  progress,
}: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced || value === 0) {
      return;
    }

    let rafId = 0;
    const duration = 600;
    const start = performance.now();

    const step = (now: number) => {
      const elapsed = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      setDisplayValue(Math.round(eased * value));
      if (elapsed < 1) {
        rafId = window.requestAnimationFrame(step);
      }
    };

    rafId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(rafId);
  }, [value]);

  const shownNumber =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? value
      : value === 0
        ? 0
        : displayValue;

  const formatted = String(shownNumber).padStart(2, "0");

  const iconToneClasses = {
    cyan: "bg-cyan-400/12 border-cyan-400/30 text-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.14)]",
    teal: "bg-teal-400/14 border-teal-400/30 text-teal-300 shadow-[0_0_16px_rgba(45,212,191,0.14)]",
    muted: "bg-white/[0.06] border-white/15 text-slate-300",
  }[tone];

  const dotClasses = {
    cyan: "bg-cyan-400 shadow-[0_0_8px_#22d3ee]",
    teal: "bg-teal-400 shadow-[0_0_8px_#2dd4bf]",
    muted: "bg-slate-400",
  }[tone];

  const ratio =
    progress && progress.total > 0
      ? Math.min(100, Math.round((progress.current / progress.total) * 100))
      : null;

  return (
    <div
      className={cn(
        "group relative flex items-start gap-4 rounded-2xl p-4 sm:p-5 min-h-[104px]",
        "bg-[var(--surface)] backdrop-blur-xl border border-white/[0.11]",
        "transition-all duration-200 hover:border-cyan-400/40 hover:shadow-[0_0_20px_rgba(34,211,238,0.14)]",
      )}
    >
      {/* Left Icon Box (44px) */}
      <div
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-transform duration-200 group-hover:scale-105",
          iconToneClasses,
        )}
      >
        <Icon size={20} />
      </div>

      {/* Right Content Stack */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[13px] font-medium text-[var(--text-body)] leading-snug">
            {label}
          </span>
          {ratio !== null && (
            <span className="font-mono text-xs font-semibold text-teal-300 tabular-nums">
              {ratio}%
            </span>
          )}
        </div>

        <strong className="mt-1 block text-[30px] font-bold leading-none tracking-tight text-[var(--ink)] tabular-nums">
          {formatted}
        </strong>

        <div className="mt-2 flex items-center gap-2 text-xs text-[var(--muted)]">
          <span
            aria-hidden="true"
            className={cn("h-2 w-2 shrink-0 rounded-full", dotClasses)}
          />
          <span className="truncate">{note}</span>
        </div>

        {ratio !== null && (
          <div
            aria-label={`Tỉ lệ đang bật ${ratio}%`}
            className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 transition-all duration-500"
              style={{ width: `${ratio}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
