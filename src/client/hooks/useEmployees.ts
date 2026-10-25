"use client";
import { useEffect, useState } from "react";
import { useEmployeeStore } from "@/client/store/employee.store";
import { employeeService } from "@/client/services/employee.service";
import { useAuthStore } from "@/client/store/auth.store";
import type { Employee } from "@/shared/types/employee";

export function useEmployees() {
  const revision = useEmployeeStore((state) => state.revision);
  const authenticated = useAuthStore((state) => state.authenticated);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!authenticated) return;
    let active = true;
    let sequence = 0;
    const load = () => {
      const current = ++sequence;
      void employeeService.getAll().then((data) => {
        if (active && current === sequence) { setEmployees(data); setError(""); setReady(true); }
      }).catch((reason) => {
        if (active && current === sequence) { setError(reason instanceof Error ? reason.message : "Không thể tải nhân viên."); setReady(true); }
      });
    };
    load();
    const onFocus = () => { if (document.visibilityState === "visible") load(); };
    document.addEventListener("visibilitychange", onFocus);
    return () => { active = false; document.removeEventListener("visibilitychange", onFocus); };
  }, [revision, authenticated]);
  return { employees: authenticated ? employees : [], ready: authenticated && ready, error, ...employeeService };
}
