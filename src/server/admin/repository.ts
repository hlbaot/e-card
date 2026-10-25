import "server-only";
import { prisma } from "@/server/db/prisma";
import type { EmployeeCreate, EmployeePatch } from "./dto";
import type { CardRecord } from "@/server/cards/service";

export interface AdminEmployeesRepository {
  list(): Promise<CardRecord[]>;
  byId(id: string): Promise<CardRecord | null>;
  create(input: EmployeeCreate, slug: string): Promise<CardRecord>;
  update(id: string, input: EmployeePatch): Promise<CardRecord>;
  toggle(id: string): Promise<CardRecord | null>;
  remove(id: string): Promise<boolean>;
  stats(): Promise<{ total: number; active: number; inactive: number }>;
}
export const adminEmployeesRepository: AdminEmployeesRepository = {
  list: () => prisma.employee.findMany({ where: { deletedAt: null }, include: { theme: true }, orderBy: [{ createdAt: "desc" }, { id: "asc" }] }),
  byId: (id) => prisma.employee.findFirst({ where: { id, deletedAt: null }, include: { theme: true } }),
  create(input, slug) {
    const { theme, publicFields, ...data } = input;
    void publicFields; // DTO tương thích FE, schema hiện công khai mọi trường liên hệ.
    // Nested write và offices JSON nằm trong một transaction: không tạo card dở dang.
    return prisma.$transaction((tx) => tx.employee.create({
      data: { ...data, slug, theme: { create: theme } }, include: { theme: true },
    }));
  },
  update(id, input) {
    const { theme, publicFields, ...data } = input;
    void publicFields; // DTO tương thích FE, schema hiện công khai mọi trường liên hệ.
    // Chỉ cập nhật bản chưa xóa; slug không nằm trong DTO nên luôn được giữ nguyên.
    return prisma.$transaction((tx) => tx.employee.update({
      where: { id, deletedAt: null },
      data: { ...data, ...(theme ? { theme: { upsert: { create: theme, update: theme } } } : {}) },
      include: { theme: true },
    }));
  },
  toggle(id) {
    return prisma.$transaction(async (tx) => {
      // Đảo boolean ngay trong SQL để hai request đồng thời không ghi cùng giá trị cũ.
      const rows = await tx.$queryRaw<{ id: string }[]>`
        UPDATE employees SET is_active = NOT is_active, updated_at = NOW()
        WHERE id = ${id}::uuid AND deleted_at IS NULL RETURNING id
      `;
      return rows.length ? tx.employee.findUnique({ where: { id }, include: { theme: true } }) : null;
    });
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
