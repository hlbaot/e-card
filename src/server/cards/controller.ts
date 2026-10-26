import "server-only";
import { NextResponse } from "next/server";
import type { CardsResponse, CardResponse } from "@/shared/types";
import { conditionalJson } from "@/server/http-cache";
import { publicCards } from "./runtime";

// Không cache để card vừa ẩn/xóa không tiếp tục xuất hiện trong response public.
const json = (body: unknown, status = 200) => NextResponse.json(body, {
  status, headers: { "Cache-Control": "no-store" },
});
export async function listCards(request: Request) {
  try { return conditionalJson(request, { cards: await publicCards.list() } satisfies CardsResponse, "public"); }
  catch { return json({ error: "Không thể tải danh sách danh thiếp. Vui lòng thử lại." }, 503); }
}
export async function getCard(request: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;
    const card = await publicCards.bySlug(slug);
    return card ? conditionalJson(request, { card } satisfies CardResponse, "public") : json({ error: "Không tìm thấy danh thiếp." }, 404);
  } catch {
    // Không gửi thông tin kết nối DB hoặc lỗi nội bộ cho người dùng.
    return json({ error: "Không thể tải danh thiếp. Vui lòng thử lại." }, 503);
  }
}
