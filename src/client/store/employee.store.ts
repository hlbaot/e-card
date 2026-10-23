import { migrateCardTheme } from "@/shared/utils/migrate-theme";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockEmployees } from "@/data/mock/employees";
import type { Employee } from "@/shared/types/employee";
export const useEmployeeStore = create<{
  employees: Employee[];
  setEmployees: (employees: Employee[]) => void;
}>()(
  persist(
    (set) => ({
      employees: structuredClone(mockEmployees),
      setEmployees: (employees) => set({ employees: employees.map((e) => ({ ...e, theme: migrateCardTheme(e.theme) })) }),
    }),
    {
      name: "ecard-employees",
      skipHydration: true,
      // Normalize even version-0 records on every hydration (also strips old keys).
      merge: (persisted, current) => {
        const saved = persisted as { employees?: Employee[] } | undefined;
        return {
          ...current,
          employees: (saved?.employees ?? current.employees).map((employee) => ({
            ...employee, theme: migrateCardTheme(employee.theme),
          })),
        };
      },
    },
  ),
);
