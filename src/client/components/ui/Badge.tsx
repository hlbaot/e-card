import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

export function Badge({
  children,
  withDot = true,
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  withDot?: boolean;
}) {
  return (
    <span className={cn("qtm-badge", className)} {...props}>
      {withDot && <i className="qtm-badge-dot" aria-hidden="true" />}
      {children}
    </span>
  );
}
