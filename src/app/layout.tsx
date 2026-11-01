import type { Metadata } from "next";
import localFont from "next/font/local";
import { getTranslations } from "next-intl/server";
import { I18nProvider } from "@/client/components/providers/I18nProvider";
import { ToastProvider } from "@/client/components/ui/Toast";
import { PageBackground } from "@/client/components/ui/PageBackground";
import { absoluteUrl, siteConfig } from "@/config/site";
import { getRequestLocale } from "@/i18n/request";
import "./globals.css";

const handwriting = localFont({
  src: "./fonts/dancing-script.ttf",
  weight: "600",
  variable: "--font-handwriting",
  display: "swap",
});

const googleVerification =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const t = await getTranslations({ locale, namespace: "meta" });
  const title = t("siteTitle");
  const description = t("siteDescription");
  const ogLocale = t("ogLocale");

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: title,
      template: `%s | ${siteConfig.name}`,
    },
    description,
    icons: {
      icon: "/images/qtm-symbol.png",
      shortcut: "/images/qtm-symbol.png",
      apple: "/images/qtm-symbol.png",
    },
    robots: siteConfig.indexHomepage
      ? { index: true, follow: true }
      : { index: false, follow: false },
    openGraph: {
      type: "website",
      locale: ogLocale,
      url: siteConfig.url,
      siteName: siteConfig.name,
      title,
      description,
      images: [
        {
          url: absoluteUrl(siteConfig.ogImage),
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(siteConfig.ogImage)],
    },
    ...(googleVerification
      ? {
          verification: {
            google: googleVerification,
          },
        }
      : {}),
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getRequestLocale();

  return (
    <html lang={locale} className={`${handwriting.variable} dark`}>
      <body>
        <I18nProvider initialLocale={locale}>
          <PageBackground />
          <ToastProvider>{children}</ToastProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
