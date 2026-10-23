"use client";

import { Users, ContactRound, EyeOff } from "lucide-react";
import { StatCard } from "./StatCard";

export interface StatGridProps {
  total: number;
  active: number;
  inactive: number;
}

export function StatGrid({ total, active, inactive }: StatGridProps) {
  return (
    <section
      aria-label="Thống kê tổng quan"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <StatCard
        label="Tổng số nhân viên"
        value={total}
        note="Thành viên trong đội ngũ"
        icon={Users}
        tone="cyan"
      />
      <StatCard
        label="Danh thiếp đang bật"
        value={active}
        note="Sẵn sàng để kết nối"
        icon={ContactRound}
        tone="teal"
        progress={{ current: active, total }}
      />
      <StatCard
        label="Danh thiếp đã tắt"
        value={inactive}
        note="Không hiển thị công khai"
        icon={EyeOff}
        tone="muted"
      />
    </section>
  );
}
