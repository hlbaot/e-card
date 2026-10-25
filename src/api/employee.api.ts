import { apiClient } from "./client";
import { useEmployeeStore } from "@/client/store/employee.store";
import type { Employee } from "@/shared/types/employee";
import { AxiosError } from "axios";

export type EmployeeInput = Omit<Employee, "id" | "slug" | "createdAt" | "updatedAt">;
export interface EmployeeStats {
  total: number;
  active: number;
  inactive: number;
}

export class EmployeeApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = "EmployeeApiError";
  }
}

function handleAxiosError(err: unknown, defaultMessage = "Không thể tải dữ liệu nhân viên."): never {
  if (err instanceof AxiosError) {
    const message = err.response?.data?.error || err.message || defaultMessage;
    const status = err.response?.status || 500;
    throw new EmployeeApiError(message, status);
  }
  if (err instanceof EmployeeApiError) throw err;
  if (err instanceof Error) throw new EmployeeApiError(err.message, 500);
  throw new EmployeeApiError(defaultMessage, 500);
}

// Bỏ metadata có thể tồn tại trong state form edit trước khi gửi DTO lên server.
function sanitizeInput(input: EmployeeInput) {
  const {
    fullName,
    position,
    company,
    companyShort,
    email,
    phone,
    zalo,
    website,
    offices,
    slogan,
    avatarUrl,
    isActive,
    allowIndexing,
    publicFields,
    theme,
  } = input;
  return {
    fullName,
    position,
    company,
    companyShort,
    email,
    phone,
    zalo,
    website,
    offices,
    slogan,
    avatarUrl,
    isActive,
    allowIndexing,
    publicFields,
    theme,
  };
}

function changed() {
  useEmployeeStore.getState().invalidate();
}

const root = "/api/admin/employees";

export const employeeApi = {
  async getAll(): Promise<Employee[]> {
    try {
      const res = await apiClient.get<{ employees: Employee[] }>(root);
      return res.data.employees;
    } catch (err) {
      return handleAxiosError(err);
    }
  },

  async getById(id: string): Promise<Employee> {
    try {
      const res = await apiClient.get<{ employee: Employee }>(`${root}/${encodeURIComponent(id)}`);
      return res.data.employee;
    } catch (err) {
      return handleAxiosError(err);
    }
  },

  async create(input: EmployeeInput): Promise<Employee> {
    try {
      const res = await apiClient.post<{ employee: Employee }>(root, sanitizeInput(input));
      changed();
      return res.data.employee;
    } catch (err) {
      return handleAxiosError(err);
    }
  },

  async update(id: string, input: EmployeeInput): Promise<Employee> {
    try {
      const res = await apiClient.patch<{ employee: Employee }>(
        `${root}/${encodeURIComponent(id)}`,
        sanitizeInput(input)
      );
      changed();
      return res.data.employee;
    } catch (err) {
      return handleAxiosError(err);
    }
  },

  async remove(id: string): Promise<void> {
    try {
      await apiClient.delete(`${root}/${encodeURIComponent(id)}`);
      changed();
    } catch (err) {
      return handleAxiosError(err);
    }
  },

  async toggleActive(id: string): Promise<Employee> {
    try {
      const res = await apiClient.patch<{ employee: Employee }>(`${root}/${encodeURIComponent(id)}/active`);
      changed();
      return res.data.employee;
    } catch (err) {
      return handleAxiosError(err);
    }
  },

  async getStats(): Promise<EmployeeStats> {
    try {
      const res = await apiClient.get<EmployeeStats>("/api/admin/stats");
      return res.data;
    } catch (err) {
      return handleAxiosError(err);
    }
  },

  async uploadAvatar(file: File): Promise<string> {
    try {
      const body = new FormData();
      body.set("file", file);
      const res = await apiClient.post<{ url: string }>("/api/admin/uploads/avatar", body);
      return res.data.url;
    } catch (err) {
      return handleAxiosError(err, "Không thể tải ảnh lên. Vui lòng thử lại.");
    }
  },
};

// Alias tương thích ngược với employeeService
export const employeeService = employeeApi;
