"use client";

import type { ReactNode } from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from "lucide-react";
import { cn } from "@/shared/utils/cn";

export type AlertVariant = "error" | "success" | "warning" | "info";

export interface AlertProps {
  variant?: AlertVariant;
  title?: ReactNode;
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}

const variantConfig: Record<
  AlertVariant,
  {
    icon: typeof AlertCircle;
    containerClass: string;
    iconClass: string;
    titleClass: string;
    role: "alert" | "status";
    ariaLive: "assertive" | "polite";
  }
> = {
  error: {
    icon: AlertCircle,
    containerClass:
      "bg-[rgba(248,113,113,0.12)] border-[rgba(248,113,113,0.32)] text-[#fca5a5] shadow-[0_0_20px_rgba(248,113,113,0.08)]",
    iconClass: "text-[#f87171]",
    titleClass: "text-white font-semibold",
    role: "alert",
    ariaLive: "assertive",
  },
  warning: {
    icon: AlertTriangle,
    containerClass:
      "bg-[rgba(245,158,11,0.12)] border-[rgba(245,158,11,0.32)] text-[#fcd34d] shadow-[0_0_20px_rgba(245,158,11,0.08)]",
    iconClass: "text-[#f59e0b]",
    titleClass: "text-white font-semibold",
    role: "alert",
    ariaLive: "assertive",
  },
  success: {
    icon: CheckCircle2,
    containerClass:
      "bg-[rgba(45,212,191,0.12)] border-[rgba(45,212,191,0.32)] text-[#5eead4] shadow-[0_0_20px_rgba(45,212,191,0.08)]",
    iconClass: "text-[#2dd4bf]",
    titleClass: "text-white font-semibold",
    role: "status",
    ariaLive: "polite",
  },
  info: {
    icon: Info,
    containerClass:
      "bg-[rgba(34,211,238,0.12)] border-[rgba(34,211,238,0.32)] text-[#67e8f9] shadow-[0_0_20px_rgba(34,211,238,0.08)]",
    iconClass: "text-[#22d3ee]",
    titleClass: "text-white font-semibold",
    role: "status",
    ariaLive: "polite",
  },
};

export function Alert({
  variant = "info",
  title,
  children,
  onClose,
  className,
}: AlertProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div
      role={config.role}
      aria-live={config.ariaLive}
      className={cn(
        "ui-alert relative flex items-start gap-3 rounded-xl border p-3.5 text-xs transition-all duration-200 backdrop-blur-md",
        config.containerClass,
        className,
      )}
    >
      <Icon
        size={18}
        className={cn("mt-0.5 shrink-0", config.iconClass)}
        aria-hidden="true"
      />
      <div className="flex-1 min-w-0">
        {title && (
          <div className={cn("text-sm mb-1 leading-snug", config.titleClass)}>
            {title}
          </div>
        )}
        <div className="leading-relaxed break-words">{children}</div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng thông báo"
          className="ml-1 -mr-1 -mt-1 rounded-lg p-1 text-inherit opacity-70 hover:opacity-100 hover:bg-white/10 transition-colors cursor-pointer shrink-0"
        >
          <X size={15} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
