"use client";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { QRCodeCanvas } from "qrcode.react";
import { Download, ShieldCheck } from "lucide-react";
import { cardUrl, downloadQR } from "@/shared/utils/qr";
import { CopyButton } from "@/client/components/ui/CopyButton";
import { useToast } from "@/client/components/ui/Toast";

export function QRPanel({ slug }: { slug: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const url = cardUrl(slug);
  const toast = useToast();
  const t = useTranslations("card.qr");
  const tToast = useTranslations("toast");
  return (
    <div className="qr-panel">
      <div className="qr-code">
        <QRCodeCanvas
          ref={ref}
          value={url}
          size={512}
          level="H"
          marginSize={4}
          title={t("canvasTitle", { slug })}
        />
      </div>
      <h3>{t("panelTitle")}</h3>
      <p>{t("panelSubtitle")}</p>
      <a
        className="qr-link"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {url}
      </a>
      <div className="button-row">
        <CopyButton value={url} />
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            downloadQR(ref.current, slug);
            toast(tToast("qrDownloaded"));
          }}
        >
          <Download size={16} />
          {t("downloadQrPng")}
        </button>
      </div>
      <small>
        <ShieldCheck size={14} />
        {t("panelFootnote")}
      </small>
    </div>
  );
}
