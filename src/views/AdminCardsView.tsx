"use client";
import { useDeferredValue, useMemo } from "react";
import { useEmployeeStore } from "@/client/store/employee.store";
import Link from "next/link";
import { Search, Plus, ContactRound, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEmployees } from "@/client/hooks/useEmployees";
import { AdminCardItem } from "@/client/components/admin/AdminCardItem";
import { Skeleton } from "@/client/components/ui/Skeleton";
import { slugify } from "@/shared/utils/slugify";
import { translateErrorMessage } from "@/i18n/error-map";

export function AdminCardsView() {
  const { employees, ready, error } = useEmployees();
  const search = useEmployeeStore(state => state.cardSearch);
  const setSearch = useEmployeeStore(state => state.setCardSearch);
  const t = useTranslations("admin.cards");
  const tRoot = useTranslations();
  const deferredSearch = useDeferredValue(search);
  const normalizedSearch = useMemo(
    () => slugify(deferredSearch),
    [deferredSearch],
  );
  const filtered = useMemo(
    () =>
      !normalizedSearch
        ? employees
        : employees.filter((e) =>
            slugify(`${e.fullName} ${e.position}`).includes(normalizedSearch),
          ),
    [employees, normalizedSearch],
  );
  return (
    <div className="admin-fade-in">
      <div className="page-heading">
        <div>
          <div className="eyebrow mb-2">QTM MEDIATECH PLATFORM</div>
          <h1>
            {t("titlePrefix")} <span className="qtm-gradient-text">{t("titleHighlight")}</span>
          </h1>
          <p>{t("subtitle")}</p>
        </div>
        <Link className="btn btn-primary group" href="/admin/employees/new">
          <Plus size={16} />
          {t("createCard")}
          <ArrowRight
            size={15}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      </div>
      {error && (
        <p role="alert" className="panel text-red-400">
          {translateErrorMessage(error, tRoot)}
        </p>
      )}
      <div className="section-heading">
        <div className="section-title">
          <ContactRound size={18} className="text-[#22D3EE]" />
          <span className="muted">{t("allCards")}</span>
          <span className="count-badge">{ready ? employees.length : "…"}</span>
        </div>
        <label className="search-box">
          <Search size={16} />
          <input
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchAria")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      </div>
      {!ready ? (
        <Skeleton />
      ) : (
        <div className="employee-grid">
          {filtered.map((e) => (
            <div key={e.id}>
              <AdminCardItem employee={e} />
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="empty">
              <h3>{t("emptyTitle")}</h3>
              <p>{t("emptySubtitle")}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
