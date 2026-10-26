"use client";

import Link from "next/link";
import { Pencil, Trash2, Phone, Mail } from "lucide-react";
import type { Employee } from "@/shared/types";
import { Avatar } from "@/client/components/ui/Avatar";
import { Switch } from "@/client/components/ui/Switch";
import { routes } from "@/shared/constants/routes";

export interface TeamRowCardProps {
  employee: Employee;
  toggling?: boolean;
  onToggleActive: (employee: Employee) => void;
  onDeleteRequest: (employee: Employee) => void;
}

export function TeamRowCard({
  employee: e,
  onToggleActive,
  toggling,
  onDeleteRequest,
}: TeamRowCardProps) {
  return (
    <article className="rounded-xl border border-white/[0.09] bg-white/[0.025] p-4 transition-colors hover:border-cyan-400/30">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar
            name={e.fullName}
            src={e.avatarUrl}
            size={36}
            color={e.theme.primaryColor}
          />
          <div className="min-w-0">
            <strong className="block truncate text-sm font-semibold text-[var(--ink)]">
              {e.fullName}
            </strong>
            <span className="mt-0.5 block truncate text-xs text-[var(--muted)]">
              {e.companyShort}
            </span>
          </div>
        </div>

        {/* Action buttons (32px) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Link
            href={routes.employee(e.id)}
            title={`Chỉnh sửa ${e.fullName}`}
            aria-label={`Sửa ${e.fullName}`}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-[var(--text-body)] transition-all hover:border-cyan-400/40 hover:bg-cyan-400/12 hover:text-white"
          >
            <Pencil size={15} />
          </Link>
          <button
            type="button"
            title={`Xóa ${e.fullName}`}
            aria-label={`Xóa ${e.fullName}`}
            onClick={() => onDeleteRequest(e)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-rose-400/90 transition-all hover:border-rose-400/40 hover:bg-rose-500/15 hover:text-rose-300 cursor-pointer"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Position */}
      <p className="mt-2.5 text-xs font-medium text-[var(--text-body)]">
        {e.position}
      </p>

      {/* Contact rows */}
      <div className="mt-3 space-y-1.5 border-t border-white/[0.07] pt-3 text-xs">
        <div className="flex items-center gap-2 text-[var(--ink)] tabular-nums">
          <Phone size={13} className="text-cyan-400 shrink-0" />
          <span>{e.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-[var(--muted)] min-w-0">
          <Mail size={13} className="text-cyan-400 shrink-0" />
          <span className="font-mono text-xs truncate" title={e.email}>
            {e.email}
          </span>
        </div>
      </div>

      {/* Status Footer */}
      <div className="mt-3 flex items-center justify-between border-t border-white/[0.07] pt-3">
        <span className="text-xs text-[var(--muted)]">Trạng thái hiển thị</span>
        <div className="flex items-center gap-2.5">
          <Switch
            checked={e.isActive}
            disabled={toggling}
            label={`Bật danh thiếp của ${e.fullName}`}
            onChange={() => onToggleActive(e)}
          />
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
              e.isActive
                ? "bg-teal-400/12 text-teal-300 border border-teal-400/25"
                : "bg-white/[0.05] text-[var(--muted)] border border-white/10"
            }`}
          >
            <span
              aria-hidden="true"
              className={`h-1.5 w-1.5 rounded-full ${
                e.isActive
                  ? "bg-teal-400 shadow-[0_0_6px_#2dd4bf]"
                  : "bg-slate-400"
              }`}
            />
            {e.isActive ? "Đang bật" : "Đã tắt"}
          </span>
        </div>
      </div>
    </article>
  );
}
