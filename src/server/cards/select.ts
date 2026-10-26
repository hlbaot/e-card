import type { Prisma } from "@prisma/client";

// Fields needed by visibility checks and the public/admin Employee DTO. Selecting
// the relation once avoids a query per card; its unused employeeId is omitted.
export const employeeCardSelect = {
  id: true, slug: true, fullName: true, position: true, company: true, companyShort: true,
  website: true, offices: true, email: true, phone: true, zalo: true, slogan: true,
  avatarUrl: true, isActive: true, allowIndexing: true, createdAt: true, updatedAt: true, deletedAt: true,
  theme: { select: { templateId: true, backgroundId: true, primaryColor: true,
    avatarSize: true, avatarShape: true, buttonStyle: true, decor: true, shapes: true,
    showDecor: true, decorOpacity: true } },
} as const satisfies Prisma.EmployeeSelect;
