"use client";
import {
  Phone,
  Mail,
  MessageCircle,
  ContactRound,
  Globe,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { getPublicFields } from "@/shared/types";
import type { Employee } from "@/shared/types";
import { saveContact, websiteUrl } from "@/shared/utils/vcard";
import { useToast } from "@/client/components/ui/Toast";

export function CardActions({
  employee: e,
  animate = false,
}: {
  employee: Employee;
  animate?: boolean;
}) {
  const toast = useToast();
  const pf = getPublicFields(e);
  const actions = [
    ...(pf.phone
      ? [
          {
            label: "Gọi điện",
            icon: Phone,
            href: e.phone ? `tel:${e.phone.replace(/\s/g, "")}` : "",
            external: false,
          },
        ]
      : []),
    ...(pf.email
      ? [
          {
            label: "Gửi thư",
            icon: Mail,
            href: e.email ? `mailto:${e.email}` : "",
            external: false,
          },
        ]
      : []),
    ...(pf.zalo
      ? [
          {
            label: "Nhắn Zalo",
            icon: MessageCircle,
            href: e.zalo
              ? `https://zalo.me/${e.zalo.replace(/[^0-9]/g, "")}`
              : "",
            external: true,
          },
        ]
      : []),
    { label: "Lưu danh bạ", icon: ContactRound, href: "", external: false },
    ...(pf.website
      ? [
          {
            label: "Trang web",
            icon: Globe,
            href: websiteUrl(e.website),
            external: true,
          },
        ]
      : []),
    ...(pf.offices
      ? [
          {
            label: "Chỉ đường",
            icon: MapPin,
            href: e.offices[0]?.address
              ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e.offices[0].address)}`
              : "",
            external: true,
          },
        ]
      : []),
  ];

  return (
    <div className="card-actions actions-outline">
      {actions.map(({ label, icon: Icon, href, external }, index) => {
        const aosProps = animate
          ? {
              "data-aos": "zoom-in-up",
              "data-aos-delay": String(300 + index * 55),
            }
          : {};
        return href ? (
          <a
            key={label}
            href={href}
            className={index === 0 ? "action-primary" : undefined}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            {...aosProps}
          >
            <span className="action-btn-content">
              <Icon size={16} />
              <span>{label}</span>
            </span>
            <ChevronRight size={13} className="action-btn-chevron" />
          </a>
        ) : (
          <button
            key={label}
            type="button"
            className={index === 0 ? "action-primary" : undefined}
            disabled={label !== "Lưu danh bạ"}
            title={label !== "Lưu danh bạ" ? "Chưa có thông tin" : undefined}
            onClick={() => {
              saveContact(e);
              toast("Đã tải danh bạ vCard");
            }}
            {...aosProps}
          >
            <span className="action-btn-content">
              <Icon size={16} />
              <span>{label}</span>
            </span>
            <ChevronRight size={13} className="action-btn-chevron" />
          </button>
        );
      })}
    </div>
  );
}
