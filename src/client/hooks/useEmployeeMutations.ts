"use client";
import { useMutation, useMutationState, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/client/store/auth.store";
import { queryKeys } from "@/client/queries/keys";
import { employeeMutationOptions } from "@/client/queries/employee-mutations";
import type { EmployeeInput } from "@/shared/types";

export function useEmployeeMutations() {
  const client = useQueryClient(), userId = useAuthStore(state => state.user?.id) ?? "";
  const options = employeeMutationOptions(client, userId);
  const create = useMutation(options.create), update = useMutation(options.update), remove = useMutation(options.remove);
  const toggle = useMutation(options.toggle), upload = useMutation(options.upload);
  const pendingToggles = useMutationState({ filters: { mutationKey: [...queryKeys.writes(userId), "toggle"], status: "pending" }, select: m => m.state.variables as string });
  return {
    create: create.mutateAsync, update: (id: string, input: EmployeeInput) => update.mutateAsync({ id, input }),
    remove: remove.mutateAsync,
    toggleActive: (id: string) => {
      if (client.isMutating({ mutationKey: options.toggle.mutationKey, predicate: mutation => mutation.state.variables === id })) {
        return Promise.reject(new Error("Đang cập nhật trạng thái. Vui lòng chờ."));
      }
      return toggle.mutateAsync(id);
    },
    uploadAvatar: upload.mutateAsync,
    isToggling: (id: string) => pendingToggles.includes(id),
  };
}
