"use client";
import {
  Phone,
  Mail,
  MessageCircle,
  ContactRound,
  Globe,
  MapPin,
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
  const firstOffice = e.offices.find(office => office.address.trim());
  const actions = [
    ...(pf.phone && e.phone.trim()
      ? [
          {
            label: "Gọi điện",
            icon: Phone,
            href: e.phone ? `tel:${e.phone.replace(/\s/g, "")}` : "",
            external: false,
          },
        ]
      : []),
    ...(pf.email && e.email.trim()
      ? [
          {
            label: "Gửi thư",
            icon: Mail,
            href: e.email ? `mailto:${e.email}` : "",
            external: false,
          },
        ]
      : []),
    ...(pf.zalo && e.zalo.replace(/[^0-9]/g, "")
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
    ...(pf.website && websiteUrl(e.website)
      ? [
          {
            label: "Trang web",
            icon: Globe,
            href: websiteUrl(e.website),
            external: true,
          },
        ]
      : []),
    ...(pf.offices && firstOffice
      ? [
          {
            label: "Chỉ đường",
            icon: MapPin,
            href: firstOffice?.address
              ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(firstOffice.address.trim())}`
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
              "data-aos-delay": String(200 + index * 50),
              "data-aos-duration": "500",
            }
          : {};
        return href ? (
          <a
            key={label}
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            {...aosProps}
          >
            <span className="action-btn-content">
              <Icon size={16} />
              <span>{label}</span>
            </span>
          </a>
        ) : (
          <button
            key={label}
            type="button"
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
          </button>
        );
      })}
    </div>
  );
}
