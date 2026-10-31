"use client";

import { useContext, useTransition, type KeyboardEvent } from "react";
import { AppRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useLocale, useTranslations } from "next-intl";
import {
  locales,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  resolveLocale,
  type Locale,
} from "@/i18n/config";
import { setLocaleCookie } from "@/i18n/actions";
import {
  useClientLocaleSwitch,
  writeClientLocale,
} from "@/client/components/providers/I18nProvider";
import { cn } from "@/shared/utils/cn";

export interface LanguageSwitcherProps {
  className?: string;
  variant?: "dark" | "light" | "sidebar";
}

export function writeClientLocaleCookie(locale: Locale): string {
  const resolved = resolveLocale(locale);
  const cookieString = `${LOCALE_COOKIE}=${resolved}; Path=/; Max-Age=${LOCALE_COOKIE_MAX_AGE}; SameSite=Lax`;
  if (typeof document !== "undefined") {
    document.cookie = cookieString;
  }
  return cookieString;
}

export function LanguageSwitcher({
  className,
  variant = "dark",
}: LanguageSwitcherProps) {
  const rawLocale = useLocale();
  const localeSwitch = useClientLocaleSwitch();
  const activeLocale = localeSwitch?.locale ?? resolveLocale(rawLocale);
  const t = useTranslations("common");
  const router = useContext(AppRouterContext);
  const [isPending, startTransition] = useTransition();

  const handleSelect = async (nextLocale: Locale) => {
    if (nextLocale === activeLocale || isPending) return;
    writeClientLocaleCookie(nextLocale);
    writeClientLocale(nextLocale);
    localeSwitch?.setLocale(nextLocale);
    try {
      await setLocaleCookie(nextLocale);
    } catch {
      // Cookie was already written via document.cookie as fallback
    }
    startTransition(() => {
      router?.refresh();
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const nextLocale: Locale = activeLocale === "en" ? "vi" : "en";
    void handleSelect(nextLocale);
  };

  const displayLocales: readonly Locale[] =
    variant === "light" ? ["vi", "en"] : locales;

  return (
    <div
      role="group"
      aria-label={t("switchLanguage")}
      onKeyDown={handleKeyDown}
      data-testid="language-switcher"
      className={cn(
        "inline-flex items-center rounded-full text-xs font-semibold tracking-wider transition-colors select-none",
        variant === "light"
          ? "gap-0.5 bg-[#dff1fb] p-[3px] text-[#0b5884] shadow-[0_2px_8px_rgba(11,88,132,0.12)]"
          : variant === "sidebar"
            ? "w-full justify-between border border-white/10 bg-white/[0.04] p-1 text-slate-300"
            : "border border-white/15 bg-slate-900/75 p-0.5 text-slate-200 backdrop-blur-md",
        isPending && "opacity-75",
        className,
      )}
    >
      {displayLocales.map((item) => {
        const isActive = activeLocale === item;
        const label = item.toUpperCase();
        const ariaLabel =
          item === "en" ? t("switchToEnglish") : t("switchToVietnamese");

        return (
          <button
            key={item}
            type="button"
            disabled={isPending}
            aria-pressed={isActive}
            aria-label={ariaLabel}
            data-locale={item}
            onClick={() => void handleSelect(item)}
            className={cn(
              "cursor-pointer rounded-full leading-none transition-all focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-sky-400",
              variant === "light"
                ? "min-w-[38px] px-3 py-1.5 text-[13px] font-medium tracking-normal"
                : "px-2.5 py-1 text-[11px] font-bold",
              variant === "sidebar" && "flex-1 py-1.5 text-center",
              isActive
                ? variant === "light"
                  ? "bg-[#0b5884] text-white shadow-xs"
                  : "bg-sky-400 text-slate-950 shadow-xs"
                : variant === "light"
                  ? "bg-transparent text-[#0b5884] hover:bg-[#0b5884]/10"
                  : "text-slate-300 hover:text-white",
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
