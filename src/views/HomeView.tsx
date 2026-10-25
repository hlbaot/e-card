"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  Search,
  Users,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { PublicHeader } from "@/client/components/layout/PublicHeader";
import { PublicFooter } from "@/client/components/layout/PublicFooter";
import type { Employee } from "@/shared/types/employee";
import { useAos } from "@/client/hooks/useAos";
import { useAuth } from "@/client/hooks/useAuth";
import { CardListItem } from "@/client/components/card/CardListItem";
import { Skeleton } from "@/client/components/ui/Skeleton";
import { Badge } from "@/client/components/ui/Badge";
import { StatBar } from "@/client/components/ui/StatBar";
import { HeroArt } from "@/client/components/layout/HeroArt";
import { slugify } from "@/shared/utils/slugify";
import { routes } from "@/shared/constants/routes";
import { siteConfig } from "@/config/site";
import { cn } from "@/shared/utils/cn";

const emptySubscribe = () => () => {};

export function HomeView({ employees }: { employees: Employee[] }) {
  const ready = true;
  useAos(ready);
  const { ready: authReady, authenticated } = useAuth();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const isLoggedIn = mounted && authReady && authenticated;

  const active = employees.filter((e) => e.isActive);
  const departments = Array.from(
    new Set(active.map((e) => e.position).filter(Boolean)),
  ).slice(0, 4);

  const filtered = active.filter((e) => {
    const matchesSearch = slugify(`${e.fullName} ${e.position}`).includes(
      slugify(search),
    );
    const matchesTab = activeFilter === "all" || e.position === activeFilter;
    return matchesSearch && matchesTab;
  });

  const stats = [{
    value: String(active.length),
    label: "Danh thiếp số hoạt động",
    icon: Sparkles,
  }];

  return (
    <>
      <PublicHeader />
      <main>
        <section className="hero">
          <div className="container hero-inner">
            <div data-aos="fade-up" data-aos-delay="50">
              <Badge>
                QTM COMMUNICATION TECHNOLOGY · TINH GỌN · LINH HOẠT · HIỆU QUẢ
              </Badge>
              <h1>
                MediaTech Partner
                <br />
                <span className="qtm-gradient-text">
                  Kết nối con người. Lan tỏa giá trị.
                </span>
              </h1>
              <div className="qtm-hero-box">
                <span className="qtm-hero-box-tag">
                  ● ĐỒNG HÀNH CÙNG TRUYỀN THÔNG SỐ &amp; AI
                </span>
                <p className="hero-description">
                  Đồng hành cùng doanh nghiệp chuyển hóa{" "}
                  <strong className="text-[#22D3EE]">
                    CHIẾN LƯỢC – CÔNG NGHỆ – SÁNG TẠO – DỮ LIỆU
                  </strong>{" "}
                  thành những điểm chạm kết nối chuyên nghiệp qua danh thiếp
                  điện tử E-card.
                </p>
              </div>
              <div className="qtm-motto-pill">
                QUALITY <span>•</span> TECHNOLOGY <span>•</span> MINDSET
              </div>
              <div className="button-row mt-6">
                <Link
                  href={isLoggedIn ? routes.admin : routes.login}
                  className="btn btn-primary group"
                >
                  {isLoggedIn ? "VÀO TRANG QUẢN TRỊ" : "ĐĂNG NHẬP"}
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

          <div
            className="container pb-12"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <StatBar items={stats} />
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
                QTM MEDIATECH PLATFORM
              </div>
              <h2 className="qtm-directory-title">
                HỒ SƠ &amp;{" "}
                <span className="qtm-gradient-text">DANH THIẾP SỐ QTM</span>
              </h2>
              <p className="qtm-directory-subtitle">
                Khám phá hồ sơ nhân sự QTM MediaTech, quét mã QR hoặc lưu danh
                bạ vCard trực tiếp chỉ với một chạm.
              </p>

              <label className="search-box qtm-search-centered">
                <Search size={17} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm kiếm thành viên theo họ tên hoặc chức vụ…"
                  aria-label="Tìm kiếm tên hoặc chức vụ"
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
                  <span>Tất cả</span>
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
                    <h3>Chưa tìm thấy thành viên</h3>
                    <p>Thử tìm kiếm với tên hoặc chức vụ khác.</p>
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
