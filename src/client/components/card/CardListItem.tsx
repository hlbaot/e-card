"use client";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowUpRight, Building2 } from "lucide-react";
import type { Employee } from "@/shared/types";
import { Avatar } from "@/client/components/ui/Avatar";
import { routes } from "@/shared/constants/routes";
import { resolveLocale } from "@/i18n/config";
import { localizeText, localizeEmployeeName } from "@/shared/utils/localize";
import { capitalizeFirstLetter } from "@/shared/utils/format-text";

export function CardListContent({
  employee: e,
  showFooter = true,
}: {
  employee: Employee;
  showFooter?: boolean;
}) {
  const locale = resolveLocale(useLocale());
  const displayName = localizeEmployeeName(e.fullName, locale);
  const position = capitalizeFirstLetter(localizeText(e.position, locale));
  const company = localizeText(e.companyShort, locale);
  const tCommon = useTranslations("common");
  const tHome = useTranslations("home.directory");
  const isCyberSecurity = e.theme.businessCardType === "an-ninh-mang";
  return (
    <>
      <div
        className="employee-cover"
        style={
          {
            "--cover": `linear-gradient(120deg,${e.theme.primaryColor},color-mix(in srgb,${e.theme.primaryColor} 60%,#75b8b4))`,
          } as CSSProperties
        }
      >
        <span title={isCyberSecurity ? tCommon("cyberMagazineUpper") : "QTM MEDIATECH"}>{isCyberSecurity ? tCommon("cyberMagazineUpper") : "QTM MEDIATECH"}</span>
        {showFooter && e.isActive && <i className="live-dot" />}
      </div>
      <Avatar
        name={displayName}
        src={e.avatarUrl}
        color={e.theme.primaryColor}
        size={80}
        rounded={e.theme.avatarShape === "rounded"}
      />
      <div className="employee-card-details">
        <h3 title={displayName.toUpperCase()}>{displayName.toUpperCase()}</h3>
        <p className="position" title={position}>{position}</p>
        <p className="company" title={company}>{company}</p>
      </div>
      {showFooter && (
        <div className="employee-card-footer">
          <span className="button-row">
            <Building2 size={12} />
            {isCyberSecurity ? tCommon("cyberMagazineName") : "QTM MediaTech"}
          </span>
          <span>
            {tHome("viewProfile")}
            <ArrowUpRight size={14} />
          </span>
        </div>
      )}
    </>
  );
}
export function CardListItem({ employee }: { employee: Employee }) {
  return (
    <Link
      href={routes.card(employee.slug)}
      target="_blank"
      rel="noopener noreferrer"
      prefetch={false}
      className="employee-card"
    >
      <CardListContent employee={employee} />
    </Link>
  );
}
