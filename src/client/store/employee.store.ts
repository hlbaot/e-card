import { create } from "zustand";

// UI state only. Employee records, loading and freshness live in React Query.
export const useEmployeeStore = create<{
  employeeSearch: string; cardSearch: string;
  setEmployeeSearch: (value: string) => void; setCardSearch: (value: string) => void;
}>(set => ({ employeeSearch: "", cardSearch: "",
  setEmployeeSearch: employeeSearch => set({ employeeSearch }),
  setCardSearch: cardSearch => set({ cardSearch }),
}));
