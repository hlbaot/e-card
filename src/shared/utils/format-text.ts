import { defaultLocale, getIntlLocale, resolveLocale, type Locale } from "@/i18n/config";

/** Capitalize the first letter for display using locale-aware casing, preserving acronyms and other casing. */
export function capitalizeFirstLetter(value: string, locale: Locale = defaultLocale) {
  const intlLocale = getIntlLocale(resolveLocale(locale));
  return value.replace(/\S/u, (letter) => letter.toLocaleUpperCase(intlLocale));
}

export function formatNumberByLocale(
  value: number,
  locale: Locale = defaultLocale,
  options?: Intl.NumberFormatOptions,
): string {
  const intlLocale = getIntlLocale(resolveLocale(locale));
  return new Intl.NumberFormat(intlLocale, options).format(value);
}

export function formatDateByLocale(
  value: Date | string | number,
  locale: Locale = defaultLocale,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
  },
): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const intlLocale = getIntlLocale(resolveLocale(locale));
  return new Intl.DateTimeFormat(intlLocale, options).format(date);
}
