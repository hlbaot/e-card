"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";
import { restoreSession, useAuth } from "@/client/hooks/useAuth";
import { useAos } from "@/client/hooks/useAos";
import { Brand } from "@/client/components/layout/PublicHeader";
import { Badge } from "@/client/components/ui/Badge";
import { Alert } from "@/client/components/ui/Alert";
import { useToast } from "@/client/components/ui/Toast";
import { Spinner } from "@/client/components/ui/Spinner";
import { LoadingOverlay } from "@/client/components/ui/LoadingOverlay";
import { LanguageSwitcher } from "@/client/components/ui/LanguageSwitcher";
import { HeroArt } from "@/client/components/layout/HeroArt";
import { translateErrorMessage } from "@/i18n/error-map";

export function LoginView() {
  const { login, authenticated } = useAuth();
  const tRoot = useTranslations();
  const t = useTranslations("auth.login");
  const tToast = useTranslations("toast");
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
      if (active) setError(t("sessionCheckFailed"));
    }).finally(() => {
      if (active) setCheckingSession(false);
    });
    return () => { active = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps -- Run session verification once on mount so re-renders do not cancel it.
  }, []);

  useEffect(() => {
    if (sessionVerified && authenticated) window.location.replace("/admin");
  }, [sessionVerified, authenticated]);

  return (
    <main className="login-page">
      <LoadingOverlay show={busy} label={t("submitting")} />
      <section className="login-story">
        <Brand />
        <div data-aos="fade-right" data-aos-delay="100">
          <Badge>{t("storyBadge")}</Badge>
          <h1>
            {t("storyTitleLine1")}
            <br />
            <span className="qtm-gradient-text">{t("storyTitleHighlight")}</span>
          </h1>
          <p>
            {t("storyDescription")}
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
              setError(t("missingCredentials"));
              return;
            }
            setBusy(true);
            try {
              await login(email, password);
              toast(tToast("loginSuccess"));
              setSessionVerified(true);
            } catch (err) {
              setError(translateErrorMessage(err, tRoot, "errors.loginFailed"));
            } finally {
              setBusy(false);
            }
          }}
        >
          <div className="mb-4 flex items-center justify-between gap-2">
            <Link href="/" prefetch={true} className="login-back !mb-0">
              <ArrowLeft size={14} />
              {t("backPublic")}
            </Link>
            <LanguageSwitcher />
          </div>
          <h2>
            {t("titlePrefix")} <span className="qtm-gradient-text">{t("titleHighlight")}</span>
          </h2>
          <p>{t("subtitle")}</p>
          <div className="field">
            <label htmlFor="email">{t("emailLabel")}</label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              placeholder={t("emailPlaceholder")}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">{t("passwordLabel")}</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder={t("passwordPlaceholder")}
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
                aria-label={showPassword ? t("hidePassword") : t("showPassword")}
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
            {busy ? t("submitting") : checkingSession ? t("checkingSession") : t("submit")}
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
