export const locales = ["en", "vi"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";
export const LOCALE_COOKIE = "NEXT_LOCALE";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export function isValidLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

/**
 * Resolve active locale strictly from the NEXT_LOCALE cookie value.
 * Falls back to defaultLocale ('en') when missing or invalid.
 * Does NOT auto-detect from Accept-Language or geolocation.
 */
export function resolveLocale(cookieValue?: string | null): Locale {
  if (isValidLocale(cookieValue)) {
    return cookieValue;
  }
  return defaultLocale;
}

export function getIntlLocale(locale: Locale): string {
  return locale === "vi" ? "vi-VN" : "en-US";
}

