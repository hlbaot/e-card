import { ApiClientError, apiClient } from "./client";
import type { Employee, EmployeeInput, EmployeeStats, EmployeeResponse, EmployeesResponse, AvatarUploadResponse } from "@/shared/types";

export class EmployeeApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = "EmployeeApiError";
  }
}

function handleApiError(err: unknown, defaultMessage = "Không thể tải dữ liệu nhân viên."): never {
  if (err instanceof ApiClientError) {
    const message = err.response?.data?.error || err.message || defaultMessage;
    const status = err.response?.status || 500;
    throw new EmployeeApiError(message, status);
  }
  if (err instanceof EmployeeApiError) throw err;
  if (err instanceof Error) throw new EmployeeApiError(err.message, 500);
  throw new EmployeeApiError(defaultMessage, 500);
}

function sanitizeTheme(theme: EmployeeInput["theme"]) {
  const {
    templateId,
    businessCardType,
    styleId,
    backgroundId,
    primaryColor,
    avatarSize,
    avatarShape,
    buttonStyle,
    decor,
    shapes,
    showDecor,
    decorOpacity,
  } = theme;
  return {
    templateId: templateId || styleId || "bubble-blue",
    businessCardType: businessCardType ?? "qtm",
    backgroundId,
    primaryColor,
    avatarSize,
    avatarShape,
    buttonStyle,
    decor,
    shapes: shapes ?? {},
    ...(showDecor !== undefined ? { showDecor } : {}),
    ...(decorOpacity !== undefined ? { decorOpacity: Math.round(decorOpacity) } : {}),
  };
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
    offices: (offices ?? []).map(({ label, address }) => ({ label, address })),
    slogan,
    avatarUrl,
    isActive,
    allowIndexing,
    publicFields,
    theme: sanitizeTheme(theme),
  };
}

const root = "/api/admin/employees";

export const employeeApi = {
  async getAll(signal?: AbortSignal): Promise<Employee[]> {
    try {
      const res = await apiClient.get<EmployeesResponse>(root, { signal });
      return res.data.employees;
    } catch (err) {
      return handleApiError(err);
    }
  },

  async getById(id: string, signal?: AbortSignal): Promise<Employee> {
    try {
      const res = await apiClient.get<EmployeeResponse>(`${root}/${encodeURIComponent(id)}`, { signal });
      return res.data.employee;
    } catch (err) {
      return handleApiError(err);
    }
  },

  async create(input: EmployeeInput): Promise<Employee> {
    try {
      const res = await apiClient.post<EmployeeResponse>(root, sanitizeInput(input));
      return res.data.employee;
    } catch (err) {
      return handleApiError(err);
    }
  },

  async update(id: string, input: EmployeeInput): Promise<Employee> {
    try {
      const res = await apiClient.patch<EmployeeResponse>(
        `${root}/${encodeURIComponent(id)}`,
        sanitizeInput(input)
      );
      return res.data.employee;
    } catch (err) {
      return handleApiError(err);
    }
  },

  async remove(id: string): Promise<void> {
    try {
      await apiClient.delete(`${root}/${encodeURIComponent(id)}`);
    } catch (err) {
      return handleApiError(err);
    }
  },

  async toggleActive(id: string): Promise<Employee> {
    try {
      const res = await apiClient.patch<EmployeeResponse>(`${root}/${encodeURIComponent(id)}/active`);
      return res.data.employee;
    } catch (err) {
      return handleApiError(err);
    }
  },

  async getStats(signal?: AbortSignal): Promise<EmployeeStats> {
    try {
      const res = await apiClient.get<EmployeeStats>("/api/admin/stats", { signal });
      return res.data;
    } catch (err) {
      return handleApiError(err);
    }
  },

  async uploadAvatar(file: File): Promise<string> {
    try {
      const body = new FormData();
      body.set("file", file);
      const res = await apiClient.post<AvatarUploadResponse>("/api/admin/uploads/avatar", body);
      return res.data.url;
    } catch (err) {
      return handleApiError(err, "Không thể tải ảnh lên. Vui lòng thử lại.");
    }
  },
};

// Alias tương thích ngược với employeeService
export const employeeService = employeeApi;
