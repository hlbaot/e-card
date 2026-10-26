import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowUpRight, Building2 } from "lucide-react";
import type { Employee } from "@/shared/types";
import { Avatar } from "@/client/components/ui/Avatar";
import { routes } from "@/shared/constants/routes";
export function CardListContent({
  employee: e,
  showFooter = true,
}: {
  employee: Employee;
  showFooter?: boolean;
}) {
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
        <span>QTM MEDIATECH</span>
        {showFooter && e.isActive && <i className="live-dot" />}
      </div>
      <Avatar
        name={e.fullName}
        src={e.avatarUrl}
        color={e.theme.primaryColor}
        size={80}
        rounded={e.theme.avatarShape === "rounded"}
      />
      <h3>{e.fullName}</h3>
      <p className="position">{e.position}</p>
      <p className={`company ${showFooter ? "" : "pb-4"}`}>{e.companyShort}</p>
      {showFooter && (
        <div className="employee-card-footer">
          <span className="button-row">
            <Building2 size={12} />
            QTM MediaTech
          </span>
          <span>
            Xem hồ sơ
            <ArrowUpRight size={14} />
          </span>
        </div>
      )}
    </>
  );
}
export function CardListItem({ employee }: { employee: Employee }) {
  return (
    <Link href={routes.card(employee.slug)} className="employee-card">
      <CardListContent employee={employee} />
    </Link>
  );
}
