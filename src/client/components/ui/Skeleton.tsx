"use client";
import { useTranslations } from "next-intl";

export function Skeleton() {
  const t = useTranslations("common");
  return (
    <div className="skeleton" role="status" aria-label={t("loadingData")}>
      <div />
      <div />
      <div />
      <span className="sr-only">{t("loading")}</span>
    </div>
  );
}
