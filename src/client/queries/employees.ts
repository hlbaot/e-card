import { keepPreviousData, queryOptions, type QueryClient } from "@tanstack/react-query";
import { employeeApi } from "@/api/employee.api";
import type { Employee } from "@/shared/types";
import { queryKeys } from "./keys";

function hasEmployeeFormFields(candidate: Employee | undefined): candidate is Employee {
  return Boolean(
    candidate &&
      typeof candidate.id === "string" &&
      typeof candidate.fullName === "string" &&
      Array.isArray(candidate.offices) &&
      candidate.theme &&
      typeof candidate.theme.templateId === "string",
  );
}

export const employeesOptions = (userId: string) => queryOptions({
  queryKey: queryKeys.employees.list(userId),
  queryFn: ({ signal }) => employeeApi.getAll(signal),
  // A filter/page key may change; never borrow data from another account.
  placeholderData: (previous, query) => query?.queryKey[1] === userId ? keepPreviousData(previous) : undefined,
});
export const employeeOptions = (userId: string, id: string, client?: QueryClient) => {
  const listKey = queryKeys.employees.list(userId);
  return queryOptions({
    queryKey: queryKeys.employees.detail(userId, id),
    queryFn: ({ signal }) => employeeApi.getById(id, signal),
    initialData: () => {
      const found = client?.getQueryData<Employee[]>(listKey)?.find((e) => e.id === id);
      return hasEmployeeFormFields(found) ? found : undefined;
    },
    initialDataUpdatedAt: () => client?.getQueryState(listKey)?.dataUpdatedAt,
  });
};
