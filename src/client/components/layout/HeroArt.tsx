import { QrCode, CheckCircle2 } from "lucide-react";
import { Avatar } from "@/client/components/ui/Avatar";
export function HeroArt() {
  return (
    <div className="hero-art" aria-hidden="true">
      <div className="orbit" />
      <div className="mini-card">
        <span className="mini-logo">QTM</span>
        <Avatar name="Nam Anh" src="" size={57} />
        <div className="mini-line" />
        <div className="mini-line short" />
        <div className="mini-actions">
          <i />
          <i />
          <i />
        </div>
      </div>
      <div className="floating-badge badge-connect">
        <CheckCircle2 size={23} />
        <span>
          Kết nối dễ dàng
          <br />
          <strong>Ấn tượng dài lâu</strong>
        </span>
      </div>
      <div className="floating-badge badge-qr">
        <QrCode size={38} />
        <span>
          Một lần quét.
          <br />
          <strong>Mọi kết nối.</strong>
        </span>
      </div>
    </div>
  );
}
