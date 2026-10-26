"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, ArrowUpRight } from "lucide-react";
import type { Employee } from "@/shared/types";
import { Avatar } from "@/client/components/ui/Avatar";
import { Switch } from "@/client/components/ui/Switch";
import { Badge } from "@/client/components/ui/Badge";
import { Modal } from "@/client/components/ui/Modal";
import { useToast } from "@/client/components/ui/Toast";
import { useEmployeeMutations } from "@/client/hooks/useEmployeeMutations";
import { routes } from "@/shared/constants/routes";
import { TeamRowCard } from "./TeamRowCard";

export interface TeamTableProps {
  employees: Employee[];
  totalCount?: number;
  showPanelHeader?: boolean;
}

export function TeamTable({
  employees,
  totalCount,
  showPanelHeader = true,
}: TeamTableProps) {
  const [deleting, setDeleting] = useState<Employee | null>(null);
  const { remove, toggleActive, isToggling } = useEmployeeMutations();
  const toast = useToast();

  const handleToggle = async (e: Employee) => {
    try {
      await toggleActive(e.id);
      toast(e.isActive ? "Đã tắt danh thiếp" : "Đã bật danh thiếp");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Không thể đổi trạng thái", "error");
    }
  };

  return (
    <>
      <section
        aria-label="Đội ngũ của bạn"
        className="rounded-2xl border border-white/[0.11] bg-[var(--surface)] backdrop-blur-xl overflow-hidden shadow-[0_16px_40px_rgba(2,6,23,0.32)]"
      >
        {showPanelHeader && (
          <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6 sm:py-5 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <h2 className="text-[18px] font-bold tracking-tight text-[var(--ink)]">
                Đội ngũ của bạn
              </h2>
              <Badge withDot={false} className="tabular-nums">
                {totalCount ?? employees.length}
              </Badge>
            </div>
            <Link
              href={routes.employees}
              className="group inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 text-xs font-semibold text-[var(--text-body)] transition-all hover:border-cyan-400/50 hover:bg-cyan-400/10 hover:text-white"
            >
              <span>Xem tất cả</span>
              <ArrowUpRight
                size={14}
                className="text-cyan-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        )}

        {/* Desktop & Tablet Table View (>= 768px) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.03]">
                <th className="py-3.5 pl-6 pr-4 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                  Nhân viên
                </th>
                <th className="px-4 py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                  Chức vụ
                </th>
                <th className="px-4 py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                  Liên hệ
                </th>
                <th className="px-4 py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                  Trạng thái
                </th>
                <th className="py-3.5 pl-4 pr-6 text-right font-mono text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {employees.map((e) => (
                <tr
                  key={e.id}
                  className="h-16 transition-colors hover:bg-white/[0.03]"
                >
                  {/* Nhân viên */}
                  <td className="py-3 pl-6 pr-4">
                    <div className="flex items-center gap-3">
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
                  </td>

                  {/* Chức vụ */}
                  <td className="px-4 py-3 text-sm text-[var(--text-body)]">
                    {e.position}
                  </td>

                  {/* Liên hệ */}
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-[var(--ink)] tabular-nums">
                      {e.phone}
                    </div>
                    <div
                      title={e.email}
                      className="mt-0.5 max-w-[220px] truncate font-mono text-xs text-[var(--muted)]"
                    >
                      {e.email}
                    </div>
                  </td>

                  {/* Trạng thái */}
                  <td className="px-4 py-3">
                    <div className="inline-flex items-center gap-2.5">
                      <Switch
                        checked={e.isActive}
                      disabled={isToggling(e.id)}
                        label={`Bật danh thiếp của ${e.fullName}`}
                        onChange={() => handleToggle(e)}
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
                  </td>

                  {/* Thao tác */}
                  <td className="py-3 pl-4 pr-6 text-right">
                    <div className="inline-flex items-center justify-end gap-1.5">
                      <Link
                        href={routes.employee(e.id)}
                        title={`Chỉnh sửa ${e.fullName}`}
                        aria-label={`Sửa ${e.fullName}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-transparent bg-white/[0.04] text-[var(--text-body)] transition-all hover:border-cyan-400/40 hover:bg-cyan-400/12 hover:text-white"
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        type="button"
                        title={`Xóa ${e.fullName}`}
                        aria-label={`Xóa ${e.fullName}`}
                        onClick={() => setDeleting(e)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-transparent bg-white/[0.04] text-rose-400/90 transition-all hover:border-rose-400/40 hover:bg-rose-500/15 hover:text-rose-300 cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card List View (< 768px) */}
        <div className="grid grid-cols-1 gap-3 p-4 md:hidden">
          {employees.map((e) => (
            <TeamRowCard
              key={e.id}
              employee={e}
              onToggleActive={handleToggle}
              toggling={isToggling(e.id)}
              onDeleteRequest={setDeleting}
            />
          ))}
        </div>

        {employees.length === 0 && (
          <div className="p-8 text-center text-sm text-[var(--muted)]">
            Không có nhân viên phù hợp.
          </div>
        )}
      </section>

      {deleting && (
        <Modal title="Xóa nhân viên?" onClose={() => setDeleting(null)}>
          <p className="confirmation">
            Bạn muốn xóa <strong>{deleting.fullName}</strong>? Danh thiếp và
            liên kết của nhân viên này sẽ không còn khả dụng.
          </p>
          <div className="button-row justify-end">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setDeleting(null)}
            >
              Hủy
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={async () => {
                try {
                  await remove(deleting.id);
                  setDeleting(null);
                  toast("Đã xóa nhân viên");
                } catch (err) {
                  toast(err instanceof Error ? err.message : "Không thể xóa nhân viên", "error");
                }
              }}
            >
              Xóa nhân viên
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
