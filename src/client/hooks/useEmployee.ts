"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/client/store/auth.store";
import { employeeOptions } from "@/client/queries/employees";

export function useEmployee(id: string) {
  const userId = useAuthStore(state => state.user?.id) ?? "";
  const client = useQueryClient();
  return useQuery({
    ...employeeOptions(userId, id, client),
    enabled: Boolean(userId && id),
  });
}
