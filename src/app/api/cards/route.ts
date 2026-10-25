import { listCards } from "@/server/cards/controller";

// GET /api/cards: không yêu cầu token, chỉ trả card active và chưa xóa.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const GET = listCards;
