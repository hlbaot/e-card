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
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/client/hooks/useAuth";
import { useToast } from "@/client/components/ui/Toast";
import { Alert } from "@/client/components/ui/Alert";
import { authApi } from "@/api/auth.api";
import { Skeleton } from "@/client/components/ui/Skeleton";
import { PasswordMatchMeter } from "@/client/components/auth/PasswordMatchMeter";
import { translateErrorMessage } from "@/i18n/error-map";

export function AdminProfileView() {
  const { ready, user } = useAuth();
  const toast = useToast();
  const t = useTranslations("admin.profile");
  const tAuth = useTranslations("auth.login");
  const tValidation = useTranslations("validation");
  const tToast = useTranslations("toast");
  const tRoot = useTranslations();

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
      setError(tValidation("currentPasswordRequired"));
      return;
    }
    if (newPassword.length < 8) {
      setError(tValidation("newPasswordMinLength"));
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(tValidation("passwordMismatch"));
      return;
    }
    if (currentPassword === newPassword) {
      setError(tValidation("passwordUnchanged"));
      return;
    }

    setLoading(true);
    try {
      await authApi.changePassword(currentPassword, newPassword);
      setSuccess(tToast("passwordChanged"));
      toast(tToast("passwordChanged"));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const msg = translateErrorMessage(err, tRoot, "toast.passwordChangeError");
      setError(msg);
      toast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-fade-in mx-auto w-full max-w-[1000px] space-y-6">
      <div className="page-heading">
        <div>
          <div className="eyebrow mb-2">QTM MEDIATECH PLATFORM</div>
          <h1>
            {t("titlePrefix")} <span className="qtm-gradient-text">{t("titleHighlight")}</span>
          </h1>
          <p>{t("subtitle")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Panel Thông tin tài khoản */}
        <section className="panel md:col-span-5">
          <div className="panel-heading mb-4 flex items-center gap-2 border-b border-white/10 pb-3">
            <ShieldCheck size={20} className="text-[#22D3EE]" />
            <h2 className="text-base font-semibold text-white">{t("accountInfoTitle")}</h2>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3 rounded-lg bg-white/[0.03] p-3.5 border border-white/5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#0F4C75] to-[#22D3EE] font-bold text-white shadow-md">
                <User size={22} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-white">{t("adminName")}</div>
                <div className="truncate text-xs text-slate-400">{user?.email}</div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-start justify-between gap-2 border-b border-white/5 pb-2.5">
                <span className="flex items-center gap-2 text-slate-400">
                  <Mail size={15} /> {t("emailLabel")}
                </span>
                <span className="font-mono text-xs text-white">{user?.email || "—"}</span>
              </div>

              <div className="flex items-start justify-between gap-2 border-b border-white/5 pb-2.5">
                <span className="flex items-center gap-2 text-slate-400">
                  <ShieldCheck size={15} /> {t("roleLabel")}
                </span>
                <span className="inline-flex items-center rounded-md bg-[#22D3EE]/10 px-2 py-0.5 text-xs font-medium text-[#22D3EE]">
                  {t("roleValue")}
                </span>
              </div>

              <div className="flex items-start justify-between gap-2 border-b border-white/5 pb-2.5">
                <span className="flex items-center gap-2 text-slate-400">
                  <Lock size={15} /> {t("statusLabel")}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  {t("statusActive")}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Panel Đổi mật khẩu */}
        <section className="panel md:col-span-7">
          <div className="panel-heading mb-4 flex items-center gap-2 border-b border-white/10 pb-3">
            <KeyRound size={20} className="text-[#22D3EE]" />
            <h2 className="text-base font-semibold text-white">{t("changePasswordTitle")}</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {error && (
              <Alert variant="error" onClose={() => setError("")}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert variant="success" onClose={() => setSuccess("")}>
                {success}
              </Alert>
            )}

            <div className="field">
              <label htmlFor="currentPassword">{t("currentPasswordLabel")}</label>
              <div className="relative">
                <input
                  id="currentPassword"
                  type={showCurrent ? "text" : "password"}
                  placeholder={t("currentPasswordPlaceholder")}
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
                  aria-label={showCurrent ? tAuth("hidePasswordAria") : tAuth("showPasswordAria")}
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="field">
              <label htmlFor="newPassword">{t("newPasswordLabel")}</label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showNew ? "text" : "password"}
                  placeholder={t("newPasswordPlaceholder")}
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
                  aria-label={showNew ? tAuth("hidePasswordAria") : tAuth("showPasswordAria")}
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="field">
              <label htmlFor="confirmPassword">{t("confirmPasswordLabel")}</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder={t("confirmPasswordPlaceholder")}
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
                  aria-label={showConfirm ? tAuth("hidePasswordAria") : tAuth("showPasswordAria")}
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
                {loading ? t("submitting") : t("submitButton")}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
