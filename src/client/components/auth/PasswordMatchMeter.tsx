"use client";

import { CheckCircle, AlertCircle, KeyRound } from "lucide-react";
import { useTranslations } from "next-intl";
import styles from "./PasswordMatchMeter.module.css";

export function PasswordMatchMeter({ password, confirmation }: { password: string; confirmation: string }) {
  const t = useTranslations("auth.passwordMeter");
  const expected = Array.from(password);
  const entered = Array.from(confirmation);
  const matched = entered.filter((character, index) => character === expected[index]).length;
  const complete = password.length > 0 && password === confirmation;
  const hasMismatch = entered.some((character, index) => character !== expected[index]);
  const percent = expected.length ? Math.round(matched / Math.max(expected.length, entered.length) * 100) : 0;
  const visible = password.length > 0 && confirmation.length > 0;
  const state = complete ? "complete" : hasMismatch ? "mismatch" : "typing";
  const label = complete ? t("matched") : hasMismatch ? t("mismatch") : t("typingSimple");
  const Icon = complete ? CheckCircle : hasMismatch ? AlertCircle : KeyRound;

  return (
    <div id="password-match" className={styles.meter} data-visible={visible} data-state={state}>
      <div className={styles.heading}>
        <span className={styles.label}>{t("headingLabel")}</span>
        <span className={styles.percent}>{complete ? 100 : Math.min(percent, 99)}%</span>
      </div>
      <div
        className={styles.track}
        role="progressbar"
        aria-label={t("ariaLabel")}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={complete ? 100 : Math.min(percent, 99)}
        aria-hidden={!visible}
      >
        <div className={styles.fill} style={{ width: `${complete ? 100 : Math.min(percent, 99)}%` }} />
      </div>
      <div className={styles.feedback} role="status" aria-live="polite" aria-atomic="true">
        {visible && <><Icon key={state} size={15} className={styles.icon} aria-hidden="true" /><span>{label}</span></>}
      </div>
    </div>
  );
}
