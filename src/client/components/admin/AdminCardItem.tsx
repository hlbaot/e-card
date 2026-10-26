"use client";
import { memo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Eye, QrCode, Download, Pencil } from "lucide-react";
import type { Employee } from "@/shared/types";
import { CardListContent } from "@/client/components/card/CardListItem";
import { CopyButton } from "@/client/components/ui/CopyButton";
import { Modal } from "@/client/components/ui/Modal";
import { useToast } from "@/client/components/ui/Toast";
import { cardUrl, downloadQrBySlug } from "@/shared/utils/qr";
import { routes } from "@/shared/constants/routes";

const QRPanel = dynamic(
  () => import("@/client/components/card/QRPanel").then((m) => m.QRPanel),
  { ssr: false },
);

export const AdminCardItem = memo(function AdminCardItem({
  employee: e,
}: {
  employee: Employee;
}) {
  const [open, setOpen] = useState(false);
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
        prefetch={false}
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
            prefetch={false}
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
          onClick={async () => {
            try {
              await downloadQrBySlug(e.slug, url);
              toast("Đã tải mã QR PNG");
            } catch {
              toast("Không thể tạo mã QR", "error");
            }
          }}
        >
          <Download size={14} />
          Tải QR (PNG)
        </button>
      </div>
      {open && (
        <Modal title={`Mã QR · ${e.fullName}`} onClose={() => setOpen(false)}>
          <QRPanel slug={e.slug} />
        </Modal>
      )}
    </article>
  );
});
