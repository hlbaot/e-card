import { z } from "zod";
import { backgrounds } from "@/config/card-themes";
import { websiteUrl } from "@/shared/utils/vcard";

const text = (max: number) => z.string().trim().max(max);
const safeImage = text(2048).refine((value) => {
  if (!value) return true;
  if (value.startsWith("/images/")) return !value.includes("\\") && !value.includes("..");
  try { return new URL(value).protocol === "https:"; } catch { return false; }
}, "Ảnh phải là URL HTTPS hoặc đường dẫn /images/.");
const styleIds = ["bubble-blue", "minimal-line", "dark-tech", "editorial", "aurora", "luxury", "botanical", "creative"] as const;
export const themeInput = z.object({
  templateId: z.enum(styleIds),
  styleId: z.enum(styleIds).optional(),
  paletteId: text(64).optional(),
  backgroundId: text(32).refine((value) => backgrounds.some((background) => background.id === value), "Nền không hợp lệ."),
  primaryColor: z.string().regex(/^#[a-fA-F0-9]{6}$/, "Mã màu không hợp lệ."),
  avatarSize: z.enum(["sm", "md", "lg"]), avatarShape: z.enum(["circle", "rounded"]),
  buttonStyle: z.enum(["filled", "soft", "outline"]),
  decor: z.array(z.enum(["blobs", "circles", "skyline", "waves", "bokeh", "leaves", "network", "geometry", "crystals"])).max(8),
  shapes: z.record(z.string().max(64), z.boolean()).refine((value) => Object.keys(value).length <= 32),
  showDecor: z.boolean().default(true), decorOpacity: z.number().int().min(0).max(100).default(35),
}).strict().transform(({ styleId, paletteId: _paletteId, ...rest }) => {
  void _paletteId;
  return {
    ...rest,
    templateId: rest.templateId || styleId || "bubble-blue",
  };
});
export const employeeInput = z.object({
  fullName: text(150).min(1, "Vui lòng nhập họ tên."), position: text(150),
  company: text(255), companyShort: text(150),
  website: text(2048).refine((value) => !value || Boolean(websiteUrl(value)), "Website không hợp lệ."),
  email: z.union([z.literal(""), text(255).email()]), phone: text(30), zalo: text(30),
  slogan: text(255), avatarUrl: safeImage, isActive: z.boolean(), allowIndexing: z.boolean(),
  offices: z.array(z.object({ label: text(150), address: text(1000) }).strict()).max(20),
  // Hiện hệ thống công khai toàn bộ liên hệ, chưa hỗ trợ ẩn riêng từng trường.
  publicFields: z.object({ phone: z.literal(true), email: z.literal(true), zalo: z.literal(true), website: z.literal(true), offices: z.literal(true) }).strict().optional(),
  theme: themeInput,
}).strict();
export const employeePatch = employeeInput.partial().refine((value) => Object.keys(value).length > 0, "Không có dữ liệu cập nhật.");
export type EmployeeCreate = z.infer<typeof employeeInput>;
export type EmployeePatch = z.infer<typeof employeePatch>;
