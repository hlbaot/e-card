import { listEmployees, createEmployee } from "@/server/admin/controller";
export const runtime = "nodejs";
export const GET = listEmployees;
export const POST = createEmployee;
