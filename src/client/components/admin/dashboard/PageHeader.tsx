"use client";

import type { ReactNode } from "react";

export interface PageHeaderProps {
  title: string;
  subtitle: string;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-[26px] sm:text-[28px] font-bold tracking-tight text-[var(--ink)] leading-tight">
          {title}
        </h1>
        <p className="mt-1.5 text-sm text-[var(--text-body)] leading-relaxed">
          {subtitle}
        </p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}
