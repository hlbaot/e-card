import type { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

export function SectionTitle({
  tag,
  title,
  highlight,
  subtitle,
  align = "left",
  className,
}: {
  tag?: string;
  title: ReactNode;
  highlight?: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {tag && (
        <div className="eyebrow">
          <span>{tag}</span>
        </div>
      )}
      <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
        {title}{" "}
        {highlight && <span className="qtm-gradient-text">{highlight}</span>}
      </h2>
      {subtitle && (
        <p className="text-sm text-[#B6C2D9] max-w-2xl">{subtitle}</p>
      )}
    </div>
  );
}
