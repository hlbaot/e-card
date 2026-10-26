"use client";

import { useEffect, useRef, useState } from "react";
import { X, Smartphone, Monitor, Eye } from "lucide-react";
import type { Employee } from "@/shared/types";
import { ScaledECardViewport } from "./LivePreviewPanel";
import { cn } from "@/shared/utils/cn";

export interface PreviewModalProps {
  open: boolean;
  onClose: () => void;
  employee: Employee;
  returnFocusRef?: React.RefObject<HTMLElement | null>;
}

export function PreviewModal({
  open,
  onClose,
  employee,
  returnFocusRef,
}: PreviewModalProps) {
  const [device, setDevice] = useState<"mobile" | "desktop">("mobile");
  const [dragY, setDragY] = useState(0);
  const touchStartYRef = useRef<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 20);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const targetToRestore = returnFocusRef?.current;

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      if (targetToRestore) {
        window.setTimeout(() => targetToRestore.focus(), 10);
      }
    };
  }, [open, onClose, returnFocusRef]);

  if (!open) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0]?.clientY ?? null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartYRef.current === null) return;
    const delta = (e.touches[0]?.clientY ?? 0) - touchStartYRef.current;
    if (delta > 0) {
      setDragY(delta);
    }
  };

  const handleTouchEnd = () => {
    if (dragY > 90) {
      setDragY(0);
      touchStartYRef.current = null;
      onClose();
    } else {
      setDragY(0);
      touchStartYRef.current = null;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Xem trước danh thiếp"
      className="fixed inset-0 z-50 flex items-end lg:items-center justify-center bg-slate-950/75 backdrop-blur-md p-0 lg:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={
          dragY > 0
            ? {
                transform: `translateY(${dragY}px)`,
                transition: "none",
              }
            : undefined
        }
        className={cn(
          "relative flex flex-col justify-between overflow-hidden",
          "w-full h-[94dvh] rounded-t-3xl lg:rounded-3xl",
          device === "desktop"
            ? "lg:w-[min(1220px,95vw)] lg:h-[min(90dvh,820px)]"
            : "lg:w-[min(860px,92vw)] lg:h-[min(90dvh,880px)]",
          "border border-cyan-300/25 bg-[#081028]/95 backdrop-blur-2xl",
          "shadow-[0_24px_80px_rgba(2,6,23,0.9),0_0_40px_rgba(34,211,238,0.18)]",
          "px-4 pt-3 pb-[calc(14px+env(safe-area-inset-bottom,0px))] lg:p-6",
          "transition-all duration-200 ease-out",
        )}
      >
        {/* Mobile swipe handle */}
        <div
          aria-hidden="true"
          className="mx-auto mb-2 h-1.5 w-12 rounded-full bg-white/20 lg:hidden shrink-0"
        />

        {/* Modal Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-cyan-400/12 border border-cyan-400/35 text-cyan-300">
              <Eye size={16} />
            </span>
            <div>
              <h2 className="text-sm lg:text-base font-bold text-white tracking-tight">
                Xem trước danh thiếp trực tiếp
              </h2>
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-teal-400">
                ● Đồng bộ dữ liệu thời gian thực
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Device switcher */}
            <div
              role="group"
              aria-label="Chế độ khung hình xem trước"
              className="hidden sm:inline-flex items-center rounded-full border border-white/15 bg-white/[0.04] p-1"
            >
              <button
                type="button"
                onClick={() => setDevice("mobile")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.08em] cursor-pointer transition-all",
                  device === "mobile"
                    ? "bg-cyan-400/20 text-cyan-200 border border-cyan-400/50 shadow-[0_0_12px_rgba(34,211,238,0.25)]"
                    : "text-slate-400 hover:text-white border border-transparent",
                )}
              >
                <Smartphone size={13} />
                Điện thoại
              </button>
              <button
                type="button"
                onClick={() => setDevice("desktop")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.08em] cursor-pointer transition-all",
                  device === "desktop"
                    ? "bg-cyan-400/20 text-cyan-200 border border-cyan-400/50 shadow-[0_0_12px_rgba(34,211,238,0.25)]"
                    : "text-slate-400 hover:text-white border border-transparent",
                )}
              >
                <Monitor size={13} />
                Máy tính
              </button>
            </div>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Đóng xem trước"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-white cursor-pointer transition-all hover:border-cyan-400/60 hover:bg-cyan-400/15 hover:text-cyan-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
            >
              <X size={15} />
              <span className="hidden sm:inline">Đóng</span>
            </button>
          </div>
        </div>

        {/* Auto-scaling card stage (never scrolls) */}
        <div className="my-3 flex-1 min-h-0 w-full flex items-center justify-center overflow-hidden">
          <ScaledECardViewport
            employee={employee}
            mode={device}
            maxScale={1.12}
          />
        </div>

        {/* Footer hint */}
        <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-white/10 text-[11px] text-slate-400 shrink-0">
          <span className="hidden lg:inline font-mono text-[10px] tracking-[0.06em] uppercase">
            Nhấn phím ESC hoặc bấm ra ngoài để đóng
          </span>
          <span className="lg:hidden font-mono text-[10px] tracking-[0.06em] uppercase">
            Vuốt xuống hoặc bấm nút Đóng để quay lại chỉnh sửa
          </span>
          <span className="font-mono text-[10px] text-cyan-300/90">
            Tỉ lệ chuẩn · Tự động co vừa màn hình
          </span>
        </div>
      </div>
    </div>
  );
}
