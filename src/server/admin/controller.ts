import "server-only";
import type { NextRequest } from "next/server";
import { authJson } from "@/server/auth/http";
import { adminHandler, readJson } from "./http";
import { employeeInput, employeePatch } from "./dto";
import { adminEmployees } from "./runtime";

type Context = { params: Promise<{ id: string }> };
export const listEmployees = (request: NextRequest) => adminHandler(request, async () => authJson({ employees: await adminEmployees.list() }));
export const getEmployee = (request: NextRequest, context: Context) => adminHandler(request, async () => authJson({ employee: await adminEmployees.byId((await context.params).id) }));
export const createEmployee = (request: NextRequest) => adminHandler(request, async () => authJson({ employee: await adminEmployees.create(await readJson(request, employeeInput)) }, 201));
export const updateEmployee = (request: NextRequest, context: Context) => adminHandler(request, async () => authJson({ employee: await adminEmployees.update((await context.params).id, await readJson(request, employeePatch)) }));
export const toggleEmployee = (request: NextRequest, context: Context) => adminHandler(request, async () => authJson({ employee: await adminEmployees.toggle((await context.params).id) }));
export const deleteEmployee = (request: NextRequest, context: Context) => adminHandler(request, async () => authJson(await adminEmployees.remove((await context.params).id)));
export const getStats = (request: NextRequest) => adminHandler(request, async () => authJson(await adminEmployees.stats()));
