import { mockEmployees } from "@/data/mock/employees";
import type { Employee } from "@/shared/types/employee";
import { localizeEmployee } from "@/shared/utils/localize";

/**
 * Server-side data access layer for employee cards.
 * Currently reads from mockEmployees; when migrating to Supabase,
 * only replace the implementation inside this file.
 */
export async function getAllServerEmployees(): Promise<Employee[]> {
  return mockEmployees.map((e) => localizeEmployee(structuredClone(e)));
}

/**
 * Returns all active employees (`isActive === true`).
 */
export async function getActiveEmployees(): Promise<Employee[]> {
  const all = await getAllServerEmployees();
  return all.filter((e) => e.isActive);
}

/**
 * Returns all employees that should appear in the sitemap (all active cards).
 * Used by `src/app/sitemap.ts`.
 */
export async function getIndexableEmployees(): Promise<Employee[]> {
  const all = await getAllServerEmployees();
  return all.filter((e) => e.isActive);
}

/**
 * Finds a public employee card by slug on the server.
 * Returns `null` if the slug does not exist or if `isActive === false`.
 */
export async function getPublicEmployeeBySlug(
  slug: string,
): Promise<Employee | null> {
  const all = await getAllServerEmployees();
  const found = all.find((e) => e.slug === slug);
  if (!found || !found.isActive) return null;
  return found;
}
