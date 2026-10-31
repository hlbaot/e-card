import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getRequestLocale } from "@/i18n/request";
import { AdminProfileView } from "@/views/AdminProfileView";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("adminProfileTitle"),
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function ProfilePage() {
  return <AdminProfileView />;
}
