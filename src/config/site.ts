const rawSiteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).trim();

const normalizedSiteUrl = rawSiteUrl.replace(/\/+$/, "");

export const siteConfig = {
  name: "E-card",
  title: "E-card — Danh thiếp số MediaTech",
  companyName: "CÔNG TY CỔ PHẦN CÔNG NGHỆ TRUYỀN THÔNG QTM",
  companyLegalName: "QTM Media Technology JSC",
  description:
    "Kết nối con người. Lan tỏa giá trị. Nền tảng danh thiếp số E-card dành cho đội ngũ QTM MediaTech.",
  url: normalizedSiteUrl,
  locale: "vi_VN",
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
