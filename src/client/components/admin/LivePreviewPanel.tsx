"use client";

import { useEffect, useRef, useState } from "react";
import type { Employee } from "@/shared/types/employee";
import { ECard } from "@/client/components/card/ECard";
import { PreviewToggleButton } from "./PreviewToggleButton";

export interface ScaledECardViewportProps {
  employee: Employee;
  /**
   * - "panel": fixed 390 × 694 mobile canvas fitted to the panel
   * - "mobile": same fixed portrait canvas in PreviewModal
   * - "desktop": desktop viewport containing the shared portrait profile
   */
  mode?: "panel" | "mobile" | "desktop";
  maxScale?: number;
  className?: string;
}

export function ScaledECardViewport({
  employee,
  mode = "mobile",
  maxScale = 1.15,
  className = "",
}: ScaledECardViewportProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const baseWidth = mode === "desktop" ? 1120 : 390;
  const baseHeight = mode === "desktop" ? 760 : 694;
  const [scale, setScale] = useState(0.8);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const recalc = () => setScale(Math.max(0.05, Math.min(
      maxScale, stage.clientWidth / baseWidth, stage.clientHeight / baseHeight,
    )));
    recalc();
    const observer = new ResizeObserver(recalc);
    observer.observe(stage);
    return () => observer.disconnect();
  }, [baseWidth, baseHeight, maxScale]);

  useEffect(() => {
    stageRef.current?.querySelector(".qtm-card-scroll")?.scrollTo({ top: 0 });
  }, [employee.theme.templateId]);

  const scaledW = baseWidth * scale;
  const scaledH = baseHeight * scale;

  return (
    <div
      ref={stageRef}
      className={`flex-1 min-h-0 w-full h-full flex items-center justify-center overflow-hidden select-none ${className}`}
    >
      <div
        className="relative shrink-0"
        style={{
          width: `${scaledW}px`,
          height: `${scaledH}px`,
        }}
      >
        <div
          className="qtm-preview-frame absolute top-0 left-0 shrink-0"
          style={{
            width: baseWidth,
            height: baseHeight,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <div className="qtm-preview-device">
            <ECard employee={employee} variant="preview" />
          </div>
        </div>
      </div>
    </div>
  );
}

export interface LivePreviewPanelProps {
  employee: Employee;
  onOpenModal: () => void;
  toggleButtonRef?: React.RefObject<HTMLButtonElement | null>;
}

export function LivePreviewPanel({
  employee,
  onOpenModal,
  toggleButtonRef,
}: LivePreviewPanelProps) {
  return (
    <aside
      aria-label="Khung xem trước trực tiếp"
      className="live-preview-panel h-full w-full overflow-hidden flex flex-col justify-between rounded-2xl border border-[var(--line)] bg-[var(--surface)]/75 backdrop-blur-xl px-3.5 py-3 shadow-[0_16px_44px_rgba(2,6,23,0.45)]"
    >
      {/* Top header */}
      <div className="relative z-10 flex items-center justify-between gap-2 pb-2 shrink-0 border-b border-white/[0.07]">
        <PreviewToggleButton
          ref={toggleButtonRef}
          onClick={onOpenModal}
          variant="header"
        />
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-teal-400 shrink-0">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_#2dd4bf]" />
          Cập nhật tức thì
        </span>
      </div>

      {/* Center auto-scaled card stage (expands to fill frame) */}
      <div className="my-1.5 flex-1 min-h-0 w-full flex items-center justify-center overflow-hidden rounded-xl">
        <ScaledECardViewport employee={employee} mode="panel" maxScale={1.2} />
      </div>

      {/* Bottom caption */}
      <p className="shrink-0 pt-1.5 border-t border-white/[0.06] text-center font-mono text-[10px] tracking-[0.04em] text-[var(--muted)]">
        Mọi thay đổi sẽ được hiển thị ngay tại đây · Bấm biểu tượng con mắt để
        phóng to
      </p>
    </aside>
  );
}
