"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/client/store/auth.store";
import { employeeOptions } from "@/client/queries/employees";
import { queryKeys } from "@/client/queries/keys";
import type { Employee } from "@/shared/types";

export function useEmployee(id: string) {
  const userId = useAuthStore(state => state.user?.id) ?? "";
  const client = useQueryClient(), listKey = queryKeys.employees.list(userId);
  return useQuery({ ...employeeOptions(userId, id), enabled: Boolean(userId && id),
    initialData: () => client.getQueryData<Employee[]>(listKey)?.find(e => e.id === id),
    initialDataUpdatedAt: () => client.getQueryState(listKey)?.dataUpdatedAt,
  });
}
