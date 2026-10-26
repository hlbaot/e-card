import "server-only";
import type { NextRequest, NextResponse } from "next/server";
import type { ZodType } from "zod";
import { serverAuth } from "@/server/auth/runtime";
import { AuthError } from "@/server/auth/service";
import { ACCESS_COOKIE, assertSameOrigin, authHandler } from "@/server/auth/http";

// Tương đương JwtAuthGuard: mọi API admin phải kiểm tra JWT và phiên DB ở đây.
export function adminHandler(request: NextRequest, action: () => Promise<NextResponse>) {
  return authHandler(async () => {
    const token = request.cookies.get(ACCESS_COOKIE)?.value ?? "";
    if (request.method === "GET") {
      // Chạy song song xác thực và truy vấn đọc; chỉ trả kết quả khi auth thành công.
      // Nếu auth thất bại, hủy bỏ kết quả action và luôn ưu tiên lỗi 401 từ auth.
      const [, outcome] = await Promise.all([
        serverAuth.currentUser(token),
        (async () => action())().then(
          (response) => ({ ok: true as const, response }),
          (error: unknown) => ({ ok: false as const, error }),
        ),
      ]);
      if (!outcome.ok) throw outcome.error;
      return outcome.response;
    }
    await serverAuth.currentUser(token);
    assertSameOrigin(request);
    return action();
  });
}
export async function readBody(request: Request, limit: number): Promise<Uint8Array<ArrayBuffer>> {
  if (Number(request.headers.get("content-length")) > limit) throw new AuthError("Dữ liệu vượt quá dung lượng cho phép.", 413);
  const reader = request.body?.getReader();
  if (!reader) return new Uint8Array();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > limit) {
        await reader.cancel();
        throw new AuthError("Dữ liệu vượt quá dung lượng cho phép.", 413);
      }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return bytes;
}
export async function readJson<T>(request: Request, schema: ZodType<T>): Promise<T> {
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") throw new AuthError("Yêu cầu phải là JSON.", 415);
  const bytes = await readBody(request, 64 * 1024);
  let input;
  try { input = JSON.parse(new TextDecoder().decode(bytes)); }
  catch { throw new AuthError("JSON không hợp lệ.", 400); }
  const result = schema.safeParse(input);
  if (!result.success) throw new AuthError(result.error.issues[0]?.message || "Dữ liệu nhân viên không hợp lệ.", 400);
  return result.data;
}
