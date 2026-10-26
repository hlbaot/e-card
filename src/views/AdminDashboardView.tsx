"use client";

import { useEmployees } from "@/client/hooks/useEmployees";
import { useEmployeeStats } from "@/client/hooks/useEmployeeStats";
import { Skeleton } from "@/client/components/ui/Skeleton";
import { PageHeader } from "@/client/components/admin/dashboard/PageHeader";
import { StatGrid } from "@/client/components/admin/dashboard/StatGrid";
import { PromoBanner } from "@/client/components/admin/dashboard/PromoBanner";
import { TeamTable } from "@/client/components/admin/dashboard/TeamTable";

export function AdminDashboardView() {
  const { employees, ready, error } = useEmployees();
  const stats = useEmployeeStats();

  if (!ready || !stats.ready) return <Skeleton />;

  const { total, active, inactive } = stats;

  return (
    <div className="admin-fade-in mx-auto w-full max-w-[1280px] space-y-6">
      {(error || stats.error) && <p role="alert" className="panel text-red-400">{error || stats.error}</p>}
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
