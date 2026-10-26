"use client";
import { useEmployeeStore } from "@/client/store/employee.store";
import Link from "next/link";
import { Plus, Search, ArrowRight } from "lucide-react";
import { useEmployees } from "@/client/hooks/useEmployees";
import { useAos } from "@/client/hooks/useAos";
import { EmployeeTable } from "@/client/components/admin/EmployeeTable";
import { Skeleton } from "@/client/components/ui/Skeleton";
import { slugify } from "@/shared/utils/slugify";

export function AdminEmployeesView() {
  const { employees, ready, error } = useEmployees();
  useAos(ready);
  const search = useEmployeeStore(state => state.employeeSearch);
  const setSearch = useEmployeeStore(state => state.setEmployeeSearch);
  const filtered = employees.filter((e) =>
    slugify(`${e.fullName} ${e.position} ${e.email}`).includes(slugify(search)),
  );
  return (
    <>
      <div className="page-heading" data-aos="fade-up" data-aos-delay="50">
        <div>
          <div className="eyebrow mb-2">QTM MEDIATECH PLATFORM</div>
          <h1>
            Đội ngũ <span className="qtm-gradient-text">Nhân viên</span>
          </h1>
          <p>Quản lý thông tin và danh thiếp của đội ngũ QTM.</p>
        </div>
        <Link className="btn btn-primary group" href="/admin/employees/new">
          <Plus size={16} />
          Thêm nhân viên
          <ArrowRight
            size={15}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      </div>
      {error && <p role="alert" className="panel text-red-400">{error}</p>}
      <section className="panel" data-aos="fade-up" data-aos-delay="100">
        <div className="table-toolbar">
          <label className="search-box">
            <Search size={16} />
            <input
              aria-label="Tìm nhân viên"
              placeholder="Tìm tên, chức vụ hoặc email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <p>{ready ? employees.length : "…"} nhân viên trong đội ngũ</p>
        </div>
        {!ready ? (
          <Skeleton />
        ) : (
          <>
            <EmployeeTable employees={filtered} />
            <p className="table-bottom">
              Hiển thị {filtered.length} / {employees.length} nhân viên
            </p>
          </>
        )}
      </section>
    </>
  );
}
