import { readBusinessCardChoice } from "./business-card-theme";
import type { employeeCardSelect } from "./select";
import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { DEFAULT_PUBLIC_FIELDS } from "@/shared/types";
import type { Employee } from "@/shared/types";
import { localizeEmployee } from "@/shared/utils/localize";

export type CardRecord = Prisma.EmployeeGetPayload<{ select: typeof employeeCardSelect }>;
export interface CardsRepository {
  list(): Promise<CardRecord[]>;
  bySlug(slug: string): Promise<CardRecord | null>;
}
const offices = z.array(z.object({ label: z.string(), address: z.string() }));
const template = z.enum(["bubble-blue", "minimal-line", "dark-tech", "editorial", "aurora", "luxury", "botanical", "creative"]);
const decor = z.array(z.enum(["blobs", "cyber-magazine", "circles", "skyline", "waves", "bokeh", "leaves", "network", "geometry", "crystals"])).transform(keys => keys.map(key => key === "circles" ? "cyber-magazine" as const : key));

// DTO chỉ chứa dữ liệu public, không đưa deletedAt hoặc khóa quan hệ theme ra JSON.
export function toPublicCard(record: CardRecord): Employee {
  const theme = record.theme;
  return localizeEmployee({
    id: record.id, slug: record.slug, fullName: record.fullName, position: record.position,
    company: record.company, companyShort: record.companyShort, website: record.website,
    offices: offices.parse(record.offices), avatarUrl: record.avatarUrl ?? "",
    phone: record.phone ?? "", email: record.email ?? "", zalo: record.zalo ?? "",
    slogan: record.slogan ?? "", isActive: record.isActive, allowIndexing: record.allowIndexing,
    publicFields: { ...DEFAULT_PUBLIC_FIELDS },
    createdAt: record.createdAt.toISOString(), updatedAt: record.updatedAt.toISOString(),
    // Card chưa có theme vẫn hiển thị được bằng giao diện mặc định.
    theme: theme ? {
      templateId: template.parse(theme.templateId), backgroundId: theme.backgroundId,
      primaryColor: theme.primaryColor, avatarSize: theme.avatarSize,
      avatarShape: theme.avatarShape, buttonStyle: theme.buttonStyle,
      decor: decor.parse(theme.decor),
      ...readBusinessCardChoice(z.record(z.string(), z.boolean()).parse(theme.shapes)),
      showDecor: theme.showDecor, decorOpacity: theme.decorOpacity,
    } : {
      templateId: "bubble-blue", backgroundId: "white-clean", primaryColor: "#0F4C75",
      avatarSize: "lg", avatarShape: "circle", buttonStyle: "soft",
      decor: ["blobs"], shapes: {}, showDecor: true, decorOpacity: 35,
    },
  });
}
const isVisible = (record: CardRecord) => record.isActive && record.deletedAt === null;
export function createCardsService(repository: CardsRepository) {
  return {
    async list(): Promise<Employee[]> {
      return (await repository.list()).filter(isVisible).map(toPublicCard);
    },
    async bySlug(slug: string): Promise<Employee | null> {
      if (!slug || slug.length > 120) return null;
      const record = await repository.bySlug(slug);
      return record && isVisible(record) ? toPublicCard(record) : null;
    },
  };
}
