import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Brand } from "@/client/components/layout/PublicHeader";

export function NotFoundView() {
  const t = useTranslations("errors.notFoundPage");
  const tCommon = useTranslations("common");
  return (
    <div className="not-found-page">
      <header className="not-found-header">
        <Brand />
        <Link href="/" className="not-found-home">
          {tCommon("home")} <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </header>
      <main className="not-found" aria-labelledby="not-found-title">
        <section className="not-found-panel">
          <div className="not-found-code" aria-hidden="true">404</div>
          <span className="not-found-eyebrow">{t("eyebrow")}</span>
          <h1 id="not-found-title">{t("title")}</h1>
          <p>{t("description")}</p>
          <Link href="/" className="btn btn-primary">
            <ArrowLeft size={16} aria-hidden="true" />
            {tCommon("backHome")}
          </Link>
          <div className="not-found-note">{t("note")}</div>
        </section>
      </main>
      <footer className="not-found-footer">{t("footer")}</footer>
    </div>
  );
}
