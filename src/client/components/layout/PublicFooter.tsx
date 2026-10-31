"use client";
import { useTranslations } from "next-intl";

export function PublicFooter() {
  const t = useTranslations("common");
  return (
    <footer className="footer">
      <div className="container">
        <span>
          © 2026 <strong>QTM MediaTech.</strong> {t("allRightsReserved")}
        </span>
        <span>QUALITY · TECHNOLOGY · MINDSET</span>
      </div>
    </footer>
  );
}
