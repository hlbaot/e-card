"use client";

import { useRef, useState } from "react";
import type { BusinessCardType, Employee } from "@/shared/types";
import { Spinner } from "@/client/components/ui/Spinner";
import { Modal } from "@/client/components/ui/Modal";
import { QrBusinessCard } from "@/client/components/card/QrBusinessCard";
import { cardUrl, downloadBusinessCard } from "@/shared/utils/qr";

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
  const preview = { ...employee, theme: { ...employee.theme, businessCardType: type ?? undefined } };
  async function save() {
    if (!type || pendingRef.current) return;
    pendingRef.current = true;
    setOperation("saving");
    setError("");
    try { await onSave(type); }
    catch (err) { setError(err instanceof Error ? err.message : "Không thể lưu mẫu card. Vui lòng thử lại."); }
    finally { pendingRef.current = false; setOperation(null); }
  }
  return <Modal width={800} title="Chọn loại card" onClose={() => { if (!busy) onClose(); }}>
    <p className="mb-4 text-sm text-slate-400">Chọn mẫu danh thiếp cho {employee.fullName}. {isNew && "Nhân viên chỉ được tạo khi bạn chọn mẫu và xác nhận lưu."}</p>
    <div role="group" aria-label="Loại card" className="mb-4 grid grid-cols-2 gap-3">
      {([ ["qtm", "1. QTM"], ["an-ninh-mang", "2. An ninh mạng"] ] as const).map(([value, label]) =>
        <button key={value} type="button" aria-pressed={type === value} disabled={busy}
          className={`btn ${type === value ? "btn-primary" : "btn-secondary"}`} onClick={() => setType(value)}>{label}</button>)}
    </div>
    {type ? <div className="overflow-hidden rounded-xl border border-white/10">
      <QrBusinessCard employee={preview} url={cardUrl(employee.slug)} svgRef={svgRef} />
    </div> : <p className="rounded-xl border border-white/10 p-8 text-center text-slate-400">Chọn QTM hoặc An ninh mạng để xem trước.</p>}
    {isNew && type && <p className="mt-3 text-xs text-slate-400">Mã QR trong bản xem trước là minh họa. QR chính thức và tải PNG có sau khi lưu nhân viên.</p>}
    {error && <p role="alert" className="mt-3 text-sm text-red-400">{error}</p>}
    <div className="mt-5 flex flex-wrap justify-end gap-3">
      {!isNew && <button type="button" className="btn btn-secondary" disabled={busy || !type} onClick={async () => {
        if (pendingRef.current) return;
        pendingRef.current = true;
        setOperation("exporting"); setError("");
        try { await downloadBusinessCard(svgRef.current, employee.slug); }
        catch { setError("Không thể tải danh thiếp. Vui lòng thử lại."); }
        finally { pendingRef.current = false; setOperation(null); }
      }} aria-busy={operation === "exporting"}>
        {operation === "exporting" && <Spinner />}
        {operation === "exporting" ? "Đang xuất…" : "Tải PNG"}
      </button>}
      <button type="button" className="btn btn-primary" disabled={busy || !type} onClick={save} aria-busy={operation === "saving"}>
        {operation === "saving" && <Spinner />}
        {operation === "saving" ? (isNew ? "Đang tạo nhân viên…" : "Đang cập nhật…") : isNew ? "Tạo nhân viên và lưu card" : "Lưu mẫu card"}
      </button>
    </div>
  </Modal>;
}
