import { createHash } from "node:crypto";
import { NextResponse } from "next/server";

export const PRIVATE_REVALIDATE = "private, max-age=0, must-revalidate";
// Public content can be hidden/deleted: require validation instead of serving
// an independently stale CDN copy after tag invalidation.
export const PUBLIC_REVALIDATE = "public, max-age=0, must-revalidate";
export function conditionalJson(request: Request | undefined, data: unknown, visibility: "private" | "public" = "private") {
  const body = JSON.stringify(data);
  const etag = `W/"${createHash("sha256").update(body).digest("base64url")}"`;
  const headers = new Headers({ ETag: etag, "Cache-Control": visibility === "private" ? PRIVATE_REVALIDATE : PUBLIC_REVALIDATE });
  if (visibility === "private") headers.set("Vary", "Cookie");
  const normalize = (tag: string) => tag.trim().replace(/^W\//, "");
  const matches = request?.headers.get("if-none-match")?.split(",").some(tag => tag.trim() === "*" || normalize(tag) === normalize(etag));
  if (matches && ["GET", "HEAD"].includes(request?.method ?? "GET")) return new NextResponse(null, { status: 304, headers });
  headers.set("Content-Type", "application/json; charset=utf-8");
  return new NextResponse(body, { status: 200, headers });
}
