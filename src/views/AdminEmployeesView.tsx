"use client";
import { useDeferredValue, useMemo } from "react";
import { useEmployeeStore } from "@/client/store/employee.store";
import Link from "next/link";
import { Plus, Search, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEmployees } from "@/client/hooks/useEmployees";
import { EmployeeTable } from "@/client/components/admin/EmployeeTable";
import { Skeleton } from "@/client/components/ui/Skeleton";
import { slugify } from "@/shared/utils/slugify";
import { translateErrorMessage } from "@/i18n/error-map";

export function AdminEmployeesView() {
  const { employees, ready, error } = useEmployees();
  const search = useEmployeeStore(state => state.employeeSearch);
  const setSearch = useEmployeeStore(state => state.setEmployeeSearch);
  const t = useTranslations("admin.employees");
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
            slugify(`${e.fullName} ${e.position} ${e.email}`).includes(
              normalizedSearch,
            ),
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
          {t("addButton")}
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
      <section className="panel">
        <div className="table-toolbar">
          <label className="search-box">
            <Search size={16} />
            <input
              aria-label={t("searchAria")}
              placeholder={t("searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <p>{t("teamCount", { count: ready ? String(employees.length) : "…" })}</p>
        </div>
        {!ready ? (
          <Skeleton />
        ) : (
          <>
            <EmployeeTable employees={filtered} />
            <p className="table-bottom">
              {t("showingCount", { shown: filtered.length, total: employees.length })}
            </p>
          </>
        )}
      </section>
    </div>
  );
}
