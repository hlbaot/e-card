"use client";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/client/store/auth.store";
import { statsOptions } from "@/client/queries/employees";

export function useEmployeeStats() {
  const userId = useAuthStore(state => state.user?.id);
  const query = useQuery({ ...statsOptions(userId ?? ""), enabled: Boolean(userId) });
  return { ...(query.data ?? { total: 0, active: 0, inactive: 0 }),
    ready: Boolean(userId) && !query.isPending, error: query.error?.message ?? "", isFetching: query.isFetching };
}
