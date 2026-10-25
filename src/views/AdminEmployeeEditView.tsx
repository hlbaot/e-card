"use client";
import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { employeeService, EmployeeApiError } from "@/client/services/employee.service";
import { useEmployeeStore } from "@/client/store/employee.store";
import type { Employee } from "@/shared/types/employee";
import { EmployeeForm } from "@/client/components/admin/EmployeeForm";
import { Skeleton } from "@/client/components/ui/Skeleton";
export function AdminEmployeeEditView({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const revision = useEmployeeStore((state) => state.revision);
  const [result, setResult] = useState<{ id: string; employee?: Employee; missing?: boolean; error?: string }>();
  useEffect(() => {
    let active = true;
    void employeeService.getById(id).then((employee) => {
      if (active) setResult({ id, employee });
    }).catch((error) => {
      if (active) setResult(error instanceof EmployeeApiError && error.status === 404
        ? { id, missing: true } : { id, error: error instanceof Error ? error.message : "Không thể tải nhân viên." });
    });
    return () => { active = false; };
  }, [id, revision]);
  if (!result || result.id !== id) return <Skeleton />;
  if (result.missing) notFound();
  if (result.error) return <p role="alert" className="panel text-red-400">{result.error}</p>;
  return <EmployeeForm key={id} employee={result.employee} />;
}
