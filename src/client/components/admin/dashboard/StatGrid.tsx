"use client";

import { Users, ContactRound, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { StatCard } from "./StatCard";

export interface StatGridProps {
  total: number;
  active: number;
  inactive: number;
}

export function StatGrid({ total, active, inactive }: StatGridProps) {
  const t = useTranslations("admin.dashboard.stats");
  return (
    <section
      aria-label={t("aria")}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <StatCard
        label={t("totalLabel")}
        value={total}
        note={t("totalNote")}
        icon={Users}
        tone="cyan"
      />
      <StatCard
        label={t("activeLabel")}
        value={active}
        note={t("activeNote")}
        icon={ContactRound}
        tone="teal"
        progress={{ current: active, total }}
      />
      <StatCard
        label={t("inactiveLabel")}
        value={inactive}
        note={t("inactiveNote")}
        icon={EyeOff}
        tone="muted"
      />
    </section>
  );
}
