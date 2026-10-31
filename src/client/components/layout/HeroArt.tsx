"use client";
import { QrCode, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Avatar } from "@/client/components/ui/Avatar";

export function HeroArt() {
  const t = useTranslations("home.hero");
  return (
    <div className="hero-art" aria-hidden="true">
      <div className="orbit" />
      <div className="mini-card">
        <span className="mini-logo">QTM</span>
        <Avatar name="Nam Anh" src="" size={57} />
        <div className="mini-line" />
        <div className="mini-line short" />
        <div className="mini-actions">
          <i />
          <i />
          <i />
        </div>
      </div>
      <div className="floating-badge badge-connect">
        <CheckCircle2 size={23} />
        <span>
          {t("artBadge1Line1")}
          <br />
          <strong>{t("artBadge1Line2")}</strong>
        </span>
      </div>
      <div className="floating-badge badge-qr">
        <QrCode size={38} />
        <span>
          {t("artBadge2Line1")}
          <br />
          <strong>{t("artBadge2Line2")}</strong>
        </span>
      </div>
    </div>
  );
}
