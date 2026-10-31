"use client";
import {
  Phone,
  Mail,
  MessageCircle,
  ContactRound,
  Globe,
  MapPin,
} from "lucide-react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("card.actions");
  const tToast = useTranslations("toast");
  const pf = getPublicFields(e);
  const firstOffice = e.offices.find(office => office.address.trim());
  const actions = [
    ...(pf.phone && e.phone.trim()
      ? [
          {
            id: "call",
            label: t("call"),
            icon: Phone,
            href: e.phone ? `tel:${e.phone.replace(/\s/g, "")}` : "",
            external: false,
          },
        ]
      : []),
    ...(pf.email && e.email.trim()
      ? [
          {
            id: "email",
            label: t("email"),
            icon: Mail,
            href: e.email ? `mailto:${e.email}` : "",
            external: false,
          },
        ]
      : []),
    ...(pf.zalo && e.zalo.replace(/[^0-9]/g, "")
      ? [
          {
            id: "zalo",
            label: t("zalo"),
            icon: MessageCircle,
            href: e.zalo
              ? `https://zalo.me/${e.zalo.replace(/[^0-9]/g, "")}`
              : "",
            external: true,
          },
        ]
      : []),
    { id: "save", label: t("saveContact"), icon: ContactRound, href: "", external: false },
    ...(pf.website && websiteUrl(e.website)
      ? [
          {
            id: "website",
            label: t("website"),
            icon: Globe,
            href: websiteUrl(e.website),
            external: true,
          },
        ]
      : []),
    ...(pf.offices && firstOffice
      ? [
          {
            id: "directions",
            label: t("directions"),
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
      {actions.map(({ id, label, icon: Icon, href, external }, index) => {
        const aosProps = animate
          ? {
              "data-aos": "zoom-in-up",
              "data-aos-delay": String(200 + index * 50),
              "data-aos-duration": "500",
            }
          : {};
        return href ? (
          <a
            key={id}
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
            key={id}
            type="button"
            onClick={() => {
              saveContact(e);
              toast(tToast("contactSaved"));
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
