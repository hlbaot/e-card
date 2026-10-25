import "server-only";
import { prisma } from "@/server/db/prisma";

// Lọc ngay trong SQL: public không được đọc card ẩn hoặc đã xóa mềm.
const visible = { isActive: true, deletedAt: null } as const;
export const cardsRepository = {
  list: () => prisma.employee.findMany({
    where: visible, include: { theme: true },
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
  }),
  bySlug: (slug: string) => prisma.employee.findFirst({
    where: { ...visible, slug }, include: { theme: true },
  }),
};
