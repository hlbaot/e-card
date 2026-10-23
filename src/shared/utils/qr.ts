import { siteConfig } from "@/config/site";

export function cardUrl(slug: string) {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (typeof window !== "undefined" ? window.location.origin : siteConfig.url);
  return `${base.replace(/\/$/, "")}/card/${slug}`;
}

export function downloadQR(canvas: HTMLCanvasElement | null, slug: string) {
  if (!canvas) throw new Error("Mã QR chưa sẵn sàng");
  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = `qr-${slug}.png`;
  a.click();
}
