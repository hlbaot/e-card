import "server-only";
import type { NextRequest } from "next/server";
import type { AuthResponse, ApiStatusResponse } from "@/shared/types";
import { serverAuth } from "./runtime";
import { AuthError } from "./service";
import { changePasswordInput, loginInput } from "./dto";
import {
  ACCESS_COOKIE, REFRESH_COOKIE, SESSION_COOKIE, assertSameOrigin, authHandler, authJson,
  clearAuthCookies, limitLogin, resetLoginLimit, setAuthCookies,
} from "./http";

export async function login(request: NextRequest) {
  return authHandler(async () => {
    assertSameOrigin(request);
    if (!request.headers.get("content-type")?.includes("application/json")) throw new AuthError("Yêu cầu không hợp lệ. Vui lòng thử lại.", 415);
    const body = await request.text();
    if (body.length > 4096) throw new AuthError("Thông tin đăng nhập vượt quá độ dài cho phép.", 413);
    let data;
    try { data = loginInput.parse(JSON.parse(body)); }
    catch { throw new AuthError("Email hoặc mật khẩu không hợp lệ. Vui lòng kiểm tra lại.", 400); }
    limitLogin(data.email);
    const result = await serverAuth.login(data.email, data.password);
    resetLoginLimit(data.email);
    const response = setAuthCookies(authJson({ user: result.user } satisfies AuthResponse), result);
    response.headers.set("Server-Timing", Object.entries(result.timings)
      .map(([name, duration]) => `${name};dur=${duration}`).join(", "));
    return response;
  });
}

export async function refresh(request: NextRequest) {
  // authHandler chuyển lỗi token thành 401, lỗi dịch vụ/DB thành 503.
  return authHandler(async () => {
    // Cookie được gửi tự động nên cần kiểm tra Origin để chống CSRF.
    assertSameOrigin(request);
    // Chỉ nhận refresh token từ cookie HttpOnly; token thiếu/sai/hết hạn sẽ bị từ chối.
    const result = await serverAuth.refresh(request.cookies.get(REFRESH_COOKIE)?.value ?? "");
    // Ghi đè cả hai cookie bằng token mới. JSON chỉ trả user, không lộ token cho JS.
    return setAuthCookies(authJson({ user: result.user } satisfies AuthResponse), result);
  });
}

export async function logout(request: NextRequest) {
  return authHandler(async () => {
    assertSameOrigin(request);
    const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
    const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
    const sessionToken = request.cookies.get(SESSION_COOKIE)?.value;
    const tokens = new Set([refreshToken, accessToken, sessionToken].filter((t): t is string => Boolean(t)));
    if (tokens.size === 0) {
      await serverAuth.logout("");
    } else {
      for (const token of tokens) {
        await serverAuth.logout(token);
      }
    }
    return clearAuthCookies(authJson({ success: true } satisfies ApiStatusResponse));
  });
}

export async function me(request: NextRequest) {
  return authHandler(async () => {
    // Kiểm tra chữ ký/hạn JWT và đối chiếu phiên trong DB để nhận biết logout/rotation.
    // Thiếu cookie hoặc phiên không hợp lệ sẽ được authHandler chuyển thành 401.
    const user = await serverAuth.currentUser(request.cookies.get(ACCESS_COOKIE)?.value ?? "");
    // Chỉ trả id/email/createdAt, không trả passwordHash hoặc token. authJson đặt no-store.
    return authJson({ user } satisfies AuthResponse);
  });
}

export async function changePassword(request: NextRequest) {
  return authHandler(async () => {
    assertSameOrigin(request);
    if (!request.headers.get("content-type")?.includes("application/json")) {
      throw new AuthError("Yêu cầu không hợp lệ. Vui lòng thử lại.", 415);
    }
    const body = await request.text();
    if (body.length > 4096) throw new AuthError("Dữ liệu vượt quá độ dài cho phép.", 413);
    let data;
    try {
      data = changePasswordInput.parse(JSON.parse(body));
    } catch {
      throw new AuthError("Dữ liệu mật khẩu không hợp lệ (mật khẩu mới tối thiểu 8 ký tự).", 400);
    }
    const token = request.cookies.get(ACCESS_COOKIE)?.value ?? "";
    // Chỉ người có phiên hợp lệ mới được thử mật khẩu hiện tại; giới hạn thử sai theo tài khoản.
    const user = await serverAuth.currentUser(token);
    limitLogin(`password:${user.id}`);
    await serverAuth.changePassword(token, data.currentPassword, data.newPassword);
    resetLoginLimit(`password:${user.id}`);
    return clearAuthCookies(authJson({ success: true, message: "Đổi mật khẩu thành công. Vui lòng đăng nhập lại." }));
  });
}
