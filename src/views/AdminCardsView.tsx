"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, Plus, ContactRound, ArrowRight } from "lucide-react";
import { useEmployees } from "@/client/hooks/useEmployees";
import { useAos } from "@/client/hooks/useAos";
import { AdminCardItem } from "@/client/components/admin/AdminCardItem";
import { Skeleton } from "@/client/components/ui/Skeleton";
import { slugify } from "@/shared/utils/slugify";

export function AdminCardsView() {
  const { employees, ready } = useEmployees();
  useAos(ready);
  const [search, setSearch] = useState("");
  const filtered = employees.filter((e) =>
    slugify(`${e.fullName} ${e.position}`).includes(slugify(search)),
  );
  return (
    <>
      <div className="page-heading" data-aos="fade-up" data-aos-delay="50">
        <div>
          <div className="eyebrow mb-2">QTM MEDIATECH PLATFORM</div>
          <h1>
            Danh thiếp <span className="qtm-gradient-text">số</span>
          </h1>
          <p>
            Một liên kết, mọi kết nối. Quản lý và chia sẻ danh thiếp của đội
            ngũ.
          </p>
        </div>
        <Link className="btn btn-primary group" href="/admin/employees/new">
          <Plus size={16} />
          Tạo danh thiếp
          <ArrowRight
            size={15}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      </div>
      <div className="section-heading" data-aos="fade-up" data-aos-delay="100">
        <div className="section-title">
          <ContactRound size={18} className="text-[#22D3EE]" />
          <span className="muted">Tất cả danh thiếp</span>
          <span className="count-badge">{ready ? employees.length : "…"}</span>
        </div>
        <label className="search-box">
          <Search size={16} />
          <input
            placeholder="Tìm tên hoặc chức vụ…"
            aria-label="Tìm danh thiếp"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      </div>
      {!ready ? (
        <Skeleton />
      ) : (
        <div className="employee-grid">
          {filtered.map((e, idx) => (
            <div
              key={e.id}
              data-aos="fade-up"
              data-aos-delay={String(Math.min(100 + idx * 50, 400))}
            >
              <AdminCardItem employee={e} />
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="empty">
              <h3>Chưa có danh thiếp phù hợp</h3>
              <p>Thử từ khóa khác hoặc thêm nhân viên mới.</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
