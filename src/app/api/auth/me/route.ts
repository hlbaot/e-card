import { me } from "@/server/auth/controller";

// GET /api/auth/me: AuthGuard dùng để kiểm tra phiên qua cookie access HttpOnly.
export const runtime = "nodejs";
export const GET = me;
