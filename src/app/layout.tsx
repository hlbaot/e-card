import type { Metadata } from "next";
import localFont from "next/font/local";
import { QueryProvider } from "@/client/providers/QueryProvider";
import { ToastProvider } from "@/client/components/ui/Toast";
import { PageBackground } from "@/client/components/ui/PageBackground";
import { absoluteUrl, siteConfig } from "@/config/site";
import "./globals.css";

const handwriting = localFont({
  src: "./fonts/dancing-script.ttf",
  weight: "600",
  variable: "--font-handwriting",
  display: "swap",
});

const googleVerification =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/images/icon.png",
    shortcut: "/images/icon.png",
    apple: "/images/icon.png",
  },
  robots: siteConfig.indexHomepage
    ? { index: true, follow: true }
    : { index: false, follow: false },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
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
    title: siteConfig.title,
    description: siteConfig.description,
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${handwriting.variable} dark`}>
      <body>
        <PageBackground />
        <QueryProvider><ToastProvider>{children}</ToastProvider></QueryProvider>
      </body>
    </html>
  );
}
