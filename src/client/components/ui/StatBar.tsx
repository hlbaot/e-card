import type { LucideIcon } from "lucide-react";
import { cn } from "@/shared/utils/cn";

export interface StatBarItem {
  label: string;
  value: string | number;
  note?: string;
  icon: LucideIcon;
}

export function StatBar({
  items,
  className,
}: {
  items: StatBarItem[];
  className?: string;
}) {
  return (
    <div className={cn("qtm-stat-bar", className)}>
      {items.map(({ label, value, note, icon: Icon }, idx) => (
        <div key={label} className="qtm-stat-item">
          <span className="qtm-stat-icon" aria-hidden="true">
            <Icon size={20} />
          </span>
          <div className="qtm-stat-copy">
            <strong>{value}</strong>
            <span>{label}</span>
            {note && <small>{note}</small>}
          </div>
          {idx < items.length - 1 && (
            <i className="qtm-stat-divider" aria-hidden="true" />
          )}
        </div>
      ))}
    </div>
  );
}
