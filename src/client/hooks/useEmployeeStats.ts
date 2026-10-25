"use client";
import { useEffect, useState } from "react";
import { employeeService, type EmployeeStats } from "@/client/services/employee.service";
import { useEmployeeStore } from "@/client/store/employee.store";

export function useEmployeeStats() {
  const revision = useEmployeeStore((state) => state.revision);
  const [stats, setStats] = useState<EmployeeStats>({ total: 0, active: 0, inactive: 0 });
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    let sequence = 0;
    const load = () => {
      const current = ++sequence;
      void employeeService.getStats().then((result) => {
        if (active && current === sequence) { setStats(result); setError(""); setReady(true); }
      }).catch((reason) => {
        if (active && current === sequence) { setError(reason instanceof Error ? reason.message : "Không thể tải thống kê."); setReady(true); }
      });
    };
    load();
    const onFocus = () => { if (document.visibilityState === "visible") load(); };
    document.addEventListener("visibilitychange", onFocus);
    return () => { active = false; document.removeEventListener("visibilitychange", onFocus); };
  }, [revision]);
  return { ...stats, ready, error };
}
