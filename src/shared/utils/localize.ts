import { migrateCardTheme } from "./migrate-theme";
import { getPublicFields } from "@/shared/types";
import type { Employee } from "@/shared/types";
// Giữ nguyên nội dung người dùng, chỉ chuẩn hóa cấu hình theme/publicFields.
export function localizeEmployee(e: Employee): Employee {
  return {
    ...e,
    theme: migrateCardTheme(e.theme),
    allowIndexing: e.allowIndexing ?? false,
    publicFields: getPublicFields(e),
    fullName: e.fullName,
    position: e.position,
    company: e.company,
    slogan: e.slogan,
    offices: e.offices.map((o) => ({
      label: o.label,
      address: o.address,
    })),
  };
}
