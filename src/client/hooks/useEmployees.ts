"use client";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/client/store/auth.store";
import { employeesOptions } from "@/client/queries/employees";

export function useEmployees() {
  const userId = useAuthStore(state => state.user?.id);
  const query = useQuery({ ...employeesOptions(userId ?? ""), enabled: Boolean(userId) });
  return { employees: userId ? query.data ?? [] : [], ready: Boolean(userId) && !query.isPending,
    error: query.error?.message ?? "", isFetching: query.isFetching };
}
