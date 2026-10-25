import { apiFetch } from "@/client/api/http";
import { useEmployeeStore } from "@/client/store/employee.store";
import type { Employee } from "@/shared/types/employee";

export type EmployeeInput = Omit<Employee, "id" | "slug" | "createdAt" | "updatedAt">;
export interface EmployeeStats { total: number; active: number; inactive: number }
export class EmployeeApiError extends Error {
  constructor(message: string, public status: number) { super(message); }
}
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await apiFetch(path, options);
  const data = await response.json();
  if (!response.ok) throw new EmployeeApiError(data.error || "Không thể tải dữ liệu nhân viên.", response.status);
  return data as T;
}
// Bỏ metadata có thể tồn tại trong state form edit trước khi gửi DTO lên server.
function inputBody(input: EmployeeInput) {
  const { fullName, position, company, companyShort, email, phone, zalo, website, offices, slogan, avatarUrl, isActive, allowIndexing, publicFields, theme } = input;
  return JSON.stringify({ fullName, position, company, companyShort, email, phone, zalo, website, offices, slogan, avatarUrl, isActive, allowIndexing, publicFields, theme });
}
function changed() {
  // Store chỉ chứa số phiên bản; dữ liệu thực luôn được đọc lại qua API.
  useEmployeeStore.getState().invalidate();
}
const root = "/api/admin/employees";
export const employeeService = {
  async getAll() {
    return (await request<{ employees: Employee[] }>(root)).employees;
  },
  async getById(id: string) {
    return (await request<{ employee: Employee }>(`${root}/${encodeURIComponent(id)}`)).employee;
  },
  async create(input: EmployeeInput) {
    const data = await request<{ employee: Employee }>(root, { method: "POST", headers: { "Content-Type": "application/json" }, body: inputBody(input) });
    changed();
    return data.employee;
  },
  async update(id: string, input: EmployeeInput) {
    const data = await request<{ employee: Employee }>(`${root}/${encodeURIComponent(id)}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: inputBody(input) });
    changed();
    return data.employee;
  },
  async remove(id: string) {
    await request(`${root}/${encodeURIComponent(id)}`, { method: "DELETE" });
    changed();
  },
  async toggleActive(id: string) {
    const data = await request<{ employee: Employee }>(`${root}/${encodeURIComponent(id)}/active`, { method: "PATCH" });
    changed();
    return data.employee;
  },
  getStats: () => request<EmployeeStats>("/api/admin/stats"),
  async uploadAvatar(file: File) {
    const body = new FormData();
    body.set("file", file);
    return (await request<{ url: string }>("/api/admin/uploads/avatar", { method: "POST", body })).url;
  },
};
