import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { LOCALE_COOKIE, resolveLocale, type Locale } from "./config";
import enMessages from "@/messages/en.json";
import viMessages from "@/messages/vi.json";

const messageDictionaries = {
  en: enMessages,
  vi: viMessages,
} as const;

export function getMessagesForLocale(locale: Locale) {
  return messageDictionaries[locale] ?? messageDictionaries.en;
}

export async function getRequestLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const rawLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  return resolveLocale(rawLocale);
}

export default getRequestConfig(async () => {
  const locale = await getRequestLocale();
  return {
    locale,
    messages: getMessagesForLocale(locale),
  };
});

