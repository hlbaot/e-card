"use client";

import { useMemo } from "react";
import { useEmployees } from "@/client/hooks/useEmployees";
import { Skeleton } from "@/client/components/ui/Skeleton";
import { PageHeader } from "@/client/components/admin/dashboard/PageHeader";
import { StatGrid } from "@/client/components/admin/dashboard/StatGrid";
import { PromoBanner } from "@/client/components/admin/dashboard/PromoBanner";
import { TeamTable } from "@/client/components/admin/dashboard/TeamTable";

export function AdminDashboardView() {
  const { employees, ready, error } = useEmployees();

  const { total, active, inactive } = useMemo(() => {
    const totalCount = employees.length;
    const activeCount = employees.reduce(
      (sum, emp) => sum + (emp.isActive ? 1 : 0),
      0,
    );
    return {
      total: totalCount,
      active: activeCount,
      inactive: totalCount - activeCount,
    };
  }, [employees]);

  if (!ready) return <Skeleton />;

  return (
    <div className="admin-fade-in mx-auto w-full max-w-[1280px] space-y-6">
      {error && <p role="alert" className="panel text-red-400">{error}</p>}
      <div>
        <PageHeader
          title="Tổng quan"
          subtitle="Chào mừng bạn đến với không gian quản trị E-card."
        />
      </div>

      <div>
        <StatGrid total={total} active={active} inactive={inactive} />
      </div>

      <div>
        <PromoBanner />
      </div>

      <div>
        <TeamTable employees={employees.slice(0, 5)} totalCount={total} />
      </div>
    </div>
  );
}
