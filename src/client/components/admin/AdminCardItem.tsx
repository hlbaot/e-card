"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { QRCodeCanvas } from "qrcode.react";
import { Eye, QrCode, Download, Pencil } from "lucide-react";
import type { Employee } from "@/shared/types/employee";
import { CardListContent } from "@/client/components/card/CardListItem";
import { QRPanel } from "@/client/components/card/QRPanel";
import { CopyButton } from "@/client/components/ui/CopyButton";
import { Modal } from "@/client/components/ui/Modal";
import { useToast } from "@/client/components/ui/Toast";
import { cardUrl, downloadQR } from "@/shared/utils/qr";
import { routes } from "@/shared/constants/routes";

export function AdminCardItem({ employee: e }: { employee: Employee }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLCanvasElement>(null);
  const toast = useToast();
  const url = cardUrl(e.slug);

  return (
    <article className="admin-card-item relative">
      {/* Nút Cập nhật (icon cây bút + chữ Cập nhật) ở góc trên phải nhảy thẳng qua trang chỉnh sửa danh thiếp */}
      <Link
        href={routes.employee(e.id)}
        className="admin-card-edit-btn"
        title={`Cập nhật danh thiếp của ${e.fullName}`}
        aria-label={`Cập nhật danh thiếp của ${e.fullName}`}
      >
        <Pencil size={12} />
        <span>Cập nhật</span>
      </Link>

      <Link
        className="employee-card"
        href={`/card/${e.slug}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <CardListContent employee={e} showFooter={false} />
      </Link>

      <div className="admin-card-controls">
        <div className="flex items-center justify-between gap-2">
          <span className={`status ${e.isActive ? "" : "off"}`}>
            {e.isActive
              ? "Danh thiếp đang bật"
              : "Danh thiếp đã tắt · không công khai"}
          </span>
        </div>
        <div className="admin-card-link">{url}</div>
        <div className="button-row">
          <CopyButton value={url} label="Sao chép" />
          <Link
            className="btn btn-secondary"
            href={`/card/${e.slug}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Eye size={13} />
            Xem hồ sơ
          </Link>
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => setOpen(true)}
          >
            <QrCode size={13} />
            Xem QR
          </button>
        </div>
        <button
          className="btn btn-ghost"
          type="button"
          onClick={() => {
            downloadQR(ref.current, e.slug);
            toast("Đã tải mã QR PNG");
          }}
        >
          <Download size={14} />
          Tải QR (PNG)
        </button>
      </div>
      <div className="admin-card-qr" aria-hidden="true">
        <QRCodeCanvas
          ref={ref}
          value={url}
          size={512}
          level="H"
          marginSize={4}
        />
      </div>
      {open && (
        <Modal title={`Mã QR · ${e.fullName}`} onClose={() => setOpen(false)}>
          <QRPanel slug={e.slug} />
        </Modal>
      )}
    </article>
  );
}
