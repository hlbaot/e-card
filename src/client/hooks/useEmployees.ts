"use client";
import { useEffect, useState } from "react";
import { useEmployeeStore } from "@/client/store/employee.store";
import { employeeService } from "@/client/services/employee.service";
import { useHydration } from "./useHydration";
import { localizeEmployee } from "@/shared/utils/localize";
import type { Employee } from "@/shared/types/employee";
export function useEmployees() {
  const ready = useHydration();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!ready) return;
    let active = true;
    const refresh = () => {
      void employeeService.getAll().then((data) => {
        if (active) {
          setEmployees(data.map(localizeEmployee));
          setLoaded(true);
        }
      });
    };
    refresh();
    const unsubscribe = useEmployeeStore.subscribe(refresh);
    return () => {
      active = false;
      unsubscribe();
    };
  }, [ready]);
  return { employees, ready: ready && loaded, ...employeeService };
}
