"use client";

import { useEffect, useRef, useState } from "react";
import type { Employee } from "@/shared/types/employee";
import { ECard } from "@/client/components/card/ECard";
import { ProfileView } from "@/client/components/card/ProfileView";
import { PreviewToggleButton } from "./PreviewToggleButton";

export interface ScaledECardViewportProps {
  employee: Employee;
  /**
   * - "panel": fills the right-hand LivePreviewPanel completely (expands to full frame width & height)
   * - "mobile": 9:19 portrait phone preview in PreviewModal
   * - "desktop": horizontal 2-column desktop detail layout (ProfileView) in PreviewModal
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
  const cardRef = useRef<HTMLDivElement>(null);

  const [metrics, setMetrics] = useState<{
    baseWidth: number;
    minHeight: number;
    scale: number;
    cardHeight: number;
  }>(() => {
    if (mode === "desktop") {
      return {
        baseWidth: 1120,
        minHeight: 650,
        scale: 0.85,
        cardHeight: 650,
      };
    }
    if (mode === "panel") {
      return {
        baseWidth: 420,
        minHeight: 580,
        scale: 0.95,
        cardHeight: 580,
      };
    }
    return {
      baseWidth: 380,
      minHeight: 780,
      scale: 0.85,
      cardHeight: 780,
    };
  });

  useEffect(() => {
    const stageEl = stageRef.current;
    const cardEl = cardRef.current;
    if (!stageEl || !cardEl) return;

    const recalc = () => {
      const availW = stageEl.clientWidth;
      const availH = stageEl.clientHeight;
      if (availW <= 0 || availH <= 0) return;

      if (mode === "desktop") {
        const baseW = 1120;
        const baseH = 650;
        const scaleW = (availW - 4) / baseW;
        const scaleH = (availH - 4) / baseH;
        const nextScale = Math.max(0.25, Math.min(maxScale, scaleW, scaleH));
        setMetrics((prev) =>
          Math.abs(prev.scale - nextScale) < 0.002 &&
          prev.baseWidth === baseW &&
          prev.cardHeight === baseH
            ? prev
            : {
                baseWidth: baseW,
                minHeight: baseH,
                scale: nextScale,
                cardHeight: baseH,
              },
        );
        return;
      }

      if (mode === "panel") {
        // Fill the entire preview frame while keeping 100% of the card visible:
        // Match the card's aspect ratio to the available stage aspect ratio.
        const stageAspect = availW / availH;
        const measuredContentH = cardEl.scrollHeight || 560;
        // Pick a baseHeight that fits all content comfortably (at least 560px),
        // and derive baseWidth from stageAspect so scaleW === scaleH.
        const targetBaseW = 410;
        const targetMinH = Math.max(540, Math.round(targetBaseW / stageAspect));
        const actualH = Math.max(measuredContentH, targetMinH);
        const adjustedBaseW = Math.max(
          360,
          Math.min(540, Math.round(actualH * stageAspect)),
        );
        const finalMinH = Math.round(adjustedBaseW / stageAspect);
        const finalH = Math.max(measuredContentH, finalMinH);

        const scaleW = availW / adjustedBaseW;
        const scaleH = availH / finalH;
        const nextScale = Math.max(0.3, Math.min(1.25, scaleW, scaleH));

        setMetrics((prev) => {
          if (
            Math.abs(prev.scale - nextScale) < 0.003 &&
            Math.abs(prev.baseWidth - adjustedBaseW) < 2 &&
            Math.abs(prev.cardHeight - finalH) < 2
          ) {
            return prev;
          }
          return {
            baseWidth: adjustedBaseW,
            minHeight: finalMinH,
            scale: nextScale,
            cardHeight: finalH,
          };
        });
        return;
      }

      // mode === "mobile" (in PreviewModal)
      const baseW = 450;
      const minH = 760;
      const naturalH = Math.max(cardEl.offsetHeight, minH);
      const scaleW = (availW - 8) / baseW;
      const scaleH = (availH - 8) / naturalH;
      const nextScale = Math.max(0.25, Math.min(maxScale, scaleW, scaleH));

      setMetrics((prev) => {
        if (
          Math.abs(prev.scale - nextScale) < 0.002 &&
          Math.abs(prev.cardHeight - naturalH) < 1 &&
          prev.baseWidth === baseW
        ) {
          return prev;
        }
        return {
          baseWidth: baseW,
          minHeight: minH,
          scale: nextScale,
          cardHeight: naturalH,
        };
      });
    };

    recalc();

    const observer = new ResizeObserver(recalc);
    observer.observe(stageEl);
    observer.observe(cardEl);
    window.addEventListener("resize", recalc);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", recalc);
    };
  }, [mode, maxScale, employee]);

  const scaledW = Math.round(metrics.baseWidth * metrics.scale);
  const scaledH = Math.round(metrics.cardHeight * metrics.scale);

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
          ref={cardRef}
          className={`ecard-scaled-frame absolute top-0 left-0 shrink-0 ${
            mode === "desktop"
              ? "ecard-scaled-desktop"
              : mode === "panel"
                ? "ecard-scaled-panel"
                : "ecard-scaled-mobile"
          }`}
          style={{
            width: `${metrics.baseWidth}px`,
            minWidth: `${metrics.baseWidth}px`,
            maxWidth: `${metrics.baseWidth}px`,
            minHeight: `${metrics.minHeight}px`,
            transform: `scale(${metrics.scale})`,
            transformOrigin: "top left",
          }}
        >
          {mode === "desktop" ? (
            <ProfileView employee={employee} />
          ) : (
            <ECard employee={employee} variant="preview" />
          )}
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
