import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

export function Card({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div className={cn("panel", className)} {...props}>
      {children}
    </div>
  );
}
