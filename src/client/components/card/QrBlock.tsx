"use client";

import { useTranslations } from "next-intl";
import { QRCodeCanvas } from "qrcode.react";
import { Download } from "lucide-react";

interface QrBlockProps {
  url: string;
  onOpenQr: () => void;
  onDownloadQr: () => void;
}

export function QrBlock({ url, onOpenQr, onDownloadQr }: QrBlockProps) {
  const t = useTranslations("card.qr");
  return (
    <div
      data-aos="fade-up"
      data-aos-delay="350"
      className="hidden md:flex items-center gap-3.5 rounded-2xl bg-white/90 backdrop-blur-xs p-2.5 pr-4 border border-[#0F4C75]/12 shadow-[0_6px_20px_rgba(15,76,117,0.07)] w-fit"
    >
      <button
        type="button"
        onClick={onOpenQr}
        aria-label={t("enlargeQrAria")}
        className="ecard-qr-thumb rounded-xl bg-white p-1 border border-slate-200/80 shrink-0 flex items-center justify-center cursor-pointer"
      >
        <QRCodeCanvas
          value={url}
          size={160}
          level="H"
          marginSize={1}
          style={{ width: "100%", height: "100%", display: "block" }}
        />
      </button>
      <div className="min-w-0">
        <p className="text-xs font-bold text-[#0A2540]">{t("scanToSaveShort")}</p>
        <p className="text-[11px] text-[#5B7A94] mt-0.5">
          {t("openQuicklyOnMobile")}
        </p>
        <button
          type="button"
          onClick={onDownloadQr}
          className="mt-1.5 inline-flex items-center gap-1.5 rounded-lg bg-[#E2F0FC] hover:bg-[#D2E8FA] text-[#0F4C75] px-2.5 py-1 text-[11px] font-semibold transition cursor-pointer"
        >
          <Download size={12} />
          {t("downloadQrPng")}
        </button>
      </div>
    </div>
  );
}
