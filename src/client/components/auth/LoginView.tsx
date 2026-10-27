"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";
import { restoreSession, useAuth } from "@/client/hooks/useAuth";
import { useAos } from "@/client/hooks/useAos";
import { Brand } from "@/client/components/layout/PublicHeader";
import { Badge } from "@/client/components/ui/Badge";
import { Alert } from "@/client/components/ui/Alert";
import { useToast } from "@/client/components/ui/Toast";
import { Spinner } from "@/client/components/ui/Spinner";
import { LoadingOverlay } from "@/client/components/ui/LoadingOverlay";
import { HeroArt } from "@/client/components/layout/HeroArt";


export function LoginView() {
  const { login, authenticated } = useAuth();
  useAos(true);
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const [checkingSession, setCheckingSession] = useState(true);
  const [sessionVerified, setSessionVerified] = useState(false);

  useEffect(() => {
    let active = true;
    void restoreSession().then(() => {
      if (active) setSessionVerified(true);
    }).catch(() => {
      if (active) setError("Không thể kiểm tra phiên. Bạn có thể thử đăng nhập lại.");
    }).finally(() => {
      if (active) setCheckingSession(false);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    // Verify current cookies before trusting a previously authenticated store.
    if (sessionVerified && authenticated) window.location.replace("/admin");
  }, [sessionVerified, authenticated]);

  return (
    <main className="login-page">
      <LoadingOverlay show={busy} label="Đang đăng nhập…" />
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
              toast("Đăng nhập thành công!");
              setSessionVerified(true);
            } catch (err) {
              setError(
                err instanceof Error ? err.message : "Đăng nhập không thành công. Vui lòng thử lại.",
              );
            } finally {
              setBusy(false);
            }
          }}
        >
          <Link href="/" prefetch={true} className="login-back">
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
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">Mật khẩu</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                required
                className="!pr-11"
              />
              <button
                type="button"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer p-1 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-400 flex items-center justify-center"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff size={18} aria-hidden="true" />
                ) : (
                  <Eye size={18} aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
          {error && (
            <Alert
              variant="error"
              className="mb-4"
              onClose={() => setError("")}
            >
              {error}
            </Alert>
          )}
          <button disabled={busy || checkingSession} className="btn btn-primary group">
            {busy ? "Đang đăng nhập…" : checkingSession ? "Đang kiểm tra phiên…" : "Đăng nhập"}
            {busy || checkingSession ? (
              <Spinner />
            ) : (
              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
