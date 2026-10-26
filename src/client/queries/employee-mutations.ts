import { mutationOptions } from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";
import { employeeApi } from "@/api/employee.api";
import { useAuthStore } from "@/client/store/auth.store";
import { queryKeys } from "./keys";
import { cacheEmployee, forgetEmployee, invalidateEmployeeData, optimisticToggle } from "./employee-cache";
import type { EmployeeInput } from "@/shared/types";

export function employeeMutationOptions(client: QueryClient, userId: string) {
  const mutationKey = queryKeys.writes(userId), toggleKey = [...mutationKey, "toggle"];
  const currentSession = () => Boolean(userId && useAuthStore.getState().user?.id === userId);
  const assertSession = () => { if (!currentSession()) throw new Error("Phiên đăng nhập đã hết hạn."); };
  const settled = async () => {
    // Do not let one refetch overwrite a second optimistic write still in flight.
    if (currentSession() && client.isMutating({ mutationKey }) === 1) await invalidateEmployeeData(client);
  };
  const create = mutationOptions({ mutationKey,
    mutationFn: (input: EmployeeInput) => { assertSession(); return employeeApi.create(input); },
    onSuccess: employee => { if (currentSession()) cacheEmployee(client, userId, employee, true); }, onSettled: settled,
  });
  const update = mutationOptions({ mutationKey,
    mutationFn: ({ id, input }: { id: string; input: EmployeeInput }) => { assertSession(); return employeeApi.update(id, input); },
    onSuccess: employee => { if (currentSession()) cacheEmployee(client, userId, employee); }, onSettled: settled,
  });
  const remove = mutationOptions({ mutationKey,
    mutationFn: (id: string) => { assertSession(); return employeeApi.remove(id); },
    onSuccess: (_, id) => { if (currentSession()) forgetEmployee(client, userId, id); }, onSettled: settled,
  });
  const toggle = mutationOptions({ mutationKey: toggleKey,
    mutationFn: (id: string) => { assertSession(); return employeeApi.toggleActive(id); },
    onMutate: async id => {
      assertSession();
      await Promise.all([queryKeys.employees.all, queryKeys.stats.all, queryKeys.cards.all].map(queryKey => client.cancelQueries({ queryKey })));
      assertSession();
      return optimisticToggle(client, userId, id);
    },
    onError: (_, __, context) => { if (currentSession()) context?.rollback(); },
    onSuccess: employee => { if (currentSession()) cacheEmployee(client, userId, employee); }, onSettled: settled,
  });
  const upload = mutationOptions({ mutationKey,
    mutationFn: (file: File) => { assertSession(); return employeeApi.uploadAvatar(file); }, onSettled: settled,
  });
  return { create, update, remove, toggle, upload };
}
