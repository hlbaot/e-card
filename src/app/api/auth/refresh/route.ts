import { refresh } from "@/server/auth/controller";

// POST /api/auth/refresh: trình duyệt tự gửi cookie HttpOnly, không cần body.
// Dùng Node.js vì service tạo token bằng node:crypto và truy cập Prisma.
export const runtime = "nodejs";
export const POST = refresh;
