"use client";

import { useState, useDeferredValue } from "react";
import Link from "next/link";
import {
  Search,
  Users,
  ArrowRight,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { PublicHeader } from "@/client/components/layout/PublicHeader";
import { PublicFooter } from "@/client/components/layout/PublicFooter";
import type { Employee } from "@/shared/types";
import { useAos } from "@/client/hooks/useAos";
import { HomeSessionRedirect } from "@/client/components/auth/HomeSessionRedirect";
import { CardListItem } from "@/client/components/card/CardListItem";
import { Skeleton } from "@/client/components/ui/Skeleton";
import { Badge } from "@/client/components/ui/Badge";
import { HeroArt } from "@/client/components/layout/HeroArt";
import { slugify } from "@/shared/utils/slugify";
import { routes } from "@/shared/constants/routes";
import { siteConfig } from "@/config/site";
import { cn } from "@/shared/utils/cn";

export function HomeView({ employees }: { employees: Employee[] }) {
  const ready = true;
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [activeFilter, setActiveFilter] = useState("all");
  const tHero = useTranslations("home.hero");
  const tDir = useTranslations("home.directory");
  const tCommon = useTranslations("common");
  useAos(ready, `${deferredSearch}:${activeFilter}`);

  const active = employees.filter((e) => e.isActive);
  const departments = Array.from(
    new Set(active.map((e) => e.position).filter(Boolean)),
  ).slice(0, 4);

  const filtered = active.filter((e) => {
    const matchesSearch = slugify(`${e.fullName} ${e.position}`).includes(
      slugify(deferredSearch),
    );
    const matchesTab = activeFilter === "all" || e.position === activeFilter;
    return matchesSearch && matchesTab;
  });


  return (
    <>
      <HomeSessionRedirect />
      <PublicHeader />
      <main>
        <section className="hero">
          <div className="container hero-inner">
            <div data-aos="fade-up" data-aos-delay="50">
              <Badge>
                {tHero("badge")}
              </Badge>
              <h1>
                {tHero("title")}
                <br />
                <span className="qtm-gradient-text hero-tagline">
                  <span>{tHero("taglinePart1")}</span>{" "}
                  <span>{tHero("taglinePart2")}</span>
                </span>
              </h1>
              <div className="qtm-hero-box">
                <span className="qtm-hero-box-tag">
                  ● {tHero("boxTag")}
                </span>
                <p className="hero-description">
                  {tHero("descriptionPrefix")}{" "}
                  <strong className="text-[#22D3EE]">
                    {tHero("descriptionHighlight")}
                  </strong>{" "}
                  {tHero("descriptionSuffix")}
                </p>
              </div>
              <div className="qtm-motto-pill">
                QUALITY <span>•</span> TECHNOLOGY <span>•</span> MINDSET
              </div>
              <div className="button-row mt-6">
                <Link
                  href={routes.login}
                  prefetch={true}
                  className="btn btn-primary group"
                >
                  {tHero("loginCta")}
                  <ArrowRight
                    size={15}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>
            <div data-aos="zoom-in" data-aos-delay="150">
              <HeroArt />
            </div>
          </div>

        </section>

        {siteConfig.listCardsOnHome && (
          <section id="directory" className="directory container">
            <div
              className="qtm-directory-header"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="eyebrow justify-center">
                {tDir("eyebrow")}
              </div>
              <h2 className="qtm-directory-title">
                {tDir("titlePrefix")}{" "}
                <span className="qtm-gradient-text">{tDir("titleHighlight")}</span>
              </h2>
              <p className="qtm-directory-subtitle">
                {tDir("subtitle")}
              </p>

              <label className="search-box qtm-search-centered">
                <Search size={17} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={tDir("searchPlaceholder")}
                  aria-label={tDir("searchAria")}
                />
              </label>

              <div className="qtm-filter-pills">
                <button
                  type="button"
                  onClick={() => setActiveFilter("all")}
                  className={cn(
                    "qtm-filter-pill",
                    activeFilter === "all" && "active",
                  )}
                >
                  <span>{tCommon("all")}</span>
                  <span className="qtm-pill-count">{active.length}</span>
                </button>
                {departments.map((pos) => {
                  const count = active.filter((e) => e.position === pos).length;
                  return (
                    <button
                      key={pos}
                      type="button"
                      onClick={() => setActiveFilter(pos)}
                      className={cn(
                        "qtm-filter-pill",
                        activeFilter === pos && "active",
                      )}
                    >
                      <span>{pos}</span>
                      <span className="qtm-pill-count">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {!ready ? (
              <Skeleton />
            ) : (
              <div className="employee-grid">
                {filtered.map((e, idx) => (
                  <div
                    key={e.id}
                    data-aos="fade-up"
                    data-aos-delay={String(Math.min(50 + idx * 50, 400))}
                  >
                    <CardListItem employee={e} />
                  </div>
                ))}
                {filtered.length === 0 && (
                  <div className="empty">
                    <Users size={28} className="mx-auto text-[#22D3EE]" />
                    <h3>{tDir("emptyTitle")}</h3>
                    <p>{tDir("emptySubtitle")}</p>
                  </div>
                )}
              </div>
            )}
          </section>
        )}
      </main>
      <PublicFooter />
    </>
  );
}
