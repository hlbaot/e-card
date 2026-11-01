"use client";
import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { Employee } from "@/shared/types";
import { resolveLocale } from "@/i18n/config";
import { localizeText, localizeEmployeeName } from "@/shared/utils/localize";
import { Avatar } from "@/client/components/ui/Avatar";
import { Switch } from "@/client/components/ui/Switch";
import { Spinner } from "@/client/components/ui/Spinner";
import { Modal } from "@/client/components/ui/Modal";
import { useToast } from "@/client/components/ui/Toast";
import { useEmployeeMutations } from "@/client/hooks/useEmployeeMutations";
import { routes } from "@/shared/constants/routes";
import { translateErrorMessage } from "@/i18n/error-map";

export function EmployeeTable({ employees }: { employees: Employee[] }) {
  const [deleting, setDeleting] = useState<Employee | null>(null);
  const [removing, setRemoving] = useState(false);
  const closeDelete = () => { if (!removing) setDeleting(null); };
  const { remove, toggleActive, isToggling } = useEmployeeMutations();
  const toast = useToast();
  const locale = resolveLocale(useLocale());
  const t = useTranslations("admin.employees");
  const tCommon = useTranslations("common");
  const tToast = useTranslations("toast");
  const tRoot = useTranslations();

  return (
    <>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>{t("columns.employee")}</th>
              <th>{t("columns.position")}</th>
              <th>{t("columns.contact")}</th>
              <th>{t("columns.status")}</th>
              <th>{t("columns.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((e) => (
              <tr key={e.id}>
                <td>
                  <div className="employee-cell">
                    <Avatar
                      name={localizeEmployeeName(e.fullName, locale)}
                      src={e.avatarUrl}
                      size={37}
                      color={e.theme.primaryColor}
                    />
                    <div>
                      <strong className="uppercase">{localizeEmployeeName(e.fullName, locale).toLocaleUpperCase("vi-VN")}</strong>
                      <small>{localizeText(e.companyShort, locale)}</small>
                    </div>
                  </div>
                </td>
                <td>{localizeText(e.position, locale)}</td>
                <td>
                  <div className="whitespace-pre-wrap">{e.phone}</div>
                  <small className="muted">{e.email}</small>
                </td>
                <td>
                  <div className="button-row">
                    <Switch
                      checked={e.isActive}
                      disabled={isToggling(e.id)}
                      label={t("toggleAria", { name: localizeEmployeeName(e.fullName, locale) })}
                      onChange={async () => {
                        try {
                          await toggleActive(e.id);
                          toast(
                            e.isActive
                              ? tToast("cardDeactivated")
                              : tToast("cardActivated"),
                          );
                        } catch (err) {
                          toast(
                            translateErrorMessage(err, tRoot, "toast.statusChangeError"),
                            "error",
                          );
                        }
                      }}
                    />
                    <span className={`status ${e.isActive ? "" : "off"}`}>
                      {e.isActive ? tCommon("enabled") : tCommon("disabled")}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="row-actions">
                    <Link
                      className="icon-button"
                      href={routes.employee(e.id)}
                      aria-label={t("editAria", { name: localizeEmployeeName(e.fullName, locale) })}
                    >
                      <Pencil size={15} />
                    </Link>
                    <button
                      className="icon-button"
                      aria-label={t("deleteAria", { name: localizeEmployeeName(e.fullName, locale) })}
                      onClick={() => setDeleting(e)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {employees.length === 0 && (
          <div className="empty">{t("empty")}</div>
        )}
      </div>
      {deleting && (
        <Modal title={t("deleteModalTitle")} onClose={closeDelete}>
          <p className="confirmation">
            {t("deleteConfirmPrefix")} <strong className="uppercase">{localizeEmployeeName(deleting.fullName, locale).toUpperCase()}</strong>?{" "}
            {t("deleteConfirmSuffix")}
          </p>
          <div className="button-row justify-end">
            <button
              className="btn btn-secondary"
              disabled={removing}
              onClick={closeDelete}
            >
              {tCommon("cancel")}
            </button>
            <button
              className="btn btn-danger"
              disabled={removing}
              onClick={async () => {
                setRemoving(true);
                try {
                  await remove(deleting.id);
                  setDeleting(null);
                  toast(tToast("employeeDeleted"));
                } catch (err) {
                  toast(
                    translateErrorMessage(err, tRoot, "toast.employeeDeleteError"),
                    "error",
                  );
                } finally {
                  setRemoving(false);
                }
              }}
            >
              {removing ? <Spinner size={14} /> : null}
              {removing ? tCommon("deleting") : t("deleteConfirmButton")}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
