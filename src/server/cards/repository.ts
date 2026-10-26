import "server-only";
import { prisma } from "@/server/db/prisma";
import { employeeCardSelect } from "@/server/cards/select";

// Lọc ngay trong SQL: public không được đọc card ẩn hoặc đã xóa mềm.
const visible = { isActive: true, deletedAt: null } as const;
export const cardsRepository = {
  isVisible: async (slug: string) => Boolean(await prisma.employee.findFirst({
    where: { ...visible, slug }, select: { id: true },
  })),
  list: () => prisma.employee.findMany({
    where: visible, select: employeeCardSelect,
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
  }),
  bySlug: async (slug: string) => prisma.employee.findFirst({
    where: { ...visible, slug }, select: employeeCardSelect,
  }),
};
