import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { absoluteUrl, siteConfig } from "@/config/site";
import { getRequestLocale } from "@/i18n/request";
import { cachedPublicCards } from "@/server/cards/cache";
import { CardView } from "@/views/CardView";

// Luôn kiểm tra DB để card vừa ẩn hoặc xóa trả 404 ngay.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const employee = await cachedPublicCards.bySlug(slug);

  if (!employee || !employee.isActive) {
    notFound();
  }

  const locale = await getRequestLocale();
  const t = await getTranslations({ locale, namespace: "meta" });
  const brandName =
    employee.theme.businessCardType === "an-ninh-mang"
      ? t("cardBrandCyber")
      : t("cardBrandQtm");
  const pageTitle = `${employee.fullName} - ${employee.position} | ${brandName}`;
  const pageDescription = t("cardDescription", {
    name: employee.fullName,
    position: employee.position,
    company: employee.company,
  });
  const canonicalUrl = absoluteUrl(`/card/${employee.slug}`);
  const ogImageUrl = employee.avatarUrl
    ? absoluteUrl(employee.avatarUrl)
    : absoluteUrl(siteConfig.ogImage);

  return {
    title: {
      absolute: pageTitle,
    },
    description: pageDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "profile",
      locale: t("ogLocale"),
      url: canonicalUrl,
      siteName: siteConfig.name,
      title: pageTitle,
      description: pageDescription,
      images: [
        {
          url: ogImageUrl,
          alt: employee.fullName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [ogImageUrl],
    },
  };
}

export default async function CardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const employee = await cachedPublicCards.bySlug(slug);

  if (!employee || !employee.isActive) {
    notFound();
  }

  return <CardView employee={employee} />;
}
