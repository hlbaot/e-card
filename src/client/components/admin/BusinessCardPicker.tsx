"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { BusinessCardType, Employee } from "@/shared/types";
import { Spinner } from "@/client/components/ui/Spinner";
import { Modal } from "@/client/components/ui/Modal";
import { QrBusinessCard } from "@/client/components/card/QrBusinessCard";
import { cardUrl, downloadBusinessCard } from "@/shared/utils/qr";
import { translateErrorMessage } from "@/i18n/error-map";

export function BusinessCardPicker({ employee, isNew = false, onSave, onClose }: {
  employee: Employee;
  isNew?: boolean;
  onSave: (type: BusinessCardType) => Promise<void>;
  onClose: () => void;
}) {
  const [type, setType] = useState<BusinessCardType | null>(isNew ? null : employee.theme.businessCardType ?? "qtm");
  const [operation, setOperation] = useState<"saving" | "exporting" | null>(null);
  const busy = operation !== null;
  const pendingRef = useRef(false);
  const [error, setError] = useState("");
  const svgRef = useRef<SVGSVGElement>(null);
  const t = useTranslations("admin.cardPicker");
  const tRoot = useTranslations();
  const preview = { ...employee, theme: { ...employee.theme, businessCardType: type ?? undefined } };
  async function save() {
    if (!type || pendingRef.current) return;
    pendingRef.current = true;
    setOperation("saving");
    setError("");
    try { await onSave(type); }
    catch (err) { setError(translateErrorMessage(err, tRoot, "admin.cardPicker.saveError")); }
    finally { pendingRef.current = false; setOperation(null); }
  }
  return <Modal width={800} title={t("title")} onClose={() => { if (!busy) onClose(); }}>
    <p className="mb-4 text-sm text-slate-400">
      {t("description", { name: employee.fullName })}{" "}
      {isNew && t("newNotice")}
    </p>
    <div role="group" aria-label={t("groupAria")} className="mb-4 grid grid-cols-2 gap-3">
      {([ ["qtm", t("optionQtm")], ["an-ninh-mang", t("optionCyber")] ] as const).map(([value, label]) =>
        <button key={value} type="button" aria-pressed={type === value} disabled={busy}
          className={`btn ${type === value ? "btn-primary" : "btn-secondary"}`} onClick={() => setType(value)}>{label}</button>)}
    </div>
    {type ? <div className="overflow-hidden rounded-xl border border-white/10">
      <QrBusinessCard employee={preview} url={cardUrl(employee.slug)} svgRef={svgRef} />
    </div> : <p className="rounded-xl border border-white/10 p-8 text-center text-slate-400">{t("selectToPreview")}</p>}
    {isNew && type && <p className="mt-3 text-xs text-slate-400">{t("previewNote")}</p>}
    {error && <p role="alert" className="mt-3 text-sm text-red-400">{error}</p>}
    <div className="mt-5 flex flex-wrap justify-end gap-3">
      {!isNew && <button type="button" className="btn btn-secondary" disabled={busy || !type} onClick={async () => {
        if (pendingRef.current) return;
        pendingRef.current = true;
        setOperation("exporting"); setError("");
        try { await downloadBusinessCard(svgRef.current, employee.slug); }
        catch { setError(t("exportError")); }
        finally { pendingRef.current = false; setOperation(null); }
      }} aria-busy={operation === "exporting"}>
        {operation === "exporting" && <Spinner />}
        {operation === "exporting" ? t("exporting") : t("downloadPng")}
      </button>}
      <button type="button" className="btn btn-primary" disabled={busy || !type} onClick={save} aria-busy={operation === "saving"}>
        {operation === "saving" && <Spinner />}
        {operation === "saving" ? (isNew ? t("creating") : t("updating")) : isNew ? t("createAndSave") : t("saveTemplate")}
      </button>
    </div>
  </Modal>;
}
