import type { QueryClient } from "@tanstack/react-query";
import type { Employee, EmployeeStats } from "@/shared/types";
import { queryKeys } from "./keys";

export function cacheEmployee(client: QueryClient, userId: string, employee: Employee, created = false) {
  client.setQueriesData<Employee[]>({ queryKey: queryKeys.employees.list(userId) }, list => {
    if (!list) return list;
    const exists = list.some(e => e.id === employee.id);
    return exists ? list.map(e => e.id === employee.id ? employee : e) : created ? [employee, ...list] : list;
  });
  client.setQueryData(queryKeys.employees.detail(userId, employee.id), employee);
}
export function forgetEmployee(client: QueryClient, userId: string, id: string) {
  client.setQueriesData<Employee[]>({ queryKey: queryKeys.employees.list(userId) }, list => list?.filter(e => e.id !== id));
  client.removeQueries({ queryKey: queryKeys.employees.detail(userId, id), exact: true });
}
export async function invalidateEmployeeData(client: QueryClient) {
  await Promise.all([queryKeys.employees.all, queryKeys.stats.all, queryKeys.cards.all].map(queryKey => client.invalidateQueries({ queryKey })));
}
/** Roll back only this employee; another concurrent employee mutation survives. */
export function optimisticToggle(client: QueryClient, userId: string, id: string) {
  const listKey = queryKeys.employees.list(userId), detailKey = queryKeys.employees.detail(userId, id);
  const list = client.getQueryData<Employee[]>(listKey), detail = client.getQueryData<Employee>(detailKey);
  const before = detail ?? list?.find(e => e.id === id);
  if (!before) return { rollback() {} };
  const next = { ...before, isActive: !before.isActive };
  if (list) client.setQueryData(listKey, list.map(e => e.id === id ? { ...e, isActive: next.isActive } : e));
  if (detail) client.setQueryData(detailKey, { ...detail, isActive: next.isActive });
  const appliedList = client.getQueryData<Employee[]>(listKey)?.find(e => e.id === id);
  const appliedDetail = client.getQueryData<Employee>(detailKey);
  const statsKey = queryKeys.stats.detail(userId), delta = next.isActive ? 1 : -1;
  const stats = client.getQueryData<EmployeeStats>(statsKey);
  if (stats) client.setQueryData(statsKey, { ...stats, active: stats.active + delta, inactive: stats.inactive - delta });
  return { rollback() {
    let restored = false;
    client.setQueryData<Employee[]>(listKey, current => current?.map(e => {
      if (e.id === id && e === appliedList) { restored = true; return list!.find(value => value.id === id)!; }
      return e;
    }));
    if (detail && client.getQueryData(detailKey) === appliedDetail) { client.setQueryData(detailKey, detail); restored = true; }
    if (restored && stats) client.setQueryData<EmployeeStats>(statsKey, current => current && current.total === stats.total
      ? { ...current, active: current.active - delta, inactive: current.inactive + delta } : current);
  } };
}
