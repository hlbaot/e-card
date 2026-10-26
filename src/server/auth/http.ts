import "server-only";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { env } from "@/server/config/env";
import { ACCESS_TTL, REFRESH_TTL, AuthError } from "./service";
import { isAllowedAuthOrigin } from "./origin";

export const ACCESS_COOKIE = "ecard_access";
export const REFRESH_COOKIE = "ecard_refresh";
const cookieOptions = { httpOnly: true, secure: env.NODE_ENV === "production", sameSite: "lax" as const };
export function assertSameOrigin(request: NextRequest) {
  if (!isAllowedAuthOrigin(
    request.headers.get("origin"), request.url, env.NEXT_PUBLIC_SITE_URL,
    env.NODE_ENV, request.headers.get("sec-fetch-site"),
  )) {
    throw new AuthError("Bạn không có quyền thực hiện thao tác này.", 403);
  }
}
export function authJson(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", "Vary": "Cookie" } });
}
export function setAuthCookies(response: NextResponse, tokens: { accessToken: string; refreshToken: string }) {
  response.cookies.set(ACCESS_COOKIE, tokens.accessToken, { ...cookieOptions, path: "/", maxAge: ACCESS_TTL });
  response.cookies.set(REFRESH_COOKIE, tokens.refreshToken, { ...cookieOptions, path: "/api/auth", maxAge: REFRESH_TTL });
  return response;
}
export function clearAuthCookies(response: NextResponse) {
  response.cookies.set(ACCESS_COOKIE, "", { ...cookieOptions, path: "/", maxAge: 0 });
  response.cookies.set(REFRESH_COOKIE, "", { ...cookieOptions, path: "/api/auth", maxAge: 0 });
  return response;
}
export async function authHandler(action: () => Promise<NextResponse>) {
  try { return await action(); }
  catch (error) {
    if (error instanceof AuthError) return authJson({ error: error.message }, error.status);
    // Không bao giờ trả về lỗi hệ thống, hash hoặc thông tin kỹ thuật
    return authJson({ error: "Hệ thống đang bận. Vui lòng thử lại sau ít phút." }, 503);
  }
}
// Best-effort limiter per process; shared rate limiting belongs at the deployment edge.
const attempts = new Map<string, { count: number; until: number }>();
export function limitLogin(email: string) {
  const now = Date.now();
  for (const [key, entry] of attempts) if (entry.until <= now) attempts.delete(key);
  const key = email.toLowerCase();
  const entry = attempts.get(key) ?? { count: 0, until: now + 15 * 60 * 1000 };
  if (entry.count >= 10 || (!attempts.has(key) && attempts.size >= 10000)) throw new AuthError("Bạn đã thử đăng nhập quá nhiều lần. Vui lòng quay lại sau 15 phút.", 429);
  entry.count += 1;
  attempts.set(key, entry);
}
export function resetLoginLimit(email: string) { attempts.delete(email.toLowerCase()); }
