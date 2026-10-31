"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { NextIntlClientProvider } from "next-intl";
import enMessages from "@/messages/en.json";
import viMessages from "@/messages/vi.json";
import {
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  isValidLocale,
  resolveLocale,
  type Locale,
} from "@/i18n/config";
import { setLocaleCookie } from "@/i18n/actions";

const MESSAGES_MAP = {
  en: enMessages,
  vi: viMessages,
} as const;

const LOCALE_STORAGE_KEY = LOCALE_COOKIE;
const LOCALE_SYNC_EVENT = "qtm:locale-change";

export function readClientLocale(): Locale | null {
  if (typeof document !== "undefined") {
    const cookies = document.cookie ? document.cookie.split("; ") : [];
    for (const entry of cookies) {
      const eqIdx = entry.indexOf("=");
      if (eqIdx === -1) continue;
      const name = entry.slice(0, eqIdx).trim();
      const val = entry.slice(eqIdx + 1).trim();
      if (name === LOCALE_COOKIE && isValidLocale(val)) {
        return val;
      }
    }
  }
  if (typeof window !== "undefined") {
    try {
      const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
      if (isValidLocale(stored)) {
        return stored;
      }
    } catch {
      // Ignore storage access errors
    }
  }
  return null;
}

export function writeClientLocale(locale: Locale): string {
  const resolved = resolveLocale(locale);
  const cookieString = `${LOCALE_COOKIE}=${resolved}; Path=/; Max-Age=${LOCALE_COOKIE_MAX_AGE}; SameSite=Lax`;
  if (typeof document !== "undefined") {
    document.cookie = cookieString;
    document.documentElement.lang = resolved;
  }
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, resolved);
    } catch {
      // Ignore storage errors
    }
  }
  return cookieString;
}

function subscribeLocale(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }
  const handleStorage = (event: StorageEvent) => {
    if (event.key === LOCALE_STORAGE_KEY && isValidLocale(event.newValue)) {
      writeClientLocale(event.newValue);
      onStoreChange();
    }
  };
  const handleSync = () => {
    const detected = readClientLocale();
    if (detected) {
      writeClientLocale(detected);
    }
    onStoreChange();
  };
  const handleVisibility = () => {
    if (document.visibilityState === "visible") {
      handleSync();
    }
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(LOCALE_SYNC_EVENT, handleSync);
  window.addEventListener("focus", handleSync);
  document.addEventListener("visibilitychange", handleVisibility);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(LOCALE_SYNC_EVENT, handleSync);
    window.removeEventListener("focus", handleSync);
    document.removeEventListener("visibilitychange", handleVisibility);
  };
}

interface LocaleContextValue {
  locale: Locale;
  setLocale: (nextLocale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function useClientLocaleSwitch() {
  return useContext(LocaleContext);
}

export function I18nProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: ReactNode;
}) {
  const fallback = resolveLocale(initialLocale);
  const locale = useSyncExternalStore<Locale>(
    subscribeLocale,
    () => readClientLocale() ?? fallback,
    () => fallback,
  );

  const setLocale = useCallback((nextLocale: Locale) => {
    const resolved = resolveLocale(nextLocale);
    writeClientLocale(resolved);
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent<Locale>(LOCALE_SYNC_EVENT, { detail: resolved }),
      );
    }
    void setLocaleCookie(resolved).catch(() => {
      // Cookie was already written on client
    });
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <NextIntlClientProvider
        locale={locale}
        messages={MESSAGES_MAP[locale]}
        timeZone="Asia/Ho_Chi_Minh"
      >
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}
