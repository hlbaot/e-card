"use client";
import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Download, ShieldCheck } from "lucide-react";
import { cardUrl, downloadQR } from "@/shared/utils/qr";
import { CopyButton } from "@/client/components/ui/CopyButton";
import { useToast } from "@/client/components/ui/Toast";
export function QRPanel({ slug }: { slug: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const url = cardUrl(slug);
  const toast = useToast();
  return (
    <div className="qr-panel">
      <div className="qr-code">
        <QRCodeCanvas
          ref={ref}
          value={url}
          size={512}
          level="H"
          marginSize={4}
          title={`Mã QR hồ sơ ${slug}`}
        />
      </div>
      <h3>Kết nối chỉ với một lần quét</h3>
      <p>Quét mã để mở trang hồ sơ cá nhân và lưu thông tin liên hệ.</p>
      <a
        className="qr-link"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {url}
      </a>
      <div className="button-row">
        <CopyButton value={url} />
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            downloadQR(ref.current, slug);
            toast("Đã tải mã QR PNG");
          }}
        >
          <Download size={16} />
          Tải QR (PNG)
        </button>
      </div>
      <small>
        <ShieldCheck size={14} />
        Liên kết cố định, thông tin luôn cập nhật
      </small>
    </div>
  );
}
