"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { useEmployees } from "@/client/hooks/useEmployees";
import { useAos } from "@/client/hooks/useAos";
import { Skeleton } from "@/client/components/ui/Skeleton";
import { Modal } from "@/client/components/ui/Modal";
import { useToast } from "@/client/components/ui/Toast";
import { PageHeader } from "@/client/components/admin/dashboard/PageHeader";
import { StatGrid } from "@/client/components/admin/dashboard/StatGrid";
import { PromoBanner } from "@/client/components/admin/dashboard/PromoBanner";
import { TeamTable } from "@/client/components/admin/dashboard/TeamTable";

export function AdminDashboardView() {
  const { employees, ready, reset } = useEmployees();
  useAos(ready);
  const [confirm, setConfirm] = useState(false);
  const toast = useToast();

  if (!ready) return <Skeleton />;

  const total = employees.length;
  const active = employees.filter((e) => e.isActive).length;
  const inactive = total - active;

  return (
    <div className="mx-auto w-full max-w-[1280px] space-y-6">
      <div data-aos="fade-up" data-aos-delay="40">
        <PageHeader
          title="Tổng quan"
          subtitle="Chào mừng bạn đến với không gian quản trị E-card."
        />
      </div>

      <div data-aos="fade-up" data-aos-delay="80">
        <StatGrid total={total} active={active} inactive={inactive} />
      </div>

      <div data-aos="fade-up" data-aos-delay="120">
        <PromoBanner />
      </div>

      <div data-aos="fade-up" data-aos-delay="160">
        <TeamTable employees={employees.slice(0, 5)} totalCount={total} />
      </div>

      <section
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-dashed border-cyan-300/20 bg-white/[0.02] px-5 py-4 sm:px-6"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        <div>
          <h3 className="text-sm font-semibold text-[var(--ink)]">
            Dữ liệu dùng thử
          </h3>
          <p className="mt-1 text-xs text-[var(--muted)] leading-relaxed">
            Khôi phục 6 nhân viên mẫu và giao diện ban đầu. Các thay đổi hiện
            tại sẽ bị thay thế.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-secondary shrink-0 text-xs"
          onClick={() => setConfirm(true)}
        >
          <RotateCcw size={14} />
          Khôi phục dữ liệu mẫu
        </button>
      </section>

      {confirm && (
        <Modal title="Khôi phục dữ liệu mẫu?" onClose={() => setConfirm(false)}>
          <p className="confirmation">
            Thao tác này thay thế toàn bộ nhân viên và tùy chỉnh hiện tại bằng
            danh sách nhân viên mẫu mặc định.
          </p>
          <div className="button-row justify-end">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setConfirm(false)}
            >
              Hủy
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={async () => {
                await reset();
                setConfirm(false);
                toast("Đã khôi phục dữ liệu mẫu");
              }}
            >
              Khôi phục
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
