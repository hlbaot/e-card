import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Brand } from "@/client/components/layout/PublicHeader";

export function NotFoundView() {
  return (
    <div className="not-found-page">
      <header className="not-found-header">
        <Brand />
        <Link href="/" className="not-found-home">Trang chủ <ArrowUpRight size={16} aria-hidden="true" /></Link>
      </header>
      <main className="not-found" aria-labelledby="not-found-title">
        <section className="not-found-panel">
          <div className="not-found-code" aria-hidden="true">404</div>
          <span className="not-found-eyebrow">ĐƯỜNG DẪN KHÔNG KHẢ DỤNG</span>
          <h1 id="not-found-title">Có vẻ bạn đã đi lạc.</h1>
          <p>Trang bạn tìm không tồn tại, đã được di chuyển hoặc danh thiếp hiện không còn công khai.</p>
          <Link href="/" className="btn btn-primary">
            <ArrowLeft size={16} aria-hidden="true" />
            Về trang chủ
          </Link>
          <div className="not-found-note">Khám phá đội ngũ QTM và tiếp tục kết nối.</div>
        </section>
      </main>
      <footer className="not-found-footer">E-card · Kết nối không giới hạn</footer>
    </div>
  );
}
