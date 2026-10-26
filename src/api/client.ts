import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/client/store/auth.store";
import type { AuthUser } from "@/shared/types";
import { withAuthLock } from "@/client/auth/session-lock";

// Adapter fetch tùy biến tương thích cả browser, Next.js và test runner
const fetchAdapter = async (config: InternalAxiosRequestConfig) => {
  const url = config.url?.startsWith("http")
    ? config.url
    : (config.baseURL ? `${config.baseURL}${config.url}` : config.url || "");

  const headers: Record<string, string> = {};
  if (config.headers) {
    for (const [k, v] of Object.entries(config.headers)) {
      if (v !== undefined && typeof v !== "object") {
        headers[k] = String(v);
      }
    }
  }

  const isFormData = (val: unknown): val is FormData =>
    Boolean(val && typeof val === "object" && typeof (val as FormData).append === "function");

  if (isFormData(config.data)) {
    delete headers["Content-Type"];
    delete headers["content-type"];
  }

  const init: RequestInit = {
    headers,
    credentials: config.withCredentials ? "same-origin" : "omit",
    cache: (!config.method || config.method.toUpperCase() === "GET") &&
      /^\/api\/(?:admin\/(?:employees|stats)(?:\/|$)|cards(?:\/|$))/.test(url)
      ? "no-cache" : "no-store",
    signal: config.signal as AbortSignal | undefined,
  };

  if (config.method && config.method.toUpperCase() !== "GET") {
    init.method = config.method.toUpperCase();
  }

  if (config.data !== undefined) {
    init.body = typeof config.data === "string" || isFormData(config.data)
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

  const response: AxiosResponse = {
    data,
    status: res.status,
    statusText: res.statusText,
    headers: Object.fromEntries(res.headers.entries()),
    config,
    request: {},
  };

  const isSuccess = config.validateStatus
    ? config.validateStatus(res.status)
    : res.status >= 200 && res.status < 300;

  if (isSuccess) {
    return response;
  }

  const errorMessage = typeof data === "object" && data !== null && "error" in data
    ? String((data as { error: string }).error)
    : `Yêu cầu thất bại với mã trạng thái ${res.status}`;

  const err = new AxiosError(
    errorMessage,
    AxiosError.ERR_BAD_RESPONSE,
    config,
    {},
    response
  );
  throw err;
};

export const apiClient = axios.create({
  adapter: fetchAdapter,
  withCredentials: true,
});

let refreshing: Promise<boolean> | undefined;

export function refreshSession(): Promise<boolean> {
  refreshing ??= withAuthLock(async () => {
    try {
      const current = await apiClient.get<{ user: AuthUser }>("/api/auth/me", {
        validateStatus: () => true,
      });
      if (current.status === 200 && current.data?.user) {
        useAuthStore.getState().setUser(current.data.user);
        return true;
      }
      if (current.status !== 401) {
        throw new Error("Không thể xác thực tài khoản. Vui lòng thử lại sau.");
      }

      const response = await apiClient.post<{ user: AuthUser }>("/api/auth/refresh", undefined, {
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

// Request interceptor: bảo vệ chống injection / sai origin
apiClient.interceptors.request.use((config) => {
  if (config.url && (!config.url.startsWith("/api/") || config.url.includes("\\"))) {
    throw new Error("API path must be same-origin");
  }
  return config;
});

// Response interceptor: tự động refresh phiên làm việc khi gặp 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    const url = originalRequest?.url || "";

    // Không tự động refresh nếu chính endpoint là refresh/login/logout
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !url.includes("/api/auth/refresh") &&
      !url.includes("/api/auth/login") &&
      !url.includes("/api/auth/logout")
    ) {
      originalRequest._retry = true;
      const refreshed = await refreshSession();
      if (refreshed) {
        return apiClient(originalRequest);
      }
      useAuthStore.getState().setUser(null);
    }
    return Promise.reject(error);
  }
);

function toResponse(axiosRes: AxiosResponse): Response {
  return {
    ok: axiosRes.status >= 200 && axiosRes.status < 300,
    status: axiosRes.status,
    statusText: axiosRes.statusText,
    json: async () => axiosRes.data,
    text: async () => (typeof axiosRes.data === "string" ? axiosRes.data : JSON.stringify(axiosRes.data)),
    headers: new Headers(),
  } as unknown as Response;
}

// Bridge tương thích cho code hoặc test còn dùng apiFetch
export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  if (!path.startsWith("/api/") || path.includes("\\")) throw new Error("API path must be same-origin");
  const send = async () => {
    return apiClient.request({
      url: path,
      method: (options.method || "GET").toLowerCase(),
      data: options.body,
      headers: options.headers as Record<string, string>,
      validateStatus: () => true,
    });
  };

  const response = await send();
  if (response.status !== 401 || !(await refreshSession())) {
    return toResponse(response);
  }

  const retried = await send();
  if (retried.status === 401) useAuthStore.getState().setUser(null);
  return toResponse(retried);
}
