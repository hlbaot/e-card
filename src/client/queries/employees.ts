import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { employeeApi } from "@/api/employee.api";
import { queryKeys } from "./keys";

export const employeesOptions = (userId: string) => queryOptions({
  queryKey: queryKeys.employees.list(userId),
  queryFn: ({ signal }) => employeeApi.getAll(signal),
  // A filter/page key may change; never borrow data from another account.
  placeholderData: (previous, query) => query?.queryKey[1] === userId ? keepPreviousData(previous) : undefined,
});
export const employeeOptions = (userId: string, id: string) => queryOptions({
  queryKey: queryKeys.employees.detail(userId, id),
  queryFn: ({ signal }) => employeeApi.getById(id, signal),
});
export const statsOptions = (userId: string) => queryOptions({
  queryKey: queryKeys.stats.detail(userId), queryFn: ({ signal }) => employeeApi.getStats(signal),
});
