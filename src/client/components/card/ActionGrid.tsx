"use client";

import {
  Phone,
  Mail,
  MessageCircle,
  UserPlus,
  Globe,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { getPublicFields } from "@/shared/types";
import type { Employee } from "@/shared/types";
import { saveContact, websiteUrl } from "@/shared/utils/vcard";
import { useToast } from "@/client/components/ui/Toast";
import { cn } from "@/shared/utils/cn";

export function ActionGrid({ employee: e }: { employee: Employee }) {
  const toast = useToast();
  const pf = getPublicFields(e);
  const webHref = websiteUrl(e.website) || "https://qtmmedia.vn";
  const mapAddress =
    e.offices[0]?.address ||
    "Số 22 Hồ Giám, phường Văn Miếu - Quốc Tử Giám, Hà Nội, Việt Nam";
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapAddress)}`;

  const actions = [
    ...(pf.phone
      ? [
          {
            id: "call",
            label: "Gọi điện",
            icon: Phone,
            href: e.phone ? `tel:${e.phone.replace(/\s/g, "")}` : "",
            external: false,
            onClick: undefined,
          },
        ]
      : []),
    ...(pf.email
      ? [
          {
            id: "email",
            label: "Gửi thư",
            icon: Mail,
            href: e.email ? `mailto:${e.email}` : "",
            external: false,
            onClick: undefined,
          },
        ]
      : []),
    ...(pf.zalo
      ? [
          {
            id: "zalo",
            label: "Nhắn Zalo",
            icon: MessageCircle,
            href: e.zalo
              ? `https://zalo.me/${e.zalo.replace(/[^0-9]/g, "")}`
              : "",
            external: true,
            onClick: undefined,
          },
        ]
      : []),
    {
      id: "save",
      label: "Lưu danh bạ",
      icon: UserPlus,
      href: "",
      external: false,
      onClick: () => {
        saveContact(e);
        toast("Đã tải danh bạ vCard (.vcf)");
      },
    },
    ...(pf.website
      ? [
          {
            id: "website",
            label: "Trang web",
            icon: Globe,
            href: webHref,
            external: true,
            onClick: undefined,
          },
        ]
      : []),
    ...(pf.offices
      ? [
          {
            id: "direction",
            label: "Chỉ đường",
            icon: MapPin,
            href: mapHref,
            external: true,
            onClick: undefined,
          },
        ]
      : []),
  ];

  return (
    <div className="w-full">
      <div className="ecard-action-grid grid grid-cols-3">
        {actions.map(
          ({ id, label, icon: Icon, href, external, onClick }, idx) => {
            const delay = String(350 + idx * 50);
            const itemClass = cn(
              "ecard-action-btn group flex items-center justify-between gap-1 rounded-xl px-2 md:px-3 w-full font-semibold transition duration-150 active:scale-[0.98] select-none cursor-pointer",
            );

            const inner = (
              <>
                <span className="flex items-center gap-1.5 min-w-0">
                  <Icon className="shrink-0 w-[13px] h-[13px] md:w-[15px] md:h-[15px] transition-colors duration-150" />
                  <span className="ecard-action-label truncate transition-colors duration-150">
                    {label}
                  </span>
                </span>
                <ChevronRight className="shrink-0 w-3 h-3 md:w-3.5 md:h-3.5 opacity-75 transition-all duration-150 group-hover:translate-x-0.5 group-hover:opacity-100" />
              </>
            );

            if (onClick) {
              return (
                <div key={id} data-aos="zoom-in-up" data-aos-delay={delay}>
                  <button type="button" onClick={onClick} className={itemClass}>
                    {inner}
                  </button>
                </div>
              );
            }

            return (
              <div key={id} data-aos="zoom-in-up" data-aos-delay={delay}>
                <a
                  href={href || "#"}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className={itemClass}
                >
                  {inner}
                </a>
              </div>
            );
          },
        )}
      </div>
    </div>
  );
}
