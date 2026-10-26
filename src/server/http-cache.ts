import { createHash } from "node:crypto";
import { NextResponse } from "next/server";

export const PRIVATE_REVALIDATE = "private, max-age=0, must-revalidate";
// Public content can be hidden/deleted: require validation instead of serving
// an independently stale CDN copy after tag invalidation.
export const PUBLIC_REVALIDATE = "public, max-age=0, must-revalidate";

export interface CollectionVersion {
  count: number;
  maxUpdatedAt: string | null;
  activeCount?: number;
}

export function buildCollectionEtag(version: CollectionVersion): string {
  const token = `${version.count}:${version.activeCount ?? ""}:${version.maxUpdatedAt ?? "0"}`;
  return `W/"${Buffer.from(token).toString("base64url")}"`;
}

export function buildEntityEtag(id: string, updatedAt: string, isActive?: boolean): string {
  const token = `${id}:${updatedAt}:${isActive === undefined ? "" : isActive ? 1 : 0}`;
  return `W/"${Buffer.from(token).toString("base64url")}"`;
}

export function matchesIfNoneMatch(request: Request | undefined, etag: string): boolean {
  if (!request || !["GET", "HEAD"].includes(request.method || "GET")) return false;
  const header = request.headers.get("if-none-match");
  if (!header) return false;
  const normalize = (tag: string) => tag.trim().replace(/^W\//, "");
  const target = normalize(etag);
  return header.split(",").some((tag) => tag.trim() === "*" || normalize(tag) === target);
}

export function notModifiedResponse(
  etag: string,
  visibility: "private" | "public" = "private",
): NextResponse {
  const headers = new Headers({
    ETag: etag,
    "Cache-Control": visibility === "private" ? PRIVATE_REVALIDATE : PUBLIC_REVALIDATE,
  });
  if (visibility === "private") headers.set("Vary", "Cookie");
  return new NextResponse(null, { status: 304, headers });
}

export function conditionalJson(
  request: Request | undefined,
  data: unknown,
  visibility: "private" | "public" = "private",
  precomputedEtag?: string,
) {
  const body = JSON.stringify(data);
  const etag =
    precomputedEtag ?? `W/"${createHash("sha256").update(body).digest("base64url")}"`;
  if (matchesIfNoneMatch(request, etag)) {
    return notModifiedResponse(etag, visibility);
  }
  const headers = new Headers({
    ETag: etag,
    "Cache-Control": visibility === "private" ? PRIVATE_REVALIDATE : PUBLIC_REVALIDATE,
    "Content-Type": "application/json; charset=utf-8",
  });
  if (visibility === "private") headers.set("Vary", "Cookie");
  return new NextResponse(body, { status: 200, headers });
}
