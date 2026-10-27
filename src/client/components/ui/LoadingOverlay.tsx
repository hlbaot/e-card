"use client";

import { createPortal } from "react-dom";
import { Spinner } from "./Spinner";

export function LoadingOverlay({ show, label }: { show: boolean; label?: string }) {
  if (!show || typeof document === "undefined") return null;
  return createPortal(
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-3 bg-black/60 backdrop-blur-sm text-white"
    >
      <span className="text-[#22d3ee] drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]">
        <Spinner size={40} />
      </span>
      {label && <span className="text-sm font-medium">{label}</span>}
    </div>,
    document.body,
  );
}

