"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useAuth } from "@/client/hooks/useAuth";
import { useAos } from "@/client/hooks/useAos";
import { Brand } from "@/client/components/layout/PublicHeader";
import { Badge } from "@/client/components/ui/Badge";
import { HeroArt } from "@/client/components/layout/HeroArt";

export function LoginView() {
  const { login, ready, authenticated } = useAuth();
  useAos(true);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (ready && authenticated) router.replace("/admin");
  }, [ready, authenticated, router]);

  return (
    <main className="login-page">
      <section className="login-story">
        <Brand />
        <div data-aos="fade-right" data-aos-delay="100">
          <Badge>MỖI KẾT NỐI · MỘT CƠ HỘI TĂNG TRƯỞNG</Badge>
          <h1>
            Danh thiếp nhỏ.
            <br />
            <span className="qtm-gradient-text">Giá trị lớn.</span>
          </h1>
          <p>
            Mang bản sắc doanh nghiệp Công nghệ Truyền thông vào từng kết nối
            với nền tảng danh thiếp số của QTM MediaTech.
          </p>
          <HeroArt />
        </div>
        <small>QUALITY · TECHNOLOGY · MINDSET</small>
      </section>
      <div className="login-form-wrap">
        <form
          data-aos="fade-left"
          data-aos-delay="150"
          className="login-form"
          noValidate
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");
            if (!email.trim() || !password) {
              setError("Vui lòng nhập email và mật khẩu.");
              return;
            }
            setBusy(true);
            try {
              await login(email, password);
            } catch (err) {
              setError(
                err instanceof Error ? err.message : "Đăng nhập không thành công. Vui lòng thử lại.",
              );
            } finally {
              setBusy(false);
            }
          }}
        >
          <Link href="/" className="login-back">
            <ArrowLeft size={14} />
            Về trang công khai
          </Link>
          <h2>
            Chào mừng <span className="qtm-gradient-text">trở lại</span>
          </h2>
          <p>Đăng nhập để quản lý đội ngũ và danh thiếp số E-card.</p>
          <div className="field">
            <label htmlFor="email">Thư điện tử quản trị</label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              placeholder="Nhập địa chỉ thư điện tử"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">Mật khẩu</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <div role="alert" className="login-error">
              {error}
            </div>
          )}
          <button disabled={busy || !ready} className="btn btn-primary group">
            {busy ? "Đang đăng nhập…" : "Đăng nhập"}
            <ArrowRight
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </button>
        </form>
      </div>
    </main>
  );
}
