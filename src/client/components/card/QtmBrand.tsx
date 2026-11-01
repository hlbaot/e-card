"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";

/** Shared logo lockup for cards, live previews and the public profile. */
export function QtmBrand() {
  return (
    <div className="qtm-card-brand qtm-logo-brand" aria-label="QTM MediaTech">
      <Image
        src="/images/brand/qtm-logo.png"
        width={913}
        height={273}
        alt="QTM MediaTech"
        unoptimized
      />
    </div>
  );
}

export function CyberSecurityBrand() {
  const t = useTranslations("common");
  return (
    <div className="qtm-card-brand anm-card-brand" aria-label={t("cyberMagazineName")}>
      <Image
        src="/logo_anninhmang.png"
        width={1672}
        height={941}
        alt={t("cyberMagazineName")}
        unoptimized
      />
    </div>
  );
}
