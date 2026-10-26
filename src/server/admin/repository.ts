import "server-only";
import { prisma } from "@/server/db/prisma";
import { employeeCardSelect } from "@/server/cards/select";
import type { EmployeeCreate, EmployeePatch } from "./dto";
import type { EmployeeStats } from "@/shared/types";
import type { CardRecord } from "@/server/cards/service";

export interface AdminEmployeesRepository {
  list(): Promise<CardRecord[]>;
  byId(id: string): Promise<CardRecord | null>;
  create(input: EmployeeCreate, slug: string): Promise<CardRecord>;
  update(id: string, input: EmployeePatch): Promise<CardRecord>;
  toggle(id: string): Promise<CardRecord | null>;
  remove(id: string): Promise<boolean>;
  stats(): Promise<EmployeeStats>;
}
export const adminEmployeesRepository: AdminEmployeesRepository = {
  list: () => prisma.employee.findMany({ where: { deletedAt: null }, select: employeeCardSelect, orderBy: [{ createdAt: "desc" }, { id: "asc" }] }),
  byId: (id) => prisma.employee.findFirst({ where: { id, deletedAt: null }, select: employeeCardSelect }),
  create(input, slug) {
    const { theme, publicFields, ...data } = input;
    void publicFields; // DTO tương thích FE, schema hiện công khai mọi trường liên hệ.
    return prisma.employee.create({
      data: { ...data, slug, theme: { create: theme } }, select: employeeCardSelect,
    });
  },
  update(id, input) {
    const { theme, publicFields, ...data } = input;
    void publicFields; // DTO tương thích FE, schema hiện công khai mọi trường liên hệ.
    // Chỉ cập nhật bản chưa xóa; slug không nằm trong DTO nên luôn được giữ nguyên.
    return prisma.employee.update({
      where: { id, deletedAt: null },
      data: { ...data, ...(theme ? { theme: { upsert: { create: theme, update: theme } } } : {}) },
      select: employeeCardSelect,
    });
  },
  async toggle(id) {
    // Đảo boolean trực tiếp bằng 1 câu UPDATE ... RETURNING, bỏ interactive transaction (BEGIN/COMMIT) để giảm round-trip.
    const rows = await prisma.$queryRaw<{ id: string }[]>`
      UPDATE employees SET is_active = NOT is_active, updated_at = NOW()
      WHERE id = ${id}::uuid AND deleted_at IS NULL RETURNING id
    `;
    return rows.length
      ? prisma.employee.findUnique({ where: { id }, select: employeeCardSelect })
      : null;
  },
  async remove(id) {
    const result = await prisma.employee.updateMany({
      where: { id, deletedAt: null }, data: { deletedAt: new Date(), isActive: false },
    });
    return result.count === 1;
  },
  async stats() {
    // Một truy vấn cho cả 3 số để thống kê không lệch nhau khi có ghi đồng thời.
    const groups = await prisma.employee.groupBy({ by: ["isActive"], where: { deletedAt: null }, _count: { _all: true } });
    const active = groups.find((group) => group.isActive)?._count._all ?? 0;
    const inactive = groups.find((group) => !group.isActive)?._count._all ?? 0;
    return { total: active + inactive, active, inactive };
  },
};
