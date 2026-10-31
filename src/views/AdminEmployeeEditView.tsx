"use client";
import { use } from "react";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { EmployeeApiError } from "@/api/employee.api";
import { useEmployee } from "@/client/hooks/useEmployee";
import { EmployeeForm } from "@/client/components/admin/EmployeeForm";
import { Skeleton } from "@/client/components/ui/Skeleton";
import { translateErrorMessage } from "@/i18n/error-map";

export function AdminEmployeeEditView({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const query = useEmployee(id);
  const tRoot = useTranslations();
  if (!query.data && query.isPending) return <Skeleton />;
  if (query.error instanceof EmployeeApiError && query.error.status === 404) notFound();
  if (!query.data) {
    return (
      <p role="alert" className="panel text-red-400">
        {translateErrorMessage(query.error, tRoot, "errors.loadEmployee")}
      </p>
    );
  }
  return <EmployeeForm key={id} employee={query.data} />;
}
