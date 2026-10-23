"use client";
import { use } from "react";
import { notFound } from "next/navigation";
import { useEmployees } from "@/client/hooks/useEmployees";
import { EmployeeForm } from "@/client/components/admin/EmployeeForm";
import { Skeleton } from "@/client/components/ui/Skeleton";
export function AdminEmployeeEditView({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { employees, ready } = useEmployees();
  if (!ready) return <Skeleton />;
  const employee = employees.find((e) => e.id === id);
  if (!employee) notFound();
  return <EmployeeForm key={id} employee={employee} />;
}
