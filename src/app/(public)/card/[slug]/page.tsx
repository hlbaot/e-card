import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { absoluteUrl, siteConfig } from "@/config/site";
import {
  getActiveEmployees,
  getPublicEmployeeBySlug,
} from "@/server/employees";
import { CardView } from "@/views/CardView";

export const dynamicParams = true;

export async function generateStaticParams() {
  const activeEmployees = await getActiveEmployees();
  return activeEmployees.map((e) => ({
    slug: e.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const employee = await getPublicEmployeeBySlug(slug);

  if (!employee || !employee.isActive) {
    notFound();
  }

  // All cards are public and indexable.
  const pageTitle = `${employee.fullName} - ${employee.position} | QTM MediaTech`;
  const pageDescription = `${employee.fullName} — ${employee.position} tại ${employee.company}. Danh thiếp điện tử chính thức trên E-card.`;
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
      locale: siteConfig.locale,
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
  const employee = await getPublicEmployeeBySlug(slug);

  if (!employee || !employee.isActive) {
    notFound();
  }

  return <CardView employee={employee} />;
}
