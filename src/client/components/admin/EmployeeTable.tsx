"use client";
import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import type { Employee } from "@/shared/types";
import { Avatar } from "@/client/components/ui/Avatar";
import { Switch } from "@/client/components/ui/Switch";
import { Spinner } from "@/client/components/ui/Spinner";
import { Modal } from "@/client/components/ui/Modal";
import { useToast } from "@/client/components/ui/Toast";
import { useEmployeeMutations } from "@/client/hooks/useEmployeeMutations";
import { routes } from "@/shared/constants/routes";
export function EmployeeTable({ employees }: { employees: Employee[] }) {
  const [deleting, setDeleting] = useState<Employee | null>(null);
  const [removing, setRemoving] = useState(false);
  const closeDelete = () => { if (!removing) setDeleting(null); };
  const { remove, toggleActive, isToggling } = useEmployeeMutations();
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
                      disabled={isToggling(e.id)}
                      label={`Bật danh thiếp của ${e.fullName}`}
                      onChange={async () => {
                        try {
                          await toggleActive(e.id);
                          toast(
                            e.isActive
                              ? "Đã tắt danh thiếp"
                              : "Đã bật danh thiếp",
                          );
                        } catch (err) {
                          toast(
                            err instanceof Error ? err.message : "Không thể đổi trạng thái",
                            "error",
                          );
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
        <Modal title="Xác nhận xóa nhân viên" onClose={closeDelete}>
          <p className="confirmation">
            Bạn có chắc muốn xóa nhân viên <strong>{deleting.fullName}</strong> không?
            Danh thiếp và liên kết của nhân viên này sẽ không còn khả dụng.
          </p>
          <div className="button-row justify-end">
            <button
              className="btn btn-secondary"
              disabled={removing}
              onClick={closeDelete}
            >
              Hủy
            </button>
            <button
              className="btn btn-danger"
              disabled={removing}
              onClick={async () => {
                setRemoving(true);
                try {
                  await remove(deleting.id);
                  setDeleting(null);
                  toast("Đã xóa nhân viên");
                } catch (err) {
                  toast(
                    err instanceof Error ? err.message : "Không thể xóa nhân viên",
                    "error",
                  );
                } finally {
                  setRemoving(false);
                }
              }}
            >
              {removing ? <Spinner size={14} /> : null}
              {removing ? "Đang xóa…" : "Xóa nhân viên"}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
