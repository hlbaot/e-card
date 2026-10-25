import { getEmployee, updateEmployee, deleteEmployee } from "@/server/admin/controller";
export const runtime = "nodejs";
export const GET = getEmployee;
export const PATCH = updateEmployee;
export const DELETE = deleteEmployee;
