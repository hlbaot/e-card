const rawSiteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).trim();

const normalizedSiteUrl = rawSiteUrl.replace(/\/+$/, "");

export const siteConfig = {
  name: "E-card",
  title: "E-card — MediaTech Digital Business Card",
  companyName: "QTM MEDIA TECHNOLOGY JOINT STOCK COMPANY",
  companyLegalName: "QTM Media Technology JSC",
  description:
    "Connect People. Spread Value. Smart digital business card platform for the QTM MediaTech team.",
  url: normalizedSiteUrl,
  locale: "en_US",
  ogImage: "/opengraph-image",
  /**
   * Cờ cho phép Google lập chỉ mục trang chủ `/`.
   */
  indexHomepage: true,
  /**
   * Cờ cho phép hiển thị danh sách thẻ nhân viên trên trang chủ `/`.
   */
  listCardsOnHome: true,
} as const;

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${cleanPath}`;
}
