import "server-only";
import { NextResponse } from "next/server";
import type { CardsResponse, CardResponse } from "@/shared/types";
import { conditionalJson } from "@/server/http-cache";
import { createVCard } from "@/shared/utils/vcard";
import { localizeEmployeeName } from "@/shared/utils/localize";
import { resolveLocale } from "@/i18n/config";
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

/** Serve a native contact file; visibility is checked live just like the card. */
export async function getContact(request: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;
    const card = await publicCards.bySlug(slug);
    if (!card) return json({ error: "Không tìm thấy danh thiếp." }, 404);
    const locale = resolveLocale(new URL(request.url).searchParams.get("lang"));
    const filename = card.slug.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 120) || "contact";
    const contact = { ...card, fullName: localizeEmployeeName(card.fullName, locale) };
    return new Response(createVCard(contact), { headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `inline; filename="${filename}.vcf"`,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    } });
  } catch {
    return json({ error: "Không thể tải liên hệ. Vui lòng thử lại." }, 503);
  }
}
