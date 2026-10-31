"use server";

import { cookies } from "next/headers";
import { LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE, resolveLocale, type Locale } from "./config";

export async function setLocaleCookie(nextLocale: string): Promise<Locale> {
  const resolved = resolveLocale(nextLocale);
  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE, resolved, {
    path: "/",
    sameSite: "lax",
    maxAge: LOCALE_COOKIE_MAX_AGE,
  });
  return resolved;
}

