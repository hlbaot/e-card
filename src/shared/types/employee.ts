import type { CardTheme } from "./card";

export interface Office {
  label: string;
  address: string;
}
export interface PublicFields {
  phone: boolean;
  email: boolean;
  zalo: boolean;
  website: boolean;
  offices: boolean;
}
export const DEFAULT_PUBLIC_FIELDS: PublicFields = {
  phone: true,
  email: true,
  zalo: true,
  website: true,
  offices: true,
};
export interface Employee {
  id: string;
  slug: string;
  fullName: string;
  position: string;
  company: string;
  companyShort: string;
  avatarUrl: string;
  phone: string;
  email: string;
  zalo: string;
  website: string;
  offices: Office[];
  slogan: string;
  isActive: boolean;
  allowIndexing: boolean;
  publicFields: PublicFields;
  theme: CardTheme;
  createdAt: string;
  updatedAt: string;
}
export function getPublicFields(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _employee?: Partial<Pick<Employee, "publicFields">> | null,
): PublicFields {
  // Every contact field is public.
  return { ...DEFAULT_PUBLIC_FIELDS };
}

export type EmployeeInput = Omit<Employee, "id" | "slug" | "createdAt" | "updatedAt">;
export interface EmployeeStats {
  total: number;
  active: number;
  inactive: number;
}
