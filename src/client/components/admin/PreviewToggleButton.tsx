"use client";

import { forwardRef } from "react";
import { Eye, Maximize2 } from "lucide-react";
import { cn } from "@/shared/utils/cn";

export interface PreviewToggleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "header" | "fab";
  label?: string;
}

export const PreviewToggleButton = forwardRef<
  HTMLButtonElement,
  PreviewToggleButtonProps
>(function PreviewToggleButton(
  { variant = "header", label, className, ...props },
  ref,
) {
  if (variant === "fab") {
    return (
      <button
        ref={ref}
        type="button"
        aria-label="Xem trước toàn màn hình"
        className={cn(
          "preview-fab lg:hidden fixed right-4 bottom-[calc(82px+env(safe-area-inset-bottom,0px))] z-30",
          "inline-flex items-center gap-2 rounded-full px-4 py-2.5",
          "bg-[#0B1430]/95 text-white border border-cyan-400/45 backdrop-blur-xl",
          "shadow-[0_8px_28px_rgba(2,6,23,0.75),0_0_20px_rgba(34,211,238,0.28)]",
          "font-mono text-[11px] font-bold uppercase tracking-[0.1em]",
          "cursor-pointer transition-all duration-200",
          "hover:border-cyan-300 hover:bg-cyan-400/15 hover:shadow-[0_0_24px_rgba(34,211,238,0.45)]",
          "active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400",
          className,
        )}
        {...props}
      >
        <Eye size={16} className="text-cyan-400 shrink-0" />
        <span>{label ?? "Xem trước"}</span>
      </button>
    );
  }

  return (
    <button
      ref={ref}
      type="button"
      aria-label="Xem trước toàn màn hình"
      className={cn(
        "preview-toggle-btn group relative z-10 inline-flex items-center gap-2",
        "rounded-full px-3.5 py-1.5",
        "bg-white/[0.05] text-white border border-white/20 backdrop-blur-md",
        "font-mono text-[11px] font-bold uppercase tracking-[0.12em]",
        "cursor-pointer select-none transition-all duration-200",
        "hover:border-cyan-400/70 hover:bg-cyan-400/12 hover:text-cyan-200 hover:shadow-[0_0_20px_rgba(34,211,238,0.25)]",
        "active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400",
        className,
      )}
      {...props}
    >
      <Eye
        size={15}
        className="text-cyan-400 transition-transform duration-200 group-hover:scale-110 shrink-0"
      />
      <span>{label ?? "XEM TRƯỚC TRỰC TIẾP"}</span>
      <Maximize2
        size={12}
        className="text-slate-400 opacity-75 transition-all duration-200 group-hover:text-cyan-300 group-hover:opacity-100 shrink-0"
      />
    </button>
  );
});
