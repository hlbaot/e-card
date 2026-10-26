import "server-only";
import type { NextRequest } from "next/server";
import type { EmployeesResponse, EmployeeResponse, ApiStatusResponse, EmployeeStats } from "@/shared/types";
import { conditionalJson } from "@/server/http-cache";
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

type Context = { params: Promise<{ id: string }> };
export const listEmployees = (request: NextRequest) => adminHandler(request, async () => conditionalJson(request, { employees: await adminEmployees.list() } satisfies EmployeesResponse));
export const getEmployee = (request: NextRequest, context: Context) => adminHandler(request, async () => conditionalJson(request, { employee: await adminEmployees.byId((await context.params).id) } satisfies EmployeeResponse));
export const createEmployee = (request: NextRequest) => adminHandler(request, async () => authJson({ employee: await written(adminEmployees.create(await readJson(request, employeeInput))) } satisfies EmployeeResponse, 201));
export const updateEmployee = (request: NextRequest, context: Context) => adminHandler(request, async () => authJson({ employee: await written(adminEmployees.update((await context.params).id, await readJson(request, employeePatch))) } satisfies EmployeeResponse));
export const toggleEmployee = (request: NextRequest, context: Context) => adminHandler(request, async () => authJson({ employee: await written(adminEmployees.toggle((await context.params).id)) } satisfies EmployeeResponse));
export const deleteEmployee = (request: NextRequest, context: Context) => adminHandler(request, async () => authJson(await written(adminEmployees.remove((await context.params).id)) satisfies ApiStatusResponse));
export const getStats = (request: NextRequest) => adminHandler(request, async () => conditionalJson(request, await adminEmployees.stats() satisfies EmployeeStats));
