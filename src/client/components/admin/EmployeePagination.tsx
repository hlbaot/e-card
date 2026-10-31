"use client";

import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function EmployeePagination({ page, pageSize, total, onPageChange }: {
  page: number; pageSize: number; total: number; onPageChange: (page: number) => void;
}) {
  const t = useTranslations("admin.employees.table");
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const start = total ? (page - 1) * pageSize + 1 : 0;
  const end = Math.min(page * pageSize, total);
  return <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-3 py-4">
    <p className="text-xs text-slate-400" role="status">{t("paginationSummary", { start, end, total })}</p>
    {pageCount > 1 && <nav aria-label={t("paginationAria")} className="flex max-w-full items-center gap-1 overflow-x-auto">
      <button type="button" className="pagination-button" disabled={page === 1} aria-label={t("prevPage")} onClick={() => onPageChange(page - 1)}>
        <ChevronLeft size={16} />
      </button>
      {Array.from({ length: pageCount }, (_, i) => i + 1).map(number => <button
        key={number} type="button" className="pagination-button" aria-label={t("pageNumber", { page: number })}
        aria-current={number === page ? "page" : undefined} onClick={() => onPageChange(number)}>
        {number}
      </button>)}
      <button type="button" className="pagination-button" disabled={page === pageCount} aria-label={t("nextPage")} onClick={() => onPageChange(page + 1)}>
        <ChevronRight size={16} />
      </button>
    </nav>}
  </div>;
}
