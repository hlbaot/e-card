"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Copy, Download, ExternalLink, MapPin, X } from "lucide-react";
import { getPublicFields, type Employee } from "@/shared/types/employee";
import { getTemplate, isDarkTheme } from "@/config/card-themes";
import { contrastText, readableAccent } from "@/shared/utils/color";
import { cardUrl, downloadQR } from "@/shared/utils/qr";
import { cn } from "@/shared/utils/cn";
import { useToast } from "@/client/components/ui/Toast";
import { useAos } from "@/client/hooks/useAos";
import { migrateCardTheme } from "@/shared/utils/migrate-theme";
import { CardDecorations } from "./CardDecorations";
import { CardHeader } from "./CardHeader";
import { ProfileInfo } from "./ProfileInfo";
import { ContactList } from "./ContactList";
import { ActionGrid } from "./ActionGrid";

export function ProfileView({ employee }: { employee: Employee }) {
  const e = { ...employee, theme: migrateCardTheme(employee.theme) };
  useAos(!!e);

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
  const sloganText =
    !e.slogan ||
    e.slogan.trim().toLowerCase() ===
      "let's create a brighter tomorrow together"
      ? "Cùng nhau kiến tạo tương lai tươi sáng"
      : e.slogan;

  const template = getTemplate(e.theme.templateId);
  const dark = isDarkTheme(e.theme);
  const rawPrimary = e.theme.primaryColor || template.defaultColor;
  const accent = readableAccent(rawPrimary, dark);
  const isDefaultQtm =
    e.theme.templateId === "bubble-blue" &&
    !dark &&
    rawPrimary.toLowerCase() === "#0f4c75";

  const pvPrimary = isDefaultQtm ? "#0F4C75" : accent;
  const pvAccent = isDefaultQtm ? "#1B8FD0" : accent;
  const pvStrong = dark ? "#F8FAFC" : isDefaultQtm ? "#0A2540" : "#111827";
  const pvBody = dark ? "#E2E8F0" : isDefaultQtm ? "#163A59" : "#334155";
  const pvMuted = dark
    ? "rgba(226,232,240,0.72)"
    : isDefaultQtm
      ? "#3B698B"
      : "#64748B";
  const pvBtnBg = dark
    ? `color-mix(in srgb, ${pvPrimary} 16%, rgba(255,255,255,0.06))`
    : isDefaultQtm
      ? "#E2F0FC"
      : `color-mix(in srgb, ${pvPrimary} 12%, #FFFFFF)`;
  const pvBtnBorder = dark
    ? `color-mix(in srgb, ${pvPrimary} 34%, transparent)`
    : `color-mix(in srgb, ${pvPrimary} 16%, transparent)`;
  const pvBtnHoverBg = pvPrimary;
  const pvBtnHoverText = contrastText(pvPrimary);
  const pvAvatarBorder = dark
    ? `color-mix(in srgb, ${pvAccent} 55%, #FFFFFF)`
    : "#FFFFFF";

  const themeVars = {
    "--pv-primary": pvPrimary,
    "--pv-accent": pvAccent,
    "--pv-strong": pvStrong,
    "--pv-body": pvBody,
    "--pv-muted": pvMuted,
    "--pv-btn-bg": pvBtnBg,
    "--pv-btn-text": pvPrimary,
    "--pv-btn-border": pvBtnBorder,
    "--pv-btn-hover-bg": pvBtnHoverBg,
    "--pv-btn-hover-text": pvBtnHoverText,
    "--pv-avatar-border": pvAvatarBorder,
    "--pv-pill-bg": dark ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.85)",
    "--pv-pill-border": dark
      ? `color-mix(in srgb, ${pvPrimary} 35%, transparent)`
      : `color-mix(in srgb, ${pvPrimary} 18%, transparent)`,
  } as CSSProperties;

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
    <main
      className={cn(
        "profile-view-root relative h-dvh w-full overflow-hidden flex flex-col justify-between select-none",
        `profile-template-${e.theme.templateId}`,
        dark && "profile-view-dark",
      )}
      style={themeVars}
      aria-label={`Hồ sơ của ${e.fullName}`}
    >
      {/* Shared background and sparse SVG decorations */}
      <CardDecorations
        theme={e.theme}
        showDecor={e.theme.showDecor ?? true}
        variant="profile"
      />

      {/* Hidden high-res QR canvas for PNG export */}
      <div className="sr-only" aria-hidden="true">
        <QRCodeCanvas
          ref={qrCanvasRef}
          value={url}
          size={512}
          level="H"
          marginSize={4}
        />
      </div>

      {/* Main single-screen container:
          - Mobile (< 768px): 1 column flex-col justify-between
          - Desktop (>= 768px): 2 columns (md:grid md:grid-cols-12, left 5 cols, right 7 cols)
      */}
      <div className="ecard-shell relative z-10 flex flex-col justify-between h-full w-full max-w-[460px] md:max-w-[1160px] mx-auto min-h-0">
        {/* ROW 1: Header */}
        <CardHeader
          onOpenQr={() => setQrModalOpen(true)}
          onShare={handleShare}
          dark={dark}
        />

        {/* ROW 2: Main Content (1 col on mobile < 768px, 2 cols on desktop >= 768px) */}
        <div className="ecard-main flex-1 min-h-0 flex flex-col justify-evenly md:grid md:grid-cols-12 md:items-center md:gap-8 lg:gap-12">
          {/* Left Column (md:col-span-5): Avatar + Name + Position + Company */}
          <section
            aria-label="Thông tin cá nhân"
            className="ecard-col-left md:col-span-5 min-h-0 flex flex-col items-center md:items-start justify-center"
          >
            <ProfileInfo employee={e} />
          </section>

          {/* Right Column (md:col-span-7): "Kết nối với tôi" (desktop) + ContactList + ActionGrid */}
          <section
            aria-label="Thông tin liên hệ và hành động"
            className="ecard-col-right md:col-span-7 min-h-0 flex flex-col justify-center w-full gap-[clamp(6px,1.3dvh,16px)]"
          >
            <div
              data-aos="fade-left"
              data-aos-delay="150"
              className="hidden md:flex items-center gap-3"
            >
              <span
                className="text-xs font-extrabold uppercase tracking-[0.18em]"
                style={{ color: "var(--pv-primary)" }}
              >
                Kết nối với tôi
              </span>
              <span
                className="h-px flex-1 opacity-25"
                style={{ background: "var(--pv-primary)" }}
                aria-hidden="true"
              />
            </div>

            <ContactList
              employee={e}
              onOpenAddresses={
                pf.offices ? () => setAddressModalOpen(true) : undefined
              }
            />

            <ActionGrid employee={e} />
          </section>
        </div>

        {/* ROW 3: Footer (Slogan script font + CHẤT LƯỢNG · CÔNG NGHỆ · TƯ DUY) */}
        <div
          data-aos="fade-up"
          data-aos-delay="650"
          className="ecard-footer-aos shrink-0"
        >
          <footer className="ecard-footer flex flex-col md:flex-row items-center justify-between gap-0.5 md:gap-4 pt-0.5">
            <p
              className="qtm-slogan text-center md:text-left truncate max-w-full"
              style={{
                fontFamily: "var(--font-handwriting), cursive",
                color: "var(--pv-primary)",
              }}
            >
              {sloganText}
            </p>
            <p
              className="qtm-motto font-extrabold uppercase tracking-[0.22em] text-center md:text-right shrink-0"
              style={{ color: "var(--pv-muted)" }}
            >
              CHẤT LƯỢNG · CÔNG NGHỆ · TƯ DUY
            </p>
          </footer>
        </div>
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
