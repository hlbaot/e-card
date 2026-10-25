"use client";

import { useState } from "react";
import {
  ShieldCheck,
  KeyRound,
  Mail,
  User,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/client/hooks/useAuth";
import { useAos } from "@/client/hooks/useAos";
import { useToast } from "@/client/components/ui/Toast";
import { authApi } from "@/api/auth.api";
import { Skeleton } from "@/client/components/ui/Skeleton";
import { PasswordMatchMeter } from "@/client/components/auth/PasswordMatchMeter";

export function AdminProfileView() {
  const { ready, user } = useAuth();
  useAos(ready);
  const toast = useToast();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!ready) return <Skeleton />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!currentPassword) {
      setError("Vui lòng nhập mật khẩu hiện tại.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Mật khẩu mới phải có ít nhất 8 ký tự.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (currentPassword === newPassword) {
      setError("Mật khẩu mới không được trùng với mật khẩu hiện tại.");
      return;
    }

    setLoading(true);
    try {
      await authApi.changePassword(currentPassword, newPassword);
      setSuccess("Đổi mật khẩu thành công. Vui lòng đăng nhập lại.");
      toast("Đổi mật khẩu thành công. Vui lòng đăng nhập lại.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể đổi mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1000px] space-y-6">
      <div className="page-heading" data-aos="fade-up" data-aos-delay="50">
        <div>
          <div className="eyebrow mb-2">QTM MEDIATECH PLATFORM</div>
          <h1>
            Hồ sơ &amp; <span className="qtm-gradient-text">Bảo mật</span>
          </h1>
          <p>Xem thông tin tài khoản quản trị và cập nhật mật khẩu đăng nhập.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12" data-aos="fade-up" data-aos-delay="100">
        {/* Panel Thông tin tài khoản */}
        <section className="panel md:col-span-5">
          <div className="panel-heading mb-4 flex items-center gap-2 border-b border-white/10 pb-3">
            <ShieldCheck size={20} className="text-[#22D3EE]" />
            <h2 className="text-base font-semibold text-white">Thông tin quản trị viên</h2>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3 rounded-lg bg-white/[0.03] p-3.5 border border-white/5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#0F4C75] to-[#22D3EE] font-bold text-white shadow-md">
                <User size={22} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-white">Quản trị viên QTM</div>
                <div className="truncate text-xs text-slate-400">{user?.email}</div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-start justify-between gap-2 border-b border-white/5 pb-2.5">
                <span className="flex items-center gap-2 text-slate-400">
                  <Mail size={15} /> Thư điện tử:
                </span>
                <span className="font-mono text-xs text-white">{user?.email || "—"}</span>
              </div>

              <div className="flex items-start justify-between gap-2 border-b border-white/5 pb-2.5">
                <span className="flex items-center gap-2 text-slate-400">
                  <ShieldCheck size={15} /> Vai trò:
                </span>
                <span className="inline-flex items-center rounded-md bg-[#22D3EE]/10 px-2 py-0.5 text-xs font-medium text-[#22D3EE]">
                  Super Admin
                </span>
              </div>

              <div className="flex items-start justify-between gap-2 border-b border-white/5 pb-2.5">
                <span className="flex items-center gap-2 text-slate-400">
                  <Lock size={15} /> Trạng thái:
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Đang hoạt động
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Panel Đổi mật khẩu */}
        <section className="panel md:col-span-7">
          <div className="panel-heading mb-4 flex items-center gap-2 border-b border-white/10 pb-3">
            <KeyRound size={20} className="text-[#22D3EE]" />
            <h2 className="text-base font-semibold text-white">Thay đổi mật khẩu</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {error && (
              <div role="alert" className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div role="status" className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-400">
                <CheckCircle size={16} className="shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <div className="field">
              <label htmlFor="currentPassword">Mật khẩu hiện tại</label>
              <div className="relative">
                <input
                  id="currentPassword"
                  type={showCurrent ? "text" : "password"}
                  placeholder="Nhập mật khẩu hiện tại"
                  value={currentPassword}
                  onChange={(e) => { setCurrentPassword(e.target.value); setError(""); setSuccess(""); }}
                  autoComplete="current-password"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  onClick={() => setShowCurrent(!showCurrent)}
                  aria-label={showCurrent ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="field">
              <label htmlFor="newPassword">Mật khẩu mới (tối thiểu 8 ký tự)</label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showNew ? "text" : "password"}
                  placeholder="Nhập mật khẩu mới"
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setError(""); setSuccess(""); }}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  className="pr-10"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  onClick={() => setShowNew(!showNew)}
                  aria-label={showNew ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="field">
              <label htmlFor="confirmPassword">Nhập lại mật khẩu mới</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Xác nhận mật khẩu mới"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(""); setSuccess(""); }}
                  autoComplete="new-password"
                  aria-describedby="password-match"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  onClick={() => setShowConfirm(!showConfirm)}
                  aria-label={showConfirm ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <PasswordMatchMeter password={newPassword} confirmation={confirmPassword} />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full justify-center md:w-auto"
              >
                {loading ? "Đang xử lý…" : "Cập nhật mật khẩu"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
