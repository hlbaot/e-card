"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useEmployees } from "@/client/hooks/useEmployees";
import { Skeleton } from "@/client/components/ui/Skeleton";
import { PageHeader } from "@/client/components/admin/dashboard/PageHeader";
import { StatGrid } from "@/client/components/admin/dashboard/StatGrid";
import { PromoBanner } from "@/client/components/admin/dashboard/PromoBanner";
import { TeamTable } from "@/client/components/admin/dashboard/TeamTable";
import { translateErrorMessage } from "@/i18n/error-map";

export function AdminDashboardView() {
  const { employees, ready, error } = useEmployees();
  const t = useTranslations("admin.dashboard");
  const tRoot = useTranslations();

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
      {error && (
        <p role="alert" className="panel text-red-400">
          {translateErrorMessage(error, tRoot)}
        </p>
      )}
      <div>
        <PageHeader
          title={t("title")}
          subtitle={t("subtitle")}
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
