import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { LoginView } from "@/client/components/auth/LoginView";
import { getRequestLocale } from "@/i18n/request";
import { ACCESS_COOKIE, SESSION_COOKIE } from "@/server/auth/http";
import { serverAuth } from "@/server/auth/runtime";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("loginTitle"),
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function Login() {
  const cookieStore = await cookies();
  const access = cookieStore.get(ACCESS_COOKIE)?.value;
  const session = cookieStore.get(SESSION_COOKIE)?.value;

  let authenticated = false;
  if (access) {
    try {
      await serverAuth.currentUser(access);
      authenticated = true;
    } catch {
      authenticated = await serverAuth.hasActiveRefreshSession(access);
    }
  }
  if (!authenticated && session) {
    authenticated = await serverAuth.hasActiveRefreshSession(session);
  }

  // redirect throws NEXT_REDIRECT; do not swallow it in the auth catch.
  if (authenticated) redirect("/admin");
  return <LoginView />;
}
