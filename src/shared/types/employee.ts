export type TemplateId =
  | "bubble-blue"
  | "minimal-line"
  | "dark-tech"
  | "editorial"
  | "aurora"
  | "luxury"
  | "botanical"
  | "creative";
export type AvatarSize = "sm" | "md" | "lg";
export type AvatarShape = "circle" | "rounded";
export type ButtonStyle = "filled" | "soft" | "outline";
export type DecorKey = "blobs" | "circles" | "skyline" | "waves" | "bokeh";
export interface CardTheme {
  templateId: TemplateId;
  backgroundId: string;
  decor: DecorKey[];
  shapes: Record<string, boolean>;
  primaryColor: string;
  avatarSize: AvatarSize;
  avatarShape: AvatarShape;
  buttonStyle: ButtonStyle;
  showDecor?: boolean;
  decorOpacity?: number;
}
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
  _employee?: Partial<Pick<Employee, "publicFields">> | null,
): PublicFields {
  // Every contact field is public.
  return { ...DEFAULT_PUBLIC_FIELDS };
}
