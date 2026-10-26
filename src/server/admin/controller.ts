import "server-only";
import type { NextRequest } from "next/server";
import type { EmployeesResponse, EmployeeResponse, ApiStatusResponse, EmployeeStats, Employee } from "@/shared/types";
import {
  buildCollectionEtag,
  buildEntityEtag,
  conditionalJson,
  matchesIfNoneMatch,
  notModifiedResponse,
} from "@/server/http-cache";
import { publicCardCache } from "@/server/cards/cache";
import { authJson } from "@/server/auth/http";
import { adminHandler, readJson } from "./http";
import { employeeInput, employeePatch } from "./dto";
import { adminEmployees } from "./runtime";

async function written<T>(result: Promise<T>): Promise<T> {
  const value = await result;
  publicCardCache.invalidate();
  return value;
}

function listEtagFromEmployees(employees: Employee[]): string {
  let maxUpdatedAt: string | null = null;
  for (const emp of employees) {
    if (!maxUpdatedAt || emp.updatedAt > maxUpdatedAt) {
      maxUpdatedAt = emp.updatedAt;
    }
  }
  return buildCollectionEtag({ count: employees.length, maxUpdatedAt });
}

type Context = { params: Promise<{ id: string }> };
export const listEmployees = (request: NextRequest) =>
  adminHandler(request, async () => {
    if (request.headers.get("if-none-match")) {
      const version = await adminEmployees.listVersion();
      const etag = buildCollectionEtag(version);
      if (matchesIfNoneMatch(request, etag)) {
        return notModifiedResponse(etag, "private");
      }
      const employees = await adminEmployees.list();
      return conditionalJson(
        request,
        { employees } satisfies EmployeesResponse,
        "private",
        listEtagFromEmployees(employees),
      );
    }
    const employees = await adminEmployees.list();
    return conditionalJson(
      request,
      { employees } satisfies EmployeesResponse,
      "private",
      listEtagFromEmployees(employees),
    );
  });

export const getEmployee = (request: NextRequest, context: Context) =>
  adminHandler(request, async () => {
    const { id } = await context.params;
    if (request.headers.get("if-none-match")) {
      const version = await adminEmployees.byIdVersion(id);
      const etag = buildEntityEtag(version.id, version.updatedAt, version.isActive);
      if (matchesIfNoneMatch(request, etag)) {
        return notModifiedResponse(etag, "private");
      }
    }
    const employee = await adminEmployees.byId(id);
    const etag = buildEntityEtag(employee.id, employee.updatedAt, employee.isActive);
    return conditionalJson(
      request,
      { employee } satisfies EmployeeResponse,
      "private",
      etag,
    );
  });
export const createEmployee = (request: NextRequest) => adminHandler(request, async () => authJson({ employee: await written(adminEmployees.create(await readJson(request, employeeInput))) } satisfies EmployeeResponse, 201));
export const updateEmployee = (request: NextRequest, context: Context) => adminHandler(request, async () => authJson({ employee: await written(adminEmployees.update((await context.params).id, await readJson(request, employeePatch))) } satisfies EmployeeResponse));
export const toggleEmployee = (request: NextRequest, context: Context) => adminHandler(request, async () => authJson({ employee: await written(adminEmployees.toggle((await context.params).id)) } satisfies EmployeeResponse));
export const deleteEmployee = (request: NextRequest, context: Context) => adminHandler(request, async () => authJson(await written(adminEmployees.remove((await context.params).id)) satisfies ApiStatusResponse));
export const getStats = (request: NextRequest) => adminHandler(request, async () => conditionalJson(request, await adminEmployees.stats() satisfies EmployeeStats));
