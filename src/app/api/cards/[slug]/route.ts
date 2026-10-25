import { getCard } from "@/server/cards/controller";

// GET /api/cards/:slug: kèm offices, company và theme; card ẩn/xóa trả 404.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const GET = getCard;
