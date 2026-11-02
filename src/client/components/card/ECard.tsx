"use client";

import { formatPhone } from "@/shared/utils/phone";

import { useLayoutEffect, useRef, type CSSProperties } from "react";
import { useLocale, useTranslations } from "next-intl";
import { MapPin, Phone, Mail, Globe, QrCode, Share2 } from "lucide-react";
import { getPublicFields } from "@/shared/types";
import type { Employee } from "@/shared/types";
import { getTemplate, getThemeBackgroundCss } from "@/config/card-themes";
import { getCyberMagazineColors, isCyberMagazineDefaultColor } from "@/shared/constants/cyber-magazine";
import { readableAccent } from "@/shared/utils/color";
import { capitalizeFirstLetter } from "@/shared/utils/format-text";
import { resolveLocale } from "@/i18n/config";
import { localizeEmployee } from "@/shared/utils/localize";
import { Avatar } from "@/client/components/ui/Avatar";
import { migrateCardTheme } from "@/shared/utils/migrate-theme";
import { websiteUrl } from "@/shared/utils/vcard";
import { CyberSecurityBrand, QtmBrand } from "./QtmBrand";
import { CardActions } from "./CardActions";
import { ProfileConnectionArtwork, ProfileDecorations } from "./ProfileDecorations";
import "./professional-card.css";
import "./card-styles.css";

/** Mobile composition is shared with previews; public desktop expands to two columns.
 * Templates retain their typography, decorations and action treatments. */
export function ECard({ employee: rawEmployee, variant = "preview", onOpenQr, onShare, onOpenAddresses }: {
  employee: Employee;
  variant?: "preview" | "profile";
  onOpenQr?: () => void;
  onShare?: () => void;
  onOpenAddresses?: () => void;
}) {
  const locale = resolveLocale(useLocale());
  const e = localizeEmployee(rawEmployee, locale);
  const t = useTranslations("card");
  const rawTheme = migrateCardTheme(e.theme);
  const isCyberSecurity = rawTheme.businessCardType === "an-ninh-mang";
  const theme =
    isCyberSecurity && (!rawTheme.decor?.length || rawTheme.decor[0] === "blobs")
      ? { ...rawTheme, decor: ["cyber-magazine" as const] }
      : rawTheme;
  const isCyberStyle = isCyberSecurity || theme.decor[0] === "cyber-magazine";
  const hasReferenceFooter = theme.decor[0] === "cyber-magazine" && theme.showDecor !== false && (theme.decorOpacity ?? 35) >= 20 && isCyberMagazineDefaultColor(theme.primaryColor);
  const rawSlogan = rawEmployee.slogan?.trim() || "";
  const useDefaultCyberMotto = !rawSlogan || [
    "your journey partner",
    "người bạn đồng hành trên mọi hành trình",
    "tin cậy - tiên phong - khát vọng",
    "trust - pioneer - aspiration",
    "quality - technology - mindset",
  ].includes(rawSlogan.toLowerCase());
  const cyberMotto = useDefaultCyberMotto ? t("placeholders.cyberMotto") : e.slogan.trim();
  const template = getTemplate(theme.templateId);
  const pf = getPublicFields(e);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cyberColors = isCyberStyle ? getCyberMagazineColors(theme.primaryColor) : null;
  const accent = readableAccent(cyberColors?.navy || theme.primaryColor || template.defaultColor, false, "#E0E0E0");
  const Name = variant === "profile" ? "h1" : "h2";
  const isProfile = variant === "profile";
  const aos = (type: string, delay: number) =>
    isProfile ? {
      "data-aos": type,
      "data-aos-delay": String(Math.min(Math.round(delay / 50) * 50, 350)),
      "data-aos-duration": "500",
    } : {};
  const rows = [
    ...(pf.offices ? e.offices.map((office, index) => ({
      key: `office-${index}`, Icon: MapPin,
      label: office.label || t("labels.office"),
      value: office.address.trim(), href: "",
    })).filter(office => office.value) : []),
    ...(pf.phone && e.phone.trim() ? [{ key: "phone", Icon: Phone, label: t("labels.phone"), value: formatPhone(e.phone), href: e.phone ? `tel:${e.phone.replace(/\s/g, "")}` : "" }] : []),
    ...(pf.email && e.email.trim() ? [{ key: "email", Icon: Mail, label: t("labels.email"), value: e.email, href: e.email ? `mailto:${e.email}` : "" }] : []),
    ...(pf.website && e.website.trim() ? [{ key: "website", Icon: Globe, label: t("labels.website"), value: e.website, href: websiteUrl(e.website) }] : []),
  ];
  useLayoutEffect(() => {
    const viewport = scrollRef.current;
    const layout = viewport?.firstElementChild as HTMLDivElement | null;
    const card = viewport?.closest<HTMLElement>(".qtm-professional-card");
    if (!viewport || !layout || !card) return;
    let active = true;
    const fit = () => {
      if (!active) return;
      const available = variant === "preview" ? viewport.clientHeight : window.innerHeight;
      if (!available) return;
      const minHeight = layout.style.minHeight;
      layout.style.minHeight = "0";
      layout.style.setProperty("--preview-scale", "1");
      layout.style.setProperty("--preview-spacing", "1");
      const apply = (density: number) => card.style.setProperty("--content-density", String(density));
      // Measure natural content, before flex/grid distribute the remaining space.
      // Keep public text readable; long profiles can still scroll normally.
      let low = 0.92;
      let high = 1.2;
      for (let i = 0; i < 10; i++) {
        const middle = (low + high) / 2;
        apply(middle);
        if (layout.scrollHeight > available) high = middle;
        else low = middle;
      }
      apply(low);
      layout.style.minHeight = minHeight;
      // Refitting line widths must happen after the density changes.
      viewport.dispatchEvent(new Event("qtm-density-change"));
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(viewport);
    document.fonts.ready.then(fit);
    document.fonts.addEventListener("loadingdone", fit);
    window.addEventListener("resize", fit);
    return () => {
      active = false;
      observer.disconnect();
      document.fonts.removeEventListener("loadingdone", fit);
      window.removeEventListener("resize", fit);
    };
  }, [e, variant]);
  useLayoutEffect(() => {
    const viewport = scrollRef.current;
    const layout = viewport?.firstElementChild;
    if (!layout) return;
    const lines = Array.from(layout.querySelectorAll<HTMLElement>(
      ".qtm-profile-identity > h1, .qtm-profile-identity > h2, .qtm-profile-identity > h3, .qtm-position, .qtm-company-short, .qtm-contact > strong, .qtm-contact > a, .qtm-contact > span:last-child, .qtm-contact-value",
    ));
    const contactLines = lines.filter(line => line.parentElement?.classList.contains("qtm-contact"));
    const icons = Array.from(layout.querySelectorAll<HTMLElement | SVGSVGElement>(".qtm-contact-icon, .qtm-contact-icon svg"));
    let active = true;
    const fit = () => {
      if (!active) return;
      for (const line of lines) {
        line.style.removeProperty("font-size");
        if (contactLines.includes(line)) continue;
        const available = line.clientWidth;
        if (!available || line.scrollWidth <= available) continue;
        let low = 0;
        let high = parseFloat(getComputedStyle(line).fontSize);
        // Measure the actual font, including tracking, rather than guessing from character count.
        for (let i = 0; i < 16; i++) {
          const size = (low + high) / 2;
          line.style.fontSize = `${size}px`;
          if (line.scrollWidth > available) high = size;
          else low = size;
        }
        line.style.fontSize = `${low}px`;
      }
      // All contact rows share one scale, including their labels and icon badges.
      const baseFonts = contactLines.map(line => parseFloat(getComputedStyle(line).fontSize));
      for (const icon of icons) {
        icon.style.removeProperty("width");
        icon.style.removeProperty("height");
      }
      const baseIcons = icons.map(icon => {
        const style = getComputedStyle(icon);
        return { width: parseFloat(style.width), height: parseFloat(style.height) };
      });
      const applyContactScale = (scale: number) => {
        contactLines.forEach((line, index) => { line.style.fontSize = `${baseFonts[index] * scale}px`; });
        icons.forEach((icon, index) => {
          icon.style.width = `${baseIcons[index].width * scale}px`;
          icon.style.height = `${baseIcons[index].height * scale}px`;
        });
      };
      const contactsOverflow = () => contactLines.some(line => line.clientWidth > 0 && line.scrollWidth > line.clientWidth);
      if (contactsOverflow()) {
        let low = 0;
        let high = 1;
        for (let i = 0; i < 16; i++) {
          const scale = (low + high) / 2;
          applyContactScale(scale);
          if (contactsOverflow()) high = scale;
          else low = scale;
        }
        applyContactScale(low);
      }
    };
    fit();
    const widths = new WeakMap<Element, number>();
    const observer = new ResizeObserver((entries) => {
      let changed = false;
      for (const entry of entries) {
        if (widths.get(entry.target) !== entry.contentRect.width) changed = true;
        widths.set(entry.target, entry.contentRect.width);
      }
      if (changed) fit();
    });
    lines.forEach(line => observer.observe(line));
    document.fonts.ready.then(fit);
    document.fonts.addEventListener("loadingdone", fit);
    window.addEventListener("resize", fit);
    viewport?.addEventListener("qtm-density-change", fit);
    return () => {
      active = false;
      observer.disconnect();
      document.fonts.removeEventListener("loadingdone", fit);
      window.removeEventListener("resize", fit);
      viewport?.removeEventListener("qtm-density-change", fit);
    };
  }, [e, variant]);
  useLayoutEffect(() => {
    if (variant !== "preview") return;
    const viewport = scrollRef.current;
    const layout = viewport?.firstElementChild as HTMLDivElement | null;
    if (!viewport || !layout) return;
    let active = true;
    const fit = () => {
      if (!active || !viewport.clientHeight) return;
      layout.style.setProperty("--preview-scale", "1");
      const setSpacing = (value: number) => layout.style.setProperty("--preview-spacing", String(value));
      setSpacing(1);
      if (layout.scrollHeight <= viewport.clientHeight) return;

      let low = 0;
      let high = 1;
      for (let i = 0; i < 10; i++) {
        const middle = (low + high) / 2;
        setSpacing(middle);
        if (layout.scrollHeight > viewport.clientHeight) high = middle;
        else low = middle;
      }
      setSpacing(low);
      if (layout.scrollHeight > viewport.clientHeight) {
        layout.style.setProperty("--preview-scale", String(viewport.clientHeight / layout.scrollHeight));
      }
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(viewport);
    document.fonts.ready.then(fit);
    document.fonts.addEventListener("loadingdone", fit);
    viewport.addEventListener("qtm-density-change", fit);
    return () => {
      active = false;
      observer.disconnect();
      document.fonts.removeEventListener("loadingdone", fit);
      viewport.removeEventListener("qtm-density-change", fit);
    };
  }, [e, variant]);

  useLayoutEffect(() => {
    const viewport = scrollRef.current;
    const card = viewport?.closest<HTMLElement>(".qtm-professional-card");
    const wave = card?.querySelector<SVGSVGElement>('[data-cyber-wave-layer="left"]');
    const branch = wave?.querySelector<SVGGElement>('[data-cyber-wave="left"]');
    const avatar = card?.querySelector<HTMLElement>(".qtm-portrait .avatar");
    const name = card?.querySelector<HTMLElement>(".qtm-profile-identity > :is(h1, h2)");
    if (!viewport || !wave || !branch || !avatar || !name) return;
    const alignWave = () => {
      const matrix = wave.getScreenCTM();
      if (!matrix?.d) return;
      const avatarBottom = avatar.getBoundingClientRect().bottom;
      const nameTop = name.getBoundingClientRect().top;
      const target = avatarBottom + Math.max(4, (nameTop - avatarBottom) / 2);
      const tip = new DOMPoint(360, 550).matrixTransform(matrix);
      branch.setAttribute("transform", `translate(0 ${(target - tip.y) / matrix.d})`);
    };
    alignWave();
    const observer = new ResizeObserver(alignWave);
    observer.observe(viewport);
    observer.observe(avatar);
    observer.observe(name);
    viewport.addEventListener("qtm-density-change", alignWave);
    viewport.addEventListener("transitionend", alignWave);
    window.addEventListener("resize", alignWave);
    return () => {
      observer.disconnect();
      viewport.removeEventListener("qtm-density-change", alignWave);
      viewport.removeEventListener("transitionend", alignWave);
      window.removeEventListener("resize", alignWave);
    };
  }, [e, variant]);

  return (
    <div className="qtm-profile-surface" style={{
      ...(cyberColors ? { "--cyber-deep": cyberColors.deep, "--cyber-navy": cyberColors.navy, "--cyber-blue": cyberColors.blue } : {}),
      "--card-accent": accent,
      "--card-primary": accent,
      "--card-background": getThemeBackgroundCss(theme),
      "--card-font": template.fontFamily || (template.fontStyle === "serif" ? "Georgia, serif" : template.fontStyle === "mono" ? "\"Courier New\", monospace" : "var(--font-body), Arial, sans-serif"),
      "--motif-opacity": (theme.showDecor === false ? 0 : (theme.decorOpacity ?? 35)) / 100,
    } as CSSProperties}>
      <article className={`qtm-professional-card qtm-template-${theme.templateId}${isCyberStyle ? " qtm-cyber-controls" : ""}${isCyberStyle && theme.showDecor !== false && (theme.decorOpacity ?? 35) >= 20 ? " qtm-cyber-magazine" : ""}${variant === "preview" ? " qtm-fit-preview" : ""}`} data-adaptive-layout data-reference-footer={hasReferenceFooter || undefined} aria-label={t("profileAria", { name: e.fullName || t("placeholders.employee") })}>
        <ProfileDecorations theme={theme} locale={locale} />
        <div className="qtm-card-scroll" ref={scrollRef}>
          <div className="qtm-card-layout">
            <header className="qtm-profile-brand" {...aos("fade-down", 50)}>
              {isCyberSecurity ? <CyberSecurityBrand /> : <QtmBrand />}
              {!isCyberSecurity && <div className="qtm-culture">CULTURE<br />TECHNOLOGY<br />MEDIA<br />EVENT</div>}
            </header>
            <div className="qtm-portrait" {...aos("zoom-in", 100)}>
              {!isCyberSecurity && <p className="qtm-creative" {...aos("fade-right", 160)}><strong>QTM<br />MEDIATECH</strong><br />CREATIVE<br />+ AI TECH<span /></p>}
              <Avatar name={e.fullName} src={e.avatarUrl} color={accent} size={130} priority={isProfile} />
              <div className="qtm-profile-tools" {...aos("fade-left", 160)}>
                {onOpenQr && <button type="button" aria-label={t("actions.showQrAria")} onClick={onOpenQr}><QrCode /></button>}
                {onShare && <button type="button" aria-label={t("actions.shareProfileAria")} onClick={onShare}><Share2 /></button>}
              </div>
            </div>
            <section className="qtm-profile-identity" aria-label={t("sections.personalInfo")} {...aos("fade-up", 180)}>
              <Name>{(e.fullName || t("placeholders.fullName")).toUpperCase()}</Name>
              <p className="qtm-position">{capitalizeFirstLetter(e.position || t("placeholders.position"))}</p>
              <span className="qtm-identity-rule" aria-hidden="true" />
              {e.company.trim() && <h3>{e.company.trim()}</h3>}
              {e.companyShort.trim() && (
                <p className="qtm-company-short">
                  {e.companyShort.trim()}
                </p>
              )}
            </section>
            {rows.length > 0 && <section className="qtm-profile-contacts" aria-label={t("sections.contactInfo")}>
              {rows.map(({ key, Icon, label, value, href }, index) => (
                <div className="qtm-contact" key={key} {...aos("fade-left", 220 + index * 60)}>
                  <span className="qtm-contact-icon"><Icon aria-hidden="true" /></span>
                  <strong>{label}</strong>
                  {key.startsWith("office-") && onOpenAddresses ? <button className="qtm-contact-value" type="button" onClick={onOpenAddresses}>{value}</button> : href ? <a href={href} target={key === "website" ? "_blank" : undefined} rel={key === "website" ? "noopener noreferrer" : undefined}>{value}</a> : <span>{value}</span>}
                </div>
              ))}
            </section>}
            <CardActions employee={e} animate={isProfile} />
            <ProfileConnectionArtwork theme={theme} />
            <footer className="qtm-profile-footer qtm-brand-footer" {...aos("fade-up", 420)}>
              {isCyberSecurity ? !hasReferenceFooter && (
                <p className="qtm-profile-motto anm-profile-motto">
                  {cyberMotto}
                </p>
              ) : (
                <p className="qtm-profile-motto qtm-platform-motto">QUALITY - TECHNOLOGY - MINDSET</p>
              )}
            </footer>
          </div>
        </div>
        {isCyberSecurity && hasReferenceFooter && (
          <p className="qtm-profile-motto anm-profile-motto qtm-reference-motto">{cyberMotto}</p>
        )}
      </article>
    </div>
  );
}
