"use client";

import { formatPhone } from "@/shared/utils/phone";

import { MapPin, Phone, Mail, Globe } from "lucide-react";
import { getPublicFields } from "@/shared/types";
import type { Employee } from "@/shared/types";
import { websiteUrl } from "@/shared/utils/vcard";

interface ContactListProps {
  employee: Employee;
  onOpenAddresses?: () => void;
}

export function ContactList({
  employee: e,
  onOpenAddresses,
}: ContactListProps) {
  const pf = getPublicFields(e);
  const webHref = websiteUrl(e.website);
  const headOffice =
    e.offices[0]?.address ||
    "Số 22 Hồ Giám, phường Văn Miếu - Quốc Tử Giám, Hà Nội, Việt Nam";
  const hanoiOffice =
    e.offices[1]?.address ||
    "Số 01 Lê Đức Thọ, phường Từ Liêm, Hà Nội, Việt Nam";

  const translateOfficeLabel = (
    rawLabel: string | undefined,
    fallback: string,
  ) => {
    if (!rawLabel) return fallback;
    const normalized = rawLabel.trim().toLowerCase();
    if (normalized === "head office") return "Trụ sở chính";
    if (normalized === "hanoi office") return "Văn phòng Hà Nội";
    return rawLabel;
  };

  const allRows = [
    ...(pf.offices
      ? [
          {
            id: "head-office",
            label: translateOfficeLabel(e.offices[0]?.label, "Trụ sở chính"),
            value: headOffice,
            icon: MapPin,
            href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(headOffice)}`,
            external: true,
            isAddress: true,
          },
          {
            id: "hanoi-office",
            label: translateOfficeLabel(
              e.offices[1]?.label,
              "Văn phòng Hà Nội",
            ),
            value: hanoiOffice,
            icon: MapPin,
            href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hanoiOffice)}`,
            external: true,
            isAddress: true,
          },
        ]
      : []),
    ...(pf.phone
      ? [
          {
            id: "mobile",
            label: "Điện thoại",
            value: formatPhone(e.phone) || "Chưa cập nhật",
            icon: Phone,
            href: e.phone ? `tel:${e.phone.replace(/\s/g, "")}` : "",
            external: false,
            isAddress: false,
          },
        ]
      : []),
    ...(pf.email
      ? [
          {
            id: "email",
            label: "Thư điện tử",
            value: e.email || "Chưa cập nhật",
            icon: Mail,
            href: e.email ? `mailto:${e.email}` : "",
            external: false,
            isAddress: false,
          },
        ]
      : []),
    ...(pf.website
      ? [
          {
            id: "website",
            label: "Trang web",
            value: e.website || "qtmmedia.vn",
            icon: Globe,
            href: webHref || "https://qtmmedia.vn",
            external: true,
            isAddress: false,
          },
        ]
      : []),
  ];

  if (allRows.length === 0) return null;

  return (
    <div className="w-full min-w-0">
      <div className="ecard-contact-list flex flex-col">
        {allRows.map((row, idx) => {
          const Icon = row.icon;
          const delay = String(200 + idx * 50);
          const content = (
            <>
              <Icon
                className="shrink-0 w-[16px] h-[16px] md:w-[18px] md:h-[18px] mt-[2px]"
                style={{ color: "var(--pv-primary)" }}
                aria-hidden="true"
              />
              <p
                className={
                  row.isAddress
                    ? "ecard-contact-line min-w-0 flex-1 text-left leading-snug break-words line-clamp-2"
                    : "ecard-contact-line min-w-0 flex-1 text-left leading-snug truncate"
                }
                style={{ color: "var(--pv-body)" }}
              >
                <strong
                  className="font-bold mr-1.5"
                  style={{ color: "var(--pv-strong)" }}
                >
                  {row.label}:
                </strong>
                <span className="transition-colors">{row.value}</span>
              </p>
            </>
          );

          if (row.isAddress && onOpenAddresses) {
            return (
              <div key={row.id} data-aos="fade-left" data-aos-delay={delay}>
                <a
                  href={row.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ecard-contact-row group hidden md:flex items-start gap-2.5 w-full transition-opacity hover:opacity-80"
                >
                  {content}
                </a>
                <button
                  type="button"
                  onClick={onOpenAddresses}
                  className="ecard-contact-row group flex md:hidden items-start gap-2.5 w-full text-left transition-opacity hover:opacity-80 cursor-pointer"
                >
                  {content}
                </button>
              </div>
            );
          }

          return (
            <div key={row.id} data-aos="fade-left" data-aos-delay={delay}>
              <a
                href={row.href || "#"}
                target={row.external ? "_blank" : undefined}
                rel={row.external ? "noopener noreferrer" : undefined}
                className="ecard-contact-row group flex items-start gap-2.5 w-full transition-opacity hover:opacity-80"
              >
                {content}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
