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

/** Render the exact vector preview at 2× resolution without external assets. */
export async function downloadBusinessCard(svg: SVGSVGElement | null, slug: string) {
  if (!svg) throw new Error("Danh thiếp chưa sẵn sàng");
  const source = svg.cloneNode(true) as SVGSVGElement;
  source.setAttribute("width", "2100");
  source.setAttribute("height", "1200");
  source.style.width = "2100px";
  source.style.height = "1200px";
  const objectUrl = URL.createObjectURL(new Blob(
    [new XMLSerializer().serializeToString(source)],
    { type: "image/svg+xml;charset=utf-8" },
  ));
  try {
    const image = new Image();
    image.src = objectUrl;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = 2100;
    canvas.height = 1200;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Không thể tạo ảnh danh thiếp");
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((result) => result ? resolve(result) : reject(new Error("Không thể xuất PNG")), "image/png");
    });
    const pngUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = `ecard-${slug}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    // Allow mobile browsers time to start reading the download.
    setTimeout(() => URL.revokeObjectURL(pngUrl), 60_000);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
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
