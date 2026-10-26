import { useAuthStore } from "@/client/store/auth.store";
import type { AuthUser } from "@/shared/types";
import { withAuthLock } from "@/client/auth/session-lock";

export interface ApiRequestConfig {
  url?: string;
  baseURL?: string;
  method?: string;
  headers?: Record<string, string | undefined>;
  data?: unknown;
  withCredentials?: boolean;
  signal?: AbortSignal;
  validateStatus?: (status: number) => boolean;
  _retry?: boolean;
}

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: ApiRequestConfig;
}

export class ApiClientError<T = { error?: string }> extends Error {
  readonly isApiClientError = true;
  constructor(
    message: string,
    public readonly config: ApiRequestConfig,
    public readonly response?: ApiResponse<T>,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

const isFormData = (val: unknown): val is FormData =>
  Boolean(val && typeof val === "object" && typeof (val as FormData).append === "function");

async function executeFetch<T = unknown>(config: ApiRequestConfig): Promise<ApiResponse<T>> {
  const url = config.url?.startsWith("http")
    ? config.url
    : config.baseURL
      ? `${config.baseURL}${config.url ?? ""}`
      : config.url || "";

  if (url && (!url.startsWith("/api/") || url.includes("\\"))) {
    throw new Error("API path must be same-origin");
  }

  const headers: Record<string, string> = {};
  if (config.headers) {
    for (const [k, v] of Object.entries(config.headers)) {
      if (v !== undefined) headers[k] = String(v);
    }
  }

  if (isFormData(config.data)) {
    delete headers["Content-Type"];
    delete headers["content-type"];
  } else if (
    config.data !== undefined &&
    typeof config.data !== "string" &&
    !headers["Content-Type"] &&
    !headers["content-type"]
  ) {
    headers["Content-Type"] = "application/json";
  }

  const method = (config.method || "GET").toUpperCase();
  const init: RequestInit = {
    headers,
    credentials: config.withCredentials !== false ? "same-origin" : "omit",
    cache:
      method === "GET" &&
      /^\/api\/(?:admin\/(?:employees|stats)(?:\/|$)|cards(?:\/|$))/.test(url)
        ? "no-cache"
        : "no-store",
    signal: config.signal,
  };

  if (method !== "GET") {
    init.method = method;
  }

  if (config.data !== undefined) {
    init.body =
      typeof config.data === "string" || isFormData(config.data)
        ? (config.data as BodyInit)
        : JSON.stringify(config.data);
  }

  const res = await globalThis.fetch(url, init);
  const text = await res.text();
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  const response: ApiResponse<T> = {
    data: data as T,
    status: res.status,
    statusText: res.statusText,
    headers: Object.fromEntries(res.headers.entries()),
    config,
  };

  const isSuccess = config.validateStatus
    ? config.validateStatus(res.status)
    : res.status >= 200 && res.status < 300;

  if (isSuccess) {
    return response;
  }

  const errorMessage =
    typeof data === "object" && data !== null && "error" in data
      ? String((data as { error: string }).error)
      : `Yêu cầu thất bại với mã trạng thái ${res.status}`;

  throw new ApiClientError(
    errorMessage,
    config,
    response as ApiResponse<{ error?: string }>,
  );
}

let refreshing: Promise<boolean> | undefined;

export function refreshSession(): Promise<boolean> {
  refreshing ??= withAuthLock(async () => {
    try {
      const current = await executeFetch<{ user: AuthUser }>({
        url: "/api/auth/me",
        method: "GET",
        validateStatus: () => true,
      });
      if (current.status === 200 && current.data?.user) {
        useAuthStore.getState().setUser(current.data.user);
        return true;
      }
      if (current.status !== 401) {
        throw new Error("Không thể xác thực tài khoản. Vui lòng thử lại sau.");
      }

      const response = await executeFetch<{ user: AuthUser }>({
        url: "/api/auth/refresh",
        method: "POST",
        validateStatus: () => true,
      });
      if (response.status === 401) {
        useAuthStore.getState().setUser(null);
        return false;
      }
      if (response.status !== 200 || !response.data?.user) {
        throw new Error("Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.");
      }
      useAuthStore.getState().setUser(response.data.user);
      return true;
    } finally {
      refreshing = undefined;
    }
  });
  return refreshing;
}

async function requestWithInterceptors<T = unknown>(
  config: ApiRequestConfig,
): Promise<ApiResponse<T>> {
  try {
    return await executeFetch<T>(config);
  } catch (error) {
    if (error instanceof ApiClientError) {
      const url = config.url || "";
      if (
        error.response?.status === 401 &&
        !config._retry &&
        !url.includes("/api/auth/refresh") &&
        !url.includes("/api/auth/login") &&
        !url.includes("/api/auth/logout")
      ) {
        const retryConfig: ApiRequestConfig = { ...config, _retry: true };
        const refreshed = await refreshSession();
        if (refreshed) {
          return executeFetch<T>(retryConfig);
        }
        useAuthStore.getState().setUser(null);
      }
    }
    throw error;
  }
}

export const apiClient = {
  request<T = unknown>(config: ApiRequestConfig): Promise<ApiResponse<T>> {
    return requestWithInterceptors<T>(config);
  },
  get<T = unknown>(url: string, config?: Omit<ApiRequestConfig, "url" | "method">): Promise<ApiResponse<T>> {
    return requestWithInterceptors<T>({ ...config, url, method: "GET" });
  },
  post<T = unknown>(url: string, data?: unknown, config?: Omit<ApiRequestConfig, "url" | "method" | "data">): Promise<ApiResponse<T>> {
    return requestWithInterceptors<T>({ ...config, url, method: "POST", data });
  },
  patch<T = unknown>(url: string, data?: unknown, config?: Omit<ApiRequestConfig, "url" | "method" | "data">): Promise<ApiResponse<T>> {
    return requestWithInterceptors<T>({ ...config, url, method: "PATCH", data });
  },
  delete<T = unknown>(url: string, config?: Omit<ApiRequestConfig, "url" | "method">): Promise<ApiResponse<T>> {
    return requestWithInterceptors<T>({ ...config, url, method: "DELETE" });
  },
};

function toResponse(res: ApiResponse): Response {
  return {
    ok: res.status >= 200 && res.status < 300,
    status: res.status,
    statusText: res.statusText,
    json: async () => res.data,
    text: async () => (typeof res.data === "string" ? res.data : JSON.stringify(res.data)),
    headers: new Headers(res.headers),
  } as unknown as Response;
}

// Bridge tương thích cho code hoặc test còn dùng apiFetch
export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  if (!path.startsWith("/api/") || path.includes("\\")) throw new Error("API path must be same-origin");
  const send = async () =>
    apiClient.request({
      url: path,
      method: (options.method || "GET").toLowerCase(),
      data: options.body,
      headers: options.headers as Record<string, string>,
      validateStatus: () => true,
    });

  const response = await send();
  if (response.status !== 401 || !(await refreshSession())) {
    return toResponse(response);
  }

  const retried = await send();
  if (retried.status === 401) useAuthStore.getState().setUser(null);
  return toResponse(retried);
}
