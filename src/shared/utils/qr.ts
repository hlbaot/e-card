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

export async function downloadQrBySlug(slug: string, value = cardUrl(slug)) {
  const [{ createElement }, { flushSync }, { createRoot }, { QRCodeCanvas }] =
    await Promise.all([
      import("react"),
      import("react-dom"),
      import("react-dom/client"),
      import("qrcode.react"),
    ]);

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "-9999px";
  container.style.pointerEvents = "none";
  container.setAttribute("aria-hidden", "true");
  document.body.appendChild(container);

  const root = createRoot(container);
  try {
    flushSync(() => {
      root.render(
        createElement(QRCodeCanvas, {
          value,
          size: 512,
          level: "H",
          marginSize: 4,
        }),
      );
    });
    await new Promise<void>((resolve) => {
      if (typeof requestAnimationFrame === "function") {
        requestAnimationFrame(() => resolve());
      } else {
        setTimeout(resolve, 0);
      }
    });
    const canvas = container.querySelector("canvas");
    downloadQR(canvas, slug);
  } finally {
    root.unmount();
    container.remove();
  }
}
