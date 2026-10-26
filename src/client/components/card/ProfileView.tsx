"use client";

import { useEffect, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Copy, Download, ExternalLink, MapPin, X } from "lucide-react";
import { getPublicFields } from "@/shared/types";
import type { Employee } from "@/shared/types";
import { cardUrl, downloadQR } from "@/shared/utils/qr";
import { useToast } from "@/client/components/ui/Toast";
import { useAos } from "@/client/hooks/useAos";
import { migrateCardTheme } from "@/shared/utils/migrate-theme";
import { ECard } from "./ECard";

export function ProfileView({ employee }: { employee: Employee }) {
  useAos(true);
  const e = { ...employee, theme: migrateCardTheme(employee.theme) };

  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const toast = useToast();

  const url = cardUrl(e.slug);
  const pf = getPublicFields(e);
  const offices =
    e.offices.length > 0
      ? e.offices
      : [{ label: "Trụ sở chính", address: "Chưa cập nhật địa chỉ" }];
  useEffect(() => {
    if (!qrModalOpen && !addressModalOpen) return;
    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") {
        setQrModalOpen(false);
        setAddressModalOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [qrModalOpen, addressModalOpen]);

  const handleShare = async () => {
    const shareData = {
      title: `${e.fullName} · ${e.companyShort || e.company}`,
      text: `${e.fullName} — ${e.position} (${e.company})`,
      url,
    };
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function"
    ) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast("Đã sao chép liên kết hồ sơ");
    } catch {
      toast("Không thể sao chép liên kết");
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast("Đã sao chép liên kết");
    } catch {
      toast("Không thể sao chép liên kết");
    }
  };

  const handleDownloadQR = () => {
    try {
      downloadQR(qrCanvasRef.current, e.slug);
      toast("Đã tải mã QR PNG");
    } catch {
      toast("Mã QR chưa sẵn sàng");
    }
  };

  return (
    <main className="qtm-public-profile">
      <ECard employee={e} variant="profile" onOpenQr={() => setQrModalOpen(true)} onShare={handleShare} onOpenAddresses={() => setAddressModalOpen(true)} />
      <div className="sr-only" aria-hidden="true">
        <QRCodeCanvas ref={qrCanvasRef} value={url} size={512} level="H" marginSize={4} />
      </div>
      {/* MODAL 1: QR CODE (Dark QTM Glass Modal) */}
      {qrModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#050B1A]/75 backdrop-blur-sm p-0 sm:p-4"
          onClick={() => setQrModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Mã QR hồ sơ cá nhân"
        >
          <div
            className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-[#0B1430]/95 backdrop-blur-xl text-white border border-[rgba(120,200,255,0.22)] p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-[0_0_40px_rgba(34,211,238,0.18)]"
            onClick={(ev) => ev.stopPropagation()}
          >
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-3 sm:hidden" />
            <div className="flex items-center justify-between gap-2 mb-4">
              <h3 className="text-base font-bold text-white">
                Mã QR · {e.fullName}
              </h3>
              <button
                type="button"
                onClick={() => setQrModalOpen(false)}
                aria-label="Đóng"
                className="h-9 w-9 rounded-full inline-flex items-center justify-center bg-white/10 text-[#B6C2D9] hover:bg-cyan-400/20 hover:text-cyan-300 border border-white/15 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 rounded-2xl border border-cyan-400/30 bg-white shadow-[0_0_24px_rgba(34,211,238,0.2)] mb-3">
                <QRCodeCanvas
                  value={url}
                  size={180}
                  level="H"
                  marginSize={2}
                />
              </div>
              <p className="text-xs text-[#B6C2D9] text-center mb-3 font-mono break-all bg-white/[0.04] border border-white/10 px-3 py-2 rounded-lg w-full">
                {url}
              </p>
              <div className="grid grid-cols-2 gap-2.5 w-full">
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="btn btn-secondary min-h-[42px] text-xs cursor-pointer"
                >
                  <Copy size={15} />
                  Sao chép link
                </button>
                <button
                  type="button"
                  onClick={handleDownloadQR}
                  className="btn btn-primary min-h-[42px] text-xs cursor-pointer"
                >
                  <Download size={15} />
                  Tải PNG
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: FULL OFFICE ADDRESSES (Dark QTM Glass Modal) */}
      {pf.offices && addressModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#050B1A]/75 backdrop-blur-sm p-0 sm:p-4"
          onClick={() => setAddressModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Địa chỉ văn phòng"
        >
          <div
            className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl bg-[#0B1430]/95 backdrop-blur-xl text-white border border-[rgba(120,200,255,0.22)] p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-[0_0_40px_rgba(34,211,238,0.18)] max-h-[85dvh] overflow-y-auto"
            onClick={(ev) => ev.stopPropagation()}
          >
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-3 sm:hidden" />
            <div className="flex items-center justify-between gap-2 mb-4">
              <h3 className="text-base font-bold text-white">
                Địa chỉ văn phòng
              </h3>
              <button
                type="button"
                onClick={() => setAddressModalOpen(false)}
                aria-label="Đóng"
                className="h-9 w-9 rounded-full inline-flex items-center justify-center bg-white/10 text-[#B6C2D9] hover:bg-cyan-400/20 hover:text-cyan-300 border border-white/15 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              {offices.map((o, idx) => {
                const mapLink = o.address
                  ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(o.address)}`
                  : "";
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-[rgba(120,200,255,0.18)] bg-white/[0.04] p-3.5"
                  >
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#22D3EE] mb-1">
                      <MapPin size={15} />
                      <span>{o.label || `Văn phòng ${idx + 1}`}</span>
                    </div>
                    <p className="text-sm text-[#B6C2D9] leading-relaxed break-words">
                      {o.address || "Chưa cập nhật địa chỉ"}
                    </p>
                    {mapLink && (
                      <a
                        href={mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#22D3EE] hover:underline"
                      >
                        <ExternalLink size={13} />
                        Mở trên Google Maps
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
