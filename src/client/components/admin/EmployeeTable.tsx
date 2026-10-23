"use client";
import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import type { Employee } from "@/shared/types/employee";
import { Avatar } from "@/client/components/ui/Avatar";
import { Switch } from "@/client/components/ui/Switch";
import { Modal } from "@/client/components/ui/Modal";
import { useToast } from "@/client/components/ui/Toast";
import { useEmployees } from "@/client/hooks/useEmployees";
import { routes } from "@/shared/constants/routes";
export function EmployeeTable({ employees }: { employees: Employee[] }) {
  const [deleting, setDeleting] = useState<Employee | null>(null);
  const { remove, toggleActive } = useEmployees();
  const toast = useToast();
  return (
    <>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nhân viên</th>
              <th>Chức vụ</th>
              <th>Liên hệ</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((e) => (
              <tr key={e.id}>
                <td>
                  <div className="employee-cell">
                    <Avatar
                      name={e.fullName}
                      src={e.avatarUrl}
                      size={37}
                      color={e.theme.primaryColor}
                    />
                    <div>
                      <strong>{e.fullName}</strong>
                      <small>{e.companyShort}</small>
                    </div>
                  </div>
                </td>
                <td>{e.position}</td>
                <td>
                  <div>{e.phone}</div>
                  <small className="muted">{e.email}</small>
                </td>
                <td>
                  <div className="button-row">
                    <Switch
                      checked={e.isActive}
                      label={`Bật danh thiếp của ${e.fullName}`}
                      onChange={async () => {
                        try {
                          await toggleActive(e.id);
                          toast(
                            e.isActive
                              ? "Đã tắt danh thiếp"
                              : "Đã bật danh thiếp",
                          );
                        } catch {
                          toast("Không thể đổi trạng thái");
                        }
                      }}
                    />
                    <span className={`status ${e.isActive ? "" : "off"}`}>
                      {e.isActive ? "Đang bật" : "Đã tắt"}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="row-actions">
                    <Link
                      className="icon-button"
                      href={routes.employee(e.id)}
                      aria-label={`Sửa ${e.fullName}`}
                    >
                      <Pencil size={15} />
                    </Link>
                    <button
                      className="icon-button"
                      aria-label={`Xóa ${e.fullName}`}
                      onClick={() => setDeleting(e)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {employees.length === 0 && (
          <div className="empty">Không có nhân viên phù hợp.</div>
        )}
      </div>
      {deleting && (
        <Modal title="Xóa nhân viên?" onClose={() => setDeleting(null)}>
          <p className="confirmation">
            Bạn muốn xóa <strong>{deleting.fullName}</strong>? Danh thiếp và
            liên kết của nhân viên này sẽ không còn khả dụng.
          </p>
          <div className="button-row justify-end">
            <button
              className="btn btn-secondary"
              onClick={() => setDeleting(null)}
            >
              Hủy
            </button>
            <button
              className="btn btn-danger"
              onClick={async () => {
                try {
                  await remove(deleting.id);
                  setDeleting(null);
                  toast("Đã xóa nhân viên");
                } catch {
                  toast("Không thể xóa nhân viên");
                }
              }}
            >
              Xóa nhân viên
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
