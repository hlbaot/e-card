"use client";

import Link from "next/link";
import { useEffect, useRef, type CSSProperties } from "react";
import { MapPin, Phone, Mail, Globe, QrCode, Share2, Pencil } from "lucide-react";
import { getPublicFields } from "@/shared/types";
import type { Employee } from "@/shared/types";
import { getTemplate, getThemeBackgroundCss } from "@/config/card-themes";
import { readableAccent } from "@/shared/utils/color";
import { Avatar } from "@/client/components/ui/Avatar";
import { migrateCardTheme } from "@/shared/utils/migrate-theme";
import { websiteUrl } from "@/shared/utils/vcard";
import { useAuthStore } from "@/client/store/auth.store";
import { routes } from "@/shared/constants/routes";
import { QtmBrand } from "./QtmBrand";
import { CardActions } from "./CardActions";
import { ProfileConnectionArtwork, ProfileDecorations, ProfileFooterDecorations } from "./ProfileDecorations";
import "./professional-card.css";
import "./card-styles.css";

/** Mobile composition is shared with previews; public desktop expands to two columns.
 * Templates retain their typography, decorations and action treatments. */
export function ECard({ employee: e, variant = "preview", onOpenQr, onShare, onOpenAddresses }: {
  employee: Employee;
  variant?: "preview" | "profile";
  onOpenQr?: () => void;
  onShare?: () => void;
  onOpenAddresses?: () => void;
}) {
  const theme = migrateCardTheme(e.theme);
  const template = getTemplate(theme.templateId);
  const pf = getPublicFields(e);
  const scrollRef = useRef<HTMLDivElement>(null);
  const accent = readableAccent(theme.primaryColor || template.defaultColor, false, "#E0E0E0");
  const Name = variant === "profile" ? "h1" : "h2";
  const isProfile = variant === "profile";
  const aos = (type: string, delay: number) =>
    isProfile ? {
      "data-aos": type,
      "data-aos-delay": String(Math.min(Math.round(delay / 50) * 50, 350)),
      "data-aos-duration": "500",
    } : {};
  const slogan = e.slogan?.trim() || "Let's Create a Brighter Tomorrow Together";
  const authenticated = useAuthStore((state) => state.authenticated);
  const rows = [
    ...(pf.offices ? e.offices.map((office, index) => ({
      key: `office-${index}`, Icon: MapPin,
      label: office.label || `Văn phòng ${index + 1}`,
      value: office.address || "Chưa cập nhật địa chỉ", href: "",
    })) : []),
    ...(pf.phone ? [{ key: "phone", Icon: Phone, label: "Điện thoại", value: e.phone || "Chưa cập nhật", href: e.phone ? `tel:${e.phone.replace(/\s/g, "")}` : "" }] : []),
    ...(pf.email ? [{ key: "email", Icon: Mail, label: "Thư điện tử", value: e.email || "Chưa cập nhật", href: e.email ? `mailto:${e.email}` : "" }] : []),
    ...(pf.website ? [{ key: "website", Icon: Globe, label: "Trang web", value: e.website || "Chưa cập nhật", href: websiteUrl(e.website) }] : []),
  ];
  useEffect(() => { scrollRef.current?.scrollTo({ top: 0 }); }, [theme.templateId]);

  return (
    <div className="qtm-profile-surface" style={{
      "--card-accent": accent,
      "--card-primary": accent,
      "--card-background": getThemeBackgroundCss(theme),
      "--card-font": template.fontFamily || (template.fontStyle === "serif" ? "Georgia, serif" : template.fontStyle === "mono" ? "\"Courier New\", monospace" : "var(--font-body), Arial, sans-serif"),
      "--motif-opacity": (theme.showDecor === false ? 0 : (theme.decorOpacity ?? 35)) / 100,
    } as CSSProperties}>
      <article className={`qtm-professional-card qtm-template-${theme.templateId}`} aria-label={`Hồ sơ của ${e.fullName || "nhân viên"}`}>
        <ProfileDecorations theme={theme} />
        <div className="qtm-card-scroll" ref={scrollRef}>
          <div className="qtm-card-layout">
            <header className="qtm-profile-brand" {...aos("fade-down", 50)}>
              <QtmBrand />
              <div className="qtm-culture">CULTURE<br />TECHNOLOGY<br />MEDIA<br />EVENT</div>
            </header>
            <div className="qtm-portrait" {...aos("zoom-in", 100)}>
              <p className="qtm-creative" {...aos("fade-right", 160)}><strong>QTM<br />MEDIATECH</strong><br />CREATIVE<br />+ AI TECH<span /></p>
              <Avatar name={e.fullName} src={e.avatarUrl} color={accent} size={130} priority={isProfile} />
              <div className="qtm-profile-tools" {...aos("fade-left", 160)}>
                {onOpenQr && <button type="button" aria-label="Mở mã QR" onClick={onOpenQr}><QrCode /></button>}
                {onShare && <button type="button" aria-label="Chia sẻ hồ sơ" onClick={onShare}><Share2 /></button>}
                {variant === "profile" && authenticated && (
                  <Link href={routes.employee(e.id)} aria-label="Tuỳ chỉnh danh thiếp" title="Tuỳ chỉnh danh thiếp">
                    <Pencil size={18} />
                  </Link>
                )}
              </div>
            </div>
            <section className="qtm-profile-identity" aria-label="Thông tin cá nhân" {...aos("fade-up", 180)}>
              <Name>{e.fullName || "HỌ TÊN NHÂN VIÊN"}</Name>
              <p className="qtm-position">{e.position || "Chức vụ"}</p>
              <span className="qtm-identity-rule" aria-hidden="true" />
              <h3>{e.company || "CÔNG TY CỔ PHẦN CÔNG NGHỆ TRUYỀN THÔNG QTM"}</h3>
              <p className="qtm-company-short">{e.companyShort || "QTM MEDIATECH.,JSC"}</p>
            </section>
            <section className="qtm-profile-contacts" aria-label="Thông tin liên hệ">
              {rows.map(({ key, Icon, label, value, href }, index) => (
                <div className="qtm-contact" key={key} {...aos("fade-left", 220 + index * 60)}>
                  <span className="qtm-contact-icon"><Icon aria-hidden="true" /></span>
                  <strong>{label}</strong>
                  {key.startsWith("office-") && onOpenAddresses ? <button className="qtm-contact-value" type="button" onClick={onOpenAddresses}>{value}</button> : href ? <a href={href} target={key === "website" ? "_blank" : undefined} rel={key === "website" ? "noopener noreferrer" : undefined}>{value}</a> : <span>{value}</span>}
                </div>
              ))}
            </section>
            <CardActions employee={e} animate={isProfile} />
            <ProfileConnectionArtwork theme={theme} />
            <footer className="qtm-profile-footer" {...aos("fade-up", 420)}>
              <div className="qtm-footer-row">
                <div className="qtm-profile-slogan-wrap">
                  <p className="qtm-profile-slogan">{slogan}</p>
                  <span className="qtm-slogan-line" aria-hidden="true" />
                </div>
                <ProfileFooterDecorations theme={theme} />
              </div>
              <p className="qtm-profile-motto">QUALITY - TECHNOLOGY - MINDSET</p>
            </footer>
          </div>
        </div>
      </article>
    </div>
  );
}
