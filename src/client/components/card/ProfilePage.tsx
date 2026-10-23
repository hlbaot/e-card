"use client";

import { notFound } from "next/navigation";
import type { Employee } from "@/shared/types/employee";
import { useEmployees } from "@/client/hooks/useEmployees";
import { ProfileView } from "./ProfileView";

export function ProfilePage({ employee }: { employee: Employee }) {
  const { employees, ready } = useEmployees();

  if (ready) {
    const clientMatch = employees.find((item) => item.slug === employee.slug);
    if (clientMatch) {
      if (!clientMatch.isActive) notFound();
      return <ProfileView employee={clientMatch} />;
    }
  }

  return <ProfileView employee={employee} />;
}
