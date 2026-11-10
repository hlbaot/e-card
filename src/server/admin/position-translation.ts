import "server-only";
import { z } from "zod";
import { AuthError } from "@/server/auth/service";
import { findTextTranslation } from "@/shared/utils/localize";
import { locales } from "@/i18n/config";

export const positionTranslationInput = z.object({
  title: z.string().trim().min(1).max(150),
  source: z.enum(locales),
}).strict();

const googleTranslation = z.object({
  data: z.object({
    translations: z.tuple([z.object({ translatedText: z.string().trim().min(1).max(150) })]),
  }),
});

export async function suggestPositionTranslation({ title, source }: z.infer<typeof positionTranslationInput>) {
  const target = source === "vi" ? "en" : "vi";
  const knownTitle = findTextTranslation(title, target);
  if (knownTitle) return knownTitle;

  const key = process.env.GOOGLE_CLOUD_TRANSLATION_API_KEY?.trim();
  if (!key) throw new AuthError("Google Cloud Translation chưa được cấu hình.", 503);

  try {
    const response = await fetch("https://translation.googleapis.com/language/translate/v2", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({ q: title, source, target, format: "text" }),
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(5000),
    });
    if (response.ok) {
      const result = googleTranslation.safeParse(await response.json());
      if (result.success) return result.data.data.translations[0].translatedText;
    }
  } catch {
    // Keep provider errors and credentials out of the client response.
  }
  throw new AuthError("Không thể gợi ý bản dịch chức vụ.", 502);
}
