import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { AuthUser } from "@/shared/types";
import { QueryProvider } from "@/client/providers/QueryProvider";
import { AuthGuard } from "@/client/components/layout/AuthGuard";
import { AdminSidebar } from "@/client/components/layout/AdminSidebar";
import { getRequestLocale } from "@/i18n/request";
import { ACCESS_COOKIE, REFRESH_COOKIE, SESSION_COOKIE } from "@/server/auth/http";
import { serverAuth } from "@/server/auth/runtime";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("adminTitle"),
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;
  const sessionToken = cookieStore.get(SESSION_COOKIE)?.value;
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;

  let initialUser: AuthUser | null = null;
  let canRefresh = Boolean(refreshToken);

  if (accessToken) {
    try {
      initialUser = await serverAuth.currentUser(accessToken);
    } catch {
      if (!canRefresh) {
        canRefresh = await serverAuth.hasActiveRefreshSession(accessToken);
      }
    }
  }

  if (!initialUser && !canRefresh && sessionToken) {
    canRefresh = await serverAuth.hasActiveRefreshSession(sessionToken);
  }

  if (!initialUser && !canRefresh) {
    redirect("/");
  }

  return (
    <QueryProvider>
      <AuthGuard initialUser={initialUser}>
        <AdminSidebar>{children}</AdminSidebar>
      </AuthGuard>
    </QueryProvider>
  );
}
