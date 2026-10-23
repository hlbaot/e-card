"use client";
import { QtmBrand } from "./QtmBrand";
import type { CSSProperties } from "react";
import { MapPin, Phone, Mail, Globe } from "lucide-react";
import { getPublicFields, type Employee } from "@/shared/types/employee";
import {
  backgrounds,
  getTemplate,
  getThemeBackgroundCss,
} from "@/shared/constants/card-themes";
import { contrastText, readableAccent } from "@/shared/utils/color";
import { Avatar } from "@/client/components/ui/Avatar";
import { migrateCardTheme } from "@/shared/utils/migrate-theme";
import { CardDecorations } from "./CardDecorations";
import { CardActions } from "./CardActions";
import { websiteUrl } from "@/shared/utils/vcard";

export function ECard({
  employee: e,
  variant = "preview",
}: {
  employee: Employee;
  variant?: "preview" | "profile";
}) {
  const t = migrateCardTheme(e.theme);
  const pf = getPublicFields(e);
  const template = getTemplate(t.templateId);
  const background = backgrounds.find((b) => b.id === t.backgroundId);
  const dark = !!template.dark || !!background?.dark;
  const accent = readableAccent(t.primaryColor, dark);
  const Name = variant === "profile" ? "h1" : "h2";
  const showDecor = t.showDecor ?? true;
  const style = {
    "--primary": t.primaryColor,
    "--accent": accent,
    "--on-primary": contrastText(t.primaryColor),
    background: getThemeBackgroundCss(t),
    color: dark ? "#edf7ff" : "#263d50",
  } as CSSProperties;
  return (
    <article
      className={`ecard template-${t.templateId}${dark ? " ecard-dark" : ""}${variant === "profile" ? " ecard-profile" : ""}`}
      style={style}
      aria-label={`Hồ sơ của ${e.fullName || "nhân viên"}`}
    >
      <CardDecorations
        theme={t}
        showDecor={showDecor}
        variant="preview"
      />
      <div className="ecard-content">
        {t.templateId === "bubble-blue" ? (
          <div className="ecard-brand">
            <QtmBrand />
            <span>
              VĂN HÓA
              <br />
              CÔNG NGHỆ
              <br />
              TRUYỀN THÔNG
              <br />
              SỰ KIỆN
            </span>
          </div>
        ) : (
          <div className="ecard-wordmark">
            <QtmBrand />
            <span>
              HỒ SƠ CÁ NHÂN
              <br />
              KẾT NỐI KHÔNG GIỚI HẠN
            </span>
          </div>
        )}
        <header className="ecard-identity">
          <Avatar
            name={e.fullName}
            src={e.avatarUrl}
            color={t.primaryColor}
            size={
              (variant === "profile"
                ? { sm: 96, md: 132, lg: 160 }
                : { sm: 82, md: 110, lg: 136 })[t.avatarSize]
            }
            rounded={t.avatarShape === "rounded"}
          />
          <div className="identity-copy">
            <Name>{e.fullName || "HỌ TÊN NHÂN VIÊN"}</Name>
            <p>{e.position || "Chức vụ"}</p>
            <i />
          </div>
        </header>
        <section className="ecard-company" aria-label="Đơn vị công tác">
          <h3>{e.company}</h3>
          <p>{e.companyShort}</p>
        </section>
        <div className="ecard-section-title">
          <span>Thông tin liên hệ</span>
          <i />
        </div>
        <section className="ecard-info" aria-label="Thông tin liên hệ">
          {pf.offices &&
            e.offices.map((o, i) => (
              <div key={i} className="contact-office">
                <MapPin size={17} />
                <p>
                  <strong>{o.label || `Văn phòng ${i + 1}`}</strong>
                  <span>{o.address || "Chưa cập nhật địa chỉ"}</span>
                </p>
              </div>
            ))}
          {pf.phone && (
            <div>
              <Phone size={17} />
              <p>
                <strong>Điện thoại</strong>
                {e.phone ? (
                  <a href={`tel:${e.phone.replace(/\s/g, "")}`}>{e.phone}</a>
                ) : (
                  <span>Chưa cập nhật</span>
                )}
              </p>
            </div>
          )}
          {pf.email && (
            <div>
              <Mail size={17} />
              <p>
                <strong>Thư điện tử</strong>
                {e.email ? (
                  <a href={`mailto:${e.email}`}>{e.email}</a>
                ) : (
                  <span>Chưa cập nhật</span>
                )}
              </p>
            </div>
          )}
          {pf.website && (
            <div>
              <Globe size={17} />
              <p>
                <strong>Trang web</strong>
                {websiteUrl(e.website) ? (
                  <a
                    href={websiteUrl(e.website)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {e.website}
                  </a>
                ) : (
                  <span>Chưa cập nhật</span>
                )}
              </p>
            </div>
          )}
        </section>
        <CardActions employee={e} />
        <footer className="ecard-closing">
          <p className="ecard-slogan">{e.slogan}</p>
          <p className="ecard-motto">CHẤT LƯỢNG · CÔNG NGHỆ · TƯ DUY</p>
        </footer>
      </div>
    </article>
  );
}
